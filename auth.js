/**
 * ============================================================================
 * MYSTERBOX AUTH + SHARED CLIENT HELPERS
 * ============================================================================
 * - Shows the sign-in / create-account popup as soon as a page opens and the
 *   visitor has no valid session (it cannot be dismissed).
 * - Validates the forms in the browser, then submits them to the local server
 *   which stores the data in ./data/*.json.
 * - Exposes window.MBAuth: { ready, user, api, esc, isEmail, logout }.
 *
 * Load this script on every page (before mysterybox.js).
 */
(function () {
  'use strict';

  var AUTH_KEY = 'mb_auth';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // ---- small utilities ----------------------------------------------------
  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function readAuth() {
    try {
      var raw = localStorage.getItem(AUTH_KEY);
      var parsed = raw ? JSON.parse(raw) : null;
      return parsed && parsed.token && parsed.user ? parsed : null;
    } catch (e) { return null; }
  }

  function writeAuth(data) {
    try { localStorage.setItem(AUTH_KEY, JSON.stringify(data)); } catch (e) {}
  }

  function clearAuth() {
    try { localStorage.removeItem(AUTH_KEY); } catch (e) {}
  }

  // ---- API helper ---------------------------------------------------------
  function api(path, options) {
    options = options || {};
    var headers = { 'Accept': 'application/json' };
    var auth = readAuth();
    if (auth) headers['Authorization'] = 'Bearer ' + auth.token;
    var init = { method: options.method || 'GET', headers: headers };
    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(options.body);
    }
    return fetch(path, init).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) {
          var err = new Error(data.error || 'Request failed (' + res.status + ').');
          err.status = res.status;
          err.fields = data.fields || {};
          if (res.status === 401 && !options.noAuthRedirect && readAuth()) {
            clearAuth();
            showModal();
          }
          throw err;
        }
        return data;
      });
    }, function () {
      var err = new Error('Cannot reach the MysteryBox server. Start it with "npm start" and reload this page.');
      err.status = 0;
      err.fields = {};
      throw err;
    });
  }

  // ---- ready promise ------------------------------------------------------
  var resolveReady;
  var ready = new Promise(function (resolve) { resolveReady = resolve; });

  // ---- sign-in popup ------------------------------------------------------
  var modalEl = null;
  var lastFocus = null;

  function buildModal() {
    var el = document.createElement('div');
    el.className = 'mb-auth-backdrop';
    el.id = 'mbAuthModal';
    el.innerHTML = [
      '<div class="mb-auth-dialog" role="dialog" aria-modal="true" aria-labelledby="mbAuthTitle">',
      '  <div class="mb-auth-brand">🔍 Mystery<span>Box</span></div>',
      '  <h2 id="mbAuthTitle">Detective Sign-In</h2>',
      '  <p class="mb-auth-sub">Sign in to open your case files. Your progress, interrogations and verdicts are saved to your profile.</p>',
      '  <div class="mb-auth-tabs" role="tablist">',
      '    <button type="button" class="mb-auth-tab is-active" role="tab" data-mode="login" aria-selected="true">Sign In</button>',
      '    <button type="button" class="mb-auth-tab" role="tab" data-mode="register" aria-selected="false">Create Account</button>',
      '  </div>',
      '  <div class="mb-auth-alert" id="mbAuthAlert" role="alert" hidden></div>',

      '  <form id="mbLoginForm" class="mb-auth-form" novalidate>',
      '    <div class="mb-field"><label for="loginEmail">Email</label>',
      '      <input id="loginEmail" name="email" type="email" autocomplete="email" placeholder="detective@example.com" />',
      '      <span class="mb-field-error" data-error-for="email"></span></div>',
      '    <div class="mb-field"><label for="loginPassword">Password</label>',
      '      <div class="mb-pw-wrap"><input id="loginPassword" name="password" type="password" autocomplete="current-password" placeholder="Your password" />',
      '      <button type="button" class="mb-pw-toggle" aria-label="Show password">Show</button></div>',
      '      <span class="mb-field-error" data-error-for="password"></span></div>',
      '    <button type="submit" class="btn mb-auth-submit">Sign In →</button>',
      '  </form>',

      '  <form id="mbRegisterForm" class="mb-auth-form" novalidate hidden>',
      '    <div class="mb-field"><label for="regName">Full name</label>',
      '      <input id="regName" name="name" type="text" autocomplete="name" placeholder="e.g. Sherlock Holmes" maxlength="60" />',
      '      <span class="mb-field-error" data-error-for="name"></span></div>',
      '    <div class="mb-field"><label for="regEmail">Email</label>',
      '      <input id="regEmail" name="email" type="email" autocomplete="email" placeholder="detective@example.com" />',
      '      <span class="mb-field-error" data-error-for="email"></span></div>',
      '    <div class="mb-field"><label for="regPassword">Password</label>',
      '      <div class="mb-pw-wrap"><input id="regPassword" name="password" type="password" autocomplete="new-password" placeholder="8+ characters, letters and numbers" />',
      '      <button type="button" class="mb-pw-toggle" aria-label="Show password">Show</button></div>',
      '      <div class="mb-strength" aria-hidden="true"><div class="mb-strength-bar" id="mbStrengthBar"></div></div>',
      '      <span class="mb-strength-label" id="mbStrengthLabel"></span>',
      '      <span class="mb-field-error" data-error-for="password"></span></div>',
      '    <div class="mb-field"><label for="regConfirm">Confirm password</label>',
      '      <input id="regConfirm" name="confirm" type="password" autocomplete="new-password" placeholder="Repeat your password" />',
      '      <span class="mb-field-error" data-error-for="confirm"></span></div>',
      '    <button type="submit" class="btn mb-auth-submit">Create Account →</button>',
      '  </form>',
      '</div>'
    ].join('\n');
    return el;
  }

  function setFieldError(form, name, message) {
    var span = form.querySelector('[data-error-for="' + name + '"]');
    var input = form.elements[name];
    if (span) span.textContent = message || '';
    if (input) {
      input.classList.toggle('is-invalid', !!message);
      if (message) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    }
  }

  function passwordScore(pw) {
    var score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Za-z]/.test(pw) && /\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw) || (/[a-z]/.test(pw) && /[A-Z]/.test(pw))) score++;
    return score; // 0-4
  }

  var validators = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Enter your name (at least 2 characters).'; },
    email: function (v) { return EMAIL_RE.test(v.trim()) ? '' : 'Enter a valid email address.'; },
    loginPassword: function (v) { return v ? '' : 'Enter your password.'; },
    password: function (v) {
      return (v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v)) ? '' : 'Use 8+ characters with at least one letter and one number.';
    }
  };

  function showAlert(message, type) {
    var box = document.getElementById('mbAuthAlert');
    if (!box) return;
    if (!message) { box.hidden = true; box.textContent = ''; return; }
    box.hidden = false;
    box.className = 'mb-auth-alert' + (type === 'success' ? ' is-success' : '');
    box.textContent = message;
  }

  function setMode(mode) {
    var isLogin = mode === 'login';
    modalEl.querySelectorAll('.mb-auth-tab').forEach(function (tab) {
      var active = tab.getAttribute('data-mode') === mode;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    document.getElementById('mbLoginForm').hidden = !isLogin;
    document.getElementById('mbRegisterForm').hidden = isLogin;
    document.getElementById('mbAuthTitle').textContent = isLogin ? 'Detective Sign-In' : 'Join the Investigation';
    showAlert('');
    var first = (isLogin ? document.getElementById('loginEmail') : document.getElementById('regName'));
    if (first) first.focus();
  }

  function finishLogin(data) {
    writeAuth({ token: data.token, user: { id: data.user.id, name: data.user.name, email: data.user.email } });
    showAlert('Welcome, ' + data.user.name + '! Opening your case files…', 'success');
    // Progress is stored per detective, so reload to render that detective's state.
    setTimeout(function () { window.location.reload(); }, 600);
  }

  function handleSubmit(form, mode) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showAlert('');
      var vals = {};
      Array.prototype.forEach.call(form.elements, function (el) { if (el.name) vals[el.name] = el.value; });

      var errors = {};
      if (mode === 'register') {
        errors.name = validators.name(vals.name);
        errors.email = validators.email(vals.email);
        errors.password = validators.password(vals.password);
        errors.confirm = vals.confirm === vals.password ? (vals.confirm ? '' : 'Repeat your password.') : 'Passwords do not match.';
      } else {
        errors.email = validators.email(vals.email);
        errors.password = validators.loginPassword(vals.password);
      }

      var firstBad = null;
      Object.keys(errors).forEach(function (name) {
        setFieldError(form, name, errors[name]);
        if (errors[name] && !firstBad) firstBad = form.elements[name];
      });
      if (firstBad) { firstBad.focus(); return; }

      var btn = form.querySelector('.mb-auth-submit');
      var label = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Please wait…';

      var payload = mode === 'register'
        ? { name: vals.name, email: vals.email, password: vals.password }
        : { email: vals.email, password: vals.password };

      api(mode === 'register' ? '/api/register' : '/api/login', { method: 'POST', body: payload, noAuthRedirect: true })
        .then(finishLogin)
        .catch(function (err) {
          btn.disabled = false;
          btn.textContent = label;
          var shown = false;
          Object.keys(err.fields || {}).forEach(function (name) {
            if (form.elements[name]) { setFieldError(form, name, err.fields[name]); shown = true; }
          });
          if (!shown || err.status === 0 || err.status === 429) showAlert(err.message);
        });
    });

    // Live validation once a field has been touched
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name) return;
      el.addEventListener('blur', function () {
        if (!el.value && mode === 'login') return;
        var msg = '';
        if (el.name === 'name') msg = validators.name(el.value);
        else if (el.name === 'email') msg = validators.email(el.value);
        else if (el.name === 'password') msg = mode === 'register' ? validators.password(el.value) : validators.loginPassword(el.value);
        else if (el.name === 'confirm') msg = el.value === form.elements.password.value ? '' : 'Passwords do not match.';
        setFieldError(form, el.name, msg);
      });
      el.addEventListener('input', function () {
        if (el.classList.contains('is-invalid')) setFieldError(form, el.name, '');
      });
    });
  }

  function trapFocus(e) {
    if (e.key !== 'Tab' || !modalEl) return;
    var focusable = modalEl.querySelectorAll('button:not([disabled]), input:not([disabled])');
    var visible = Array.prototype.filter.call(focusable, function (n) { return n.offsetParent !== null; });
    if (!visible.length) return;
    var first = visible[0], last = visible[visible.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function showModal(message) {
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', function () { showModal(message); });
      return;
    }
    if (modalEl) { if (message) showAlert(message); return; }
    lastFocus = document.activeElement;
    modalEl = buildModal();
    document.body.appendChild(modalEl);
    document.documentElement.classList.add('mb-auth-locked');

    modalEl.querySelectorAll('.mb-auth-tab').forEach(function (tab) {
      tab.addEventListener('click', function () { setMode(tab.getAttribute('data-mode')); });
    });
    modalEl.querySelectorAll('.mb-pw-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = btn.parentNode.querySelector('input');
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.textContent = show ? 'Hide' : 'Show';
        btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      });
    });

    handleSubmit(document.getElementById('mbLoginForm'), 'login');
    handleSubmit(document.getElementById('mbRegisterForm'), 'register');

    var pw = document.getElementById('regPassword');
    pw.addEventListener('input', function () {
      var score = passwordScore(pw.value);
      var labels = ['', 'Weak', 'Okay', 'Good', 'Strong'];
      var bar = document.getElementById('mbStrengthBar');
      bar.style.width = (pw.value ? Math.max(1, score) * 25 : 0) + '%';
      bar.setAttribute('data-level', pw.value ? Math.max(1, score) : 0);
      document.getElementById('mbStrengthLabel').textContent = pw.value ? 'Strength: ' + labels[Math.max(1, score)] : '';
    });

    modalEl.addEventListener('keydown', trapFocus);
    // The popup is required: Escape and backdrop clicks intentionally do nothing.
    modalEl.addEventListener('keydown', function (e) { if (e.key === 'Escape') e.preventDefault(); });

    setMode('login');
    if (message) showAlert(message);
  }

  // ---- logout -------------------------------------------------------------
  function logout() {
    api('/api/logout', { method: 'POST', noAuthRedirect: true }).catch(function () {}).then(function () {
      clearAuth();
      window.location.reload(); // no session any more -> the sign-in popup opens again
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.mb-logout-btn') : null;
    if (btn) { e.preventDefault(); logout(); }
  });

  // ---- boot ---------------------------------------------------------------
  function boot() {
    var cached = readAuth();
    if (!cached) { showModal(); return; }
    api('/api/me', { noAuthRedirect: true }).then(function (data) {
      writeAuth({ token: cached.token, user: { id: data.user.id, name: data.user.name, email: data.user.email } });
      resolveReady(data.user);
    }).catch(function (err) {
      if (err.status === 401) { clearAuth(); showModal('Your session has expired. Please sign in again.'); }
      else showModal(err.message);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.MBAuth = {
    ready: ready,
    api: api,
    esc: esc,
    isEmail: function (v) { return EMAIL_RE.test(String(v).trim()); },
    user: function () { var a = readAuth(); return a ? a.user : null; },
    logout: logout
  };
})();
