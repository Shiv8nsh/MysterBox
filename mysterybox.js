/**
 * MysteryBox Core Investigation Engine
 * Handles investigation state, live timer, clues, evidence library,
 * suspects dossier, incident timeline, corkboard connections, and final solution validation.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MysteryBox = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Storage Keys
  var STORAGE_KEYS = {
    CLUE_PREFIX: 'clue',
    TIMER_START: 'mb_timer_start',
    TIMER_ELAPSED: 'mb_timer_elapsed',
    TIMER_RUNNING: 'mb_timer_running',
    ATTEMPTS: 'mb_attempts_total',
    CORRECT_ATTEMPTS: 'mb_attempts_correct',
    CASE_CLOSED: 'mb_case_closed',
    FINAL_REPORT: 'mb_final_report',
    PINNED_ITEMS: 'mb_pinned_items',
    SUSPECT_STATUS: 'mb_suspect_status'
  };

  // Clues Metadata
  var CLUES = [
    {
      id: 1,
      code: 'X7K92',
      url: 'clue/X7K92.html',
      title: 'CCTV Footage',
      time: '5:32 PM',
      question: 'What was the person in the CCTV wearing?',
      answers: ['blue hoodie', 'a blue hoodie', 'hoodie', 'blue hoody'],
      hint: 'Inspect the figure entering the lab at 5:32 PM. Look at their upper clothing and color.',
      evidenceId: 'ev_cctv_entry',
      description: 'The CCTV camera shows someone entering the computer lab at 5:32 PM wearing a blue hoodie.'
    },
    {
      id: 2,
      code: 'A4P81',
      url: 'clue/A4P81.html',
      title: 'Security Log',
      time: '5:34 PM',
      question: 'Whose access card was used to enter the lab?',
      answers: ['rohan', 'rohan patel', 'rohan\'s', 'rohan\'s card'],
      hint: 'The electronic security door log recorded a card swipe just two minutes after the figure was seen on CCTV.',
      evidenceId: 'ev_keycard',
      description: 'The security system recorded an access-card entry at 5:34 PM. The card belonged to Rohan, the lab assistant.'
    },
    {
      id: 3,
      code: 'M9Q24',
      url: 'clue/M9Q24.html',
      title: 'Chat Message',
      time: '5:31 PM',
      question: 'Whose phone sent the suspicious message?',
      answers: ['rohan', 'rohan patel', 'rohan\'s phone', 'rohans phone'],
      hint: 'A message was dispatched right before the entry stating "The lab is empty. You can get it now."',
      evidenceId: 'ev_phone_chat',
      description: 'A chat message sent at 5:31 PM says: "The lab is empty. You can get it now." Sent from Rohan\'s phone.'
    },
    {
      id: 4,
      code: 'P3L67',
      url: 'clue/P3L67.html',
      title: 'Time Contradiction',
      time: '5:42 PM',
      question: 'What time did Rohan actually enter the library?',
      answers: ['5:42 pm', '5:42pm', '5:42', '05:42 pm', '05:42pm', '05:42', '5.42 pm', '5.42'],
      hint: 'Rohan claimed he was in the library from 5:15 PM, but the automated RFID turnstile reveals his true arrival time.',
      evidenceId: 'ev_library_record',
      description: 'The library entry turnstile shows Rohan entered at 5:42 PM, refuting his claimed 5:15 PM alibi.'
    },
    {
      id: 5,
      code: 'K8Z41',
      url: 'clue/K8Z41.html',
      title: 'Final Evidence',
      time: '5:47 PM',
      question: 'Who took the laptop?',
      answers: ['rohan', 'rohan patel'],
      hint: 'The exit camera at 5:47 PM confirms the suspect leaving in the same blue hoodie. All evidence converges.',
      evidenceId: 'ev_cctv_exit',
      description: 'A final security photograph shows the person leaving the laboratory at 5:47 PM in Rohan\'s blue hoodie.'
    }
  ];

  // Evidence Items
  var EVIDENCE = [
    {
      id: 'ev_cctv_entry',
      clueId: 1,
      title: 'CCTV Surveillance: Entrance Feed',
      category: 'Physical / Digital',
      icon: '📹',
      timestamp: '5:32 PM',
      location: 'Block B, Lab 304 Outer Corridor',
      status: 'Captured',
      summary: 'Security footage captures a figure in an oversized blue hoodie entering the computer lab.',
      forensics: 'Timestamp matches precisely with the incident window. The face is hooded and obscured from overhead angle, but the distinct blue hoodie with white drawstrings is clearly identifiable.',
      suspectLink: 'Matches blue hoodie owned by Rohan Patel.',
      imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#1a252f"/><circle cx="60" cy="35" r="16" fill="#3498db"/><path d="M40 70 Q60 48 80 70 Z" fill="#2980b9"/><text x="10" y="16" fill="#27ae60" font-family="monospace" font-size="9">REC ● 17:32:14</text><rect x="52" y="60" width="16" height="4" fill="#ecf0f1"/></svg>'
    },
    {
      id: 'ev_keycard',
      clueId: 2,
      title: 'Electronic Access Log #4092',
      category: 'Digital Record',
      icon: '💳',
      timestamp: '5:34 PM',
      location: 'Room 304 Electronic Lock Terminal',
      status: 'Logged',
      summary: 'RFID reader logs Keycard #4092 authorizing single door release.',
      forensics: 'Keycard #4092 is uniquely registered in university credentials database to Rohan Patel (Lab Assistant). No reported loss or unauthorized card duplication on file.',
      suspectLink: 'Rohan Patel (Assigned Cardholder). Direct physical link to entry.',
      imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#2c3e50"/><rect x="15" y="15" width="90" height="50" rx="4" fill="#ecf0f1"/><rect x="25" y="25" width="22" height="18" fill="#f39c12"/><rect x="55" y="25" width="40" height="4" fill="#7f8c8d"/><rect x="55" y="34" width="30" height="4" fill="#bdc3c7"/><text x="25" y="56" fill="#2c3e50" font-family="monospace" font-size="8">CARD #4092</text></svg>'
    },
    {
      id: 'ev_phone_chat',
      clueId: 3,
      title: 'Encrypted SMS / Chat Record',
      category: 'Digital Communication',
      icon: '💬',
      timestamp: '5:31 PM',
      location: 'Cell Tower Sector 4 (Campus West)',
      status: 'Intercepted',
      summary: 'Outbound text sent: "The lab is empty. You can get it now."',
      forensics: 'Device IMEI traces directly to Rohan Patel\'s registered mobile device. Timestamp is exactly 1 minute prior to the blue-hoodied figure appearing at the lab entrance.',
      suspectLink: 'Rohan Patel (Device Owner). Reveals pre-meditation and coordination.',
      imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#34495e"/><rect x="20" y="10" width="80" height="60" rx="6" fill="#1e272e"/><rect x="26" y="20" width="68" height="24" rx="4" fill="#27ae60"/><text x="30" y="31" fill="#fff" font-family="sans-serif" font-size="7">The lab is empty.</text><text x="30" y="39" fill="#fff" font-family="sans-serif" font-size="7">You can get it now.</text><text x="60" y="58" fill="#95a5a6" font-family="monospace" font-size="7">17:31:02</text></svg>'
    },
    {
      id: 'ev_library_record',
      clueId: 4,
      title: 'Library RFID Turnstile Timestamp',
      category: 'Official Record / Alibi Contradiction',
      icon: '🏛️',
      timestamp: '5:42 PM',
      location: 'Central Campus Library Main Turnstiles',
      status: 'Verified Fact',
      summary: 'Turnstile B recorded Rohan entering the library at 5:42 PM, destroying his 5:15 PM alibi.',
      forensics: 'Rohan claimed under interview that he was seated in the library from 5:15 PM to 5:50 PM. Official turnstile database records his first arrival scan at 5:42 PM. An unaccounted gap of 27 minutes proves his statement is false.',
      suspectLink: 'Direct contradiction of Rohan\'s stated alibi.',
      imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#16a085"/><rect x="15" y="15" width="90" height="50" rx="3" fill="#ffffff"/><path d="M30 55 L30 25 L45 25 L45 55" stroke="#c0392b" stroke-width="3" fill="none"/><text x="50" y="32" fill="#c0392b" font-weight="bold" font-size="8">CONTRADICTION</text><text x="50" y="44" fill="#2c3e50" font-family="monospace" font-size="9">ENTRY: 17:42</text><text x="50" y="54" fill="#7f8c8d" font-size="7">CLAIMED: 17:15</text></svg>'
    },
    {
      id: 'ev_cctv_exit',
      clueId: 5,
      title: 'CCTV Surveillance: Exit & Concealment',
      category: 'Physical / Forensic',
      icon: '📸',
      timestamp: '5:47 PM',
      location: 'Block B Fire Exit Stairwell',
      status: 'Conclusive',
      summary: 'Security still captures individual in blue hoodie exiting with a padded laptop carrying case.',
      forensics: 'Subject exits through the north stairwell fire door. Identical clothing (blue hoodie, dark denim, white athletic shoes) matching Rohan Patel. Immediately after this exit, Rohan sprints toward the library turnstile logged at 5:42 PM/5:47 PM.',
      suspectLink: 'Conclusive identification of Rohan Patel as the culprit.',
      imageSvg: '<svg viewBox="0 0 120 80" class="evidence-thumb-svg"><rect width="120" height="80" fill="#2c3e50"/><rect x="35" y="15" width="50" height="50" fill="#34495e" rx="4"/><circle cx="55" cy="30" r="10" fill="#3498db"/><rect x="62" y="38" width="16" height="20" rx="2" fill="#d35400"/><text x="10" y="74" fill="#e74c3c" font-family="monospace" font-size="8">EXIT CAM ● 17:47</text></svg>'
    }
  ];

  // Suspects Dossier
  var SUSPECTS = [
    {
      id: 'rohan',
      name: 'Rohan Patel',
      role: 'Computer Lab Assistant & Senior Student',
      avatarIcon: '🧑‍💻',
      suspicionLevel: 'CRITICAL',
      suspicionPercent: 95,
      statedAlibi: 'Claims he was in the Central Campus Library studying continuously from 5:15 PM to 5:50 PM.',
      contradiction: 'Library turnstile records prove he did not arrive until 5:42 PM. His access card swiped into the lab at 5:34 PM, and his phone sent a message at 5:31 PM saying the lab was empty.',
      motive: 'Was failing his advanced systems course and sought to obtain the exclusive group project source code to submit as his own, while selling the high-spec university hardware.',
      evidenceAgainst: [
        'Electronic keycard #4092 swiped into lab at 5:34 PM',
        'Text from his mobile phone at 5:31 PM: "The lab is empty..."',
        'CCTV captures individual in his signature blue hoodie entering (5:32 PM) and exiting (5:47 PM)',
        'Library turnstile RFID entry clocked at 5:42 PM — 27 minutes after his claimed arrival'
      ],
      isCulprit: true
    },
    {
      id: 'arjun',
      name: 'Arjun Sharma',
      role: 'Computer Science Student',
      avatarIcon: '👨‍🎓',
      suspicionLevel: 'LOW',
      suspicionPercent: 15,
      statedAlibi: 'Was having tea and group study in the student cafeteria from 5:00 PM to 6:15 PM.',
      contradiction: 'None. Multiple student witnesses and cafeteria electronic POS receipt corroborate his continuous presence.',
      motive: 'Had expressed frustration over missing project files earlier in the week, but had no access credentials to Lab 304 after hours.',
      evidenceAgainst: ['No incriminating physical or digital footprint found.'],
      isCulprit: false
    },
    {
      id: 'kabir',
      name: 'Kabir Mehta',
      role: 'Student & Lab Technician Trainee',
      avatarIcon: '👨‍🔬',
      suspicionLevel: 'LOW',
      suspicionPercent: 20,
      statedAlibi: 'Studying in East Wing Dormitory Room 214 from 4:45 PM until evening roll call.',
      contradiction: 'None. Dormitory main entrance turnstile clocked his entry at 5:02 PM with no exit logged before 7:00 PM.',
      motive: 'Was a competitive candidate for the upcoming campus technology fellowship, but has a verified alibi.',
      evidenceAgainst: ['Dormitory swipe logs confirm he never left his floor during the incident.'],
      isCulprit: false
    }
  ];

  // Timeline Events
  var TIMELINE_EVENTS = [
    {
      time: '17:05',
      timeLabel: '5:05 PM',
      title: 'Laptop Last Confirmed in Lab 304',
      type: 'verified',
      location: 'Computer Lab 304 (Workstation #4)',
      description: 'Project team lead completes work and leaves laptop locked on desk Station #4 before heading to seminar.',
      clueRef: null
    },
    {
      time: '17:15',
      timeLabel: '5:15 PM',
      title: 'Rohan\'s Stated Library Arrival',
      type: 'contradiction',
      location: 'Central Campus Library',
      description: 'Rohan asserts in formal interview that he was already seated and studying in the quiet reading room.',
      contradictionNote: 'CONTRADICTED: Turnstile gate logs prove Rohan did not scan in until 5:42 PM.',
      clueRef: 4
    },
    {
      time: '17:31',
      timeLabel: '5:31 PM',
      title: 'Suspicious SMS Dispatched',
      type: 'verified',
      location: 'Cell Tower Sector 4',
      description: 'Encrypted outgoing SMS sent from Rohan\'s mobile phone: "The lab is empty. You can get it now."',
      clueRef: 3
    },
    {
      time: '17:32',
      timeLabel: '5:32 PM',
      title: 'Blue-Hoodied Figure Enters Corridor',
      type: 'verified',
      location: 'Lab 304 Exterior CCTV',
      description: 'Surveillance feed captures an individual wearing an oversized blue hoodie approaching Lab 304.',
      clueRef: 1
    },
    {
      time: '17:34',
      timeLabel: '5:34 PM',
      title: 'Lab Door Access Card Swipe Logged',
      type: 'verified',
      location: 'Room 304 Electronic Lock',
      description: 'Keycard #4092 belonging to Rohan Patel is swiped to unlock the computer lab door.',
      clueRef: 2
    },
    {
      time: '17:42',
      timeLabel: '5:42 PM',
      title: 'Actual Library Turnstile Entry',
      type: 'contradiction',
      location: 'Central Campus Library Turnstiles',
      description: 'Automated RFID turnstile records Rohan\'s actual entry. This exposes his 5:15 PM alibi as a complete fabrication.',
      clueRef: 4
    },
    {
      time: '17:47',
      timeLabel: '5:47 PM',
      title: 'Suspect Exits via Stairwell',
      type: 'verified',
      location: 'Block B Fire Exit Stairwell',
      description: 'Camera records the figure in the blue hoodie carrying a laptop bag hastily departing toward the north exit.',
      clueRef: 5
    },
    {
      time: '18:00',
      timeLabel: '6:00 PM',
      title: 'Theft Officially Reported',
      type: 'verified',
      location: 'Department Security Desk',
      description: 'Student team returns to Lab 304, discovers the laptop missing from Station #4, and triggers the investigation.',
      clueRef: null
    }
  ];

  // Corkboard Connections Map
  var CORKBOARD_NODES = [
    { id: 'n_rohan', type: 'suspect', title: 'Rohan Patel (Lab Assistant)', x: 180, y: 140, icon: '🧑‍💻', color: '#c0392b' },
    { id: 'n_cctv', type: 'evidence', title: 'Blue Hoodie CCTV (5:32 PM)', x: 440, y: 80, icon: '📹', color: '#2980b9' },
    { id: 'n_keycard', type: 'evidence', title: 'Card #4092 Swipe (5:34 PM)', x: 480, y: 220, icon: '💳', color: '#f39c12' },
    { id: 'n_sms', type: 'evidence', title: 'Phone SMS (5:31 PM)', x: 160, y: 310, icon: '💬', color: '#27ae60' },
    { id: 'n_alibi', type: 'contradiction', title: 'False Alibi (Claimed 5:15 PM)', x: 460, y: 350, icon: '⚠️', color: '#e74c3c' },
    { id: 'n_turnstile', type: 'evidence', title: 'Library Turnstile (5:42 PM)', x: 720, y: 320, icon: '🏛️', color: '#8e44ad' },
    { id: 'n_exit', type: 'evidence', title: 'Exit with Bag (5:47 PM)', x: 720, y: 130, icon: '📸', color: '#d35400' }
  ];

  var CORKBOARD_LINKS = [
    { from: 'n_rohan', to: 'n_cctv', label: 'Wears blue hoodie' },
    { from: 'n_rohan', to: 'n_keycard', label: 'His personal card #4092' },
    { from: 'n_rohan', to: 'n_sms', label: 'Sent from his phone' },
    { from: 'n_rohan', to: 'n_alibi', label: 'Fabricated alibi' },
    { from: 'n_alibi', to: 'n_turnstile', label: 'Refuted by turnstile log' },
    { from: 'n_cctv', to: 'n_exit', label: 'Same hoodie matching exit still' }
  ];

  // Helper safe storage methods
  function getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function setItem(key, val) {
    try {
      localStorage.setItem(key, val);
    } catch (e) {}
  }

  function removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }

  // State Manager
  var State = {
    // Check if clue N is solved (checks both clueN_solved and mb_clueN_solved)
    isClueSolved: function (clueNum) {
      return (
        getItem('clue' + clueNum + '_solved') === 'true' ||
        getItem(STORAGE_KEYS.CLUE_PREFIX + clueNum + '_solved') === 'true'
      );
    },

    markClueSolved: function (clueNum) {
      setItem('clue' + clueNum + '_solved', 'true');
      setItem(STORAGE_KEYS.CLUE_PREFIX + clueNum + '_solved', 'true');
      State.recordAttempt(true);
      State.ensureTimerRunning();
    },

    resetClue: function (clueNum) {
      removeItem('clue' + clueNum + '_solved');
      removeItem(STORAGE_KEYS.CLUE_PREFIX + clueNum + '_solved');
    },

    getSolvedCount: function () {
      var count = 0;
      for (var i = 1; i <= 5; i++) {
        if (State.isClueSolved(i)) count++;
      }
      return count;
    },

    areAllCluesSolved: function () {
      return State.getSolvedCount() === 5;
    },

    // Timer logic
    ensureTimerRunning: function () {
      if (getItem(STORAGE_KEYS.CASE_CLOSED) === 'true') return;
      if (!getItem(STORAGE_KEYS.TIMER_START)) {
        setItem(STORAGE_KEYS.TIMER_START, Date.now().toString());
        setItem(STORAGE_KEYS.TIMER_RUNNING, 'true');
      }
    },

    getElapsedSeconds: function () {
      var startTime = parseInt(getItem(STORAGE_KEYS.TIMER_START), 10);
      var savedElapsed = parseInt(getItem(STORAGE_KEYS.TIMER_ELAPSED) || '0', 10);
      if (!startTime) return savedElapsed;
      if (getItem(STORAGE_KEYS.CASE_CLOSED) === 'true' || getItem(STORAGE_KEYS.TIMER_RUNNING) === 'false') {
        return savedElapsed;
      }
      var now = Date.now();
      return Math.floor((now - startTime) / 1000);
    },

    formatTime: function (totalSeconds) {
      var s = totalSeconds || 0;
      var mins = Math.floor(s / 60);
      var secs = s % 60;
      var pad = function (num) {
        return num < 10 ? '0' + num : num.toString();
      };
      return pad(mins) + ':' + pad(secs);
    },

    stopTimer: function () {
      var elapsed = State.getElapsedSeconds();
      setItem(STORAGE_KEYS.TIMER_ELAPSED, elapsed.toString());
      setItem(STORAGE_KEYS.TIMER_RUNNING, 'false');
    },

    // Stats & Attempts
    recordAttempt: function (isCorrect) {
      var total = parseInt(getItem(STORAGE_KEYS.ATTEMPTS) || '0', 10) + 1;
      setItem(STORAGE_KEYS.ATTEMPTS, total.toString());
      if (isCorrect) {
        var correct = parseInt(getItem(STORAGE_KEYS.CORRECT_ATTEMPTS) || '0', 10) + 1;
        setItem(STORAGE_KEYS.CORRECT_ATTEMPTS, correct.toString());
      }
    },

    getAccuracy: function () {
      var total = parseInt(getItem(STORAGE_KEYS.ATTEMPTS) || '0', 10);
      var correct = parseInt(getItem(STORAGE_KEYS.CORRECT_ATTEMPTS) || '0', 10);
      if (total === 0) return 100;
      var acc = Math.round((correct / total) * 100);
      return Math.min(100, Math.max(30, acc));
    },

    isCaseClosed: function () {
      return getItem(STORAGE_KEYS.CASE_CLOSED) === 'true';
    },

    closeCase: function (reportDetails) {
      State.stopTimer();
      setItem(STORAGE_KEYS.CASE_CLOSED, 'true');
      if (reportDetails) {
        setItem(STORAGE_KEYS.FINAL_REPORT, JSON.stringify(reportDetails));
      }
    },

    getFinalReport: function () {
      var raw = getItem(STORAGE_KEYS.FINAL_REPORT);
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    },

    resetAll: function () {
      for (var i = 1; i <= 5; i++) {
        removeItem('clue' + i + '_solved');
        removeItem(STORAGE_KEYS.CLUE_PREFIX + i + '_solved');
      }
      removeItem(STORAGE_KEYS.TIMER_START);
      removeItem(STORAGE_KEYS.TIMER_ELAPSED);
      removeItem(STORAGE_KEYS.TIMER_RUNNING);
      removeItem(STORAGE_KEYS.ATTEMPTS);
      removeItem(STORAGE_KEYS.CORRECT_ATTEMPTS);
      removeItem(STORAGE_KEYS.CASE_CLOSED);
      removeItem(STORAGE_KEYS.FINAL_REPORT);
      removeItem(STORAGE_KEYS.PINNED_ITEMS);
      removeItem(STORAGE_KEYS.SUSPECT_STATUS);
    }
  };

  // UI Components Generator
  var UI = {
    // Generate the top investigation status bar
    renderTopBar: function (opts) {
      opts = opts || {};
      var activeClueId = opts.activeClueId || 0;
      var solvedCount = State.getSolvedCount();
      var elapsed = State.getElapsedSeconds();
      var timeStr = State.formatTime(elapsed);
      var isCluePage = !!opts.isCluePage;
      var rootPath = isCluePage ? '../' : '';

      var stepperHtml = '<div class="mb-stepper">';
      for (var i = 1; i <= 5; i++) {
        var isSolved = State.isClueSolved(i);
        var isCurrent = activeClueId === i;
        var stepCls = 'mb-step';
        if (isSolved) stepCls += ' is-solved';
        if (isCurrent) stepCls += ' is-active';

        stepperHtml += '<a href="' + rootPath + CLUES[i - 1].url + '" class="' + stepCls + '" title="Clue ' + i + ': ' + CLUES[i - 1].title + '">';
        stepperHtml += '<span class="mb-step-num">' + (isSolved ? '✓' : i) + '</span>';
        stepperHtml += '<span class="mb-step-name">Clue ' + i + '</span>';
        stepperHtml += '</a>';
        if (i < 5) stepperHtml += '<span class="mb-step-line' + (isSolved ? ' is-done' : '') + '"></span>';
      }
      stepperHtml += '</div>';

      var bar = document.createElement('div');
      bar.className = 'mb-topbar';
      bar.innerHTML = [
        '<div class="mb-topbar-inner">',
        '  <div class="mb-topbar-brand">',
        '    <a href="' + rootPath + 'index.html" class="mb-topbar-logo">🔍 Mystery<span>Box</span></a>',
        '    <span class="mb-case-badge">CASE #304: THE MISSING LAPTOP</span>',
        '  </div>',
        stepperHtml,
        '  <div class="mb-topbar-meta">',
        '    <div class="mb-timer-display" id="mbTimerDisplay" title="Investigation Duration">⏱️ <span id="mbTimerVal">' + timeStr + '</span></div>',
        '    <div class="mb-progress-counter" title="Solved Clues">🔎 <strong>' + solvedCount + '/5</strong></div>',
        '    <a href="' + rootPath + (solvedCount === 5 ? 'solution.html' : 'index.html#solution') + '" class="mb-solve-btn' + (solvedCount === 5 ? ' is-ready' : '') + '">',
        solvedCount === 5 ? '⚖️ Accusation Ready!' : '🔒 Case Gated',
        '    </a>',
        '  </div>',
        '</div>'
      ].join('\n');

      return bar;
    },

    // Attach live timer ticking to header
    startTimerTicker: function () {
      State.ensureTimerRunning();
      var timerEl = document.getElementById('mbTimerVal');
      if (!timerEl) return;
      setInterval(function () {
        var el = document.getElementById('mbTimerVal');
        if (el) {
          el.textContent = State.formatTime(State.getElapsedSeconds());
        }
      }, 1000);
    }
  };

  return {
    CLUES: CLUES,
    EVIDENCE: EVIDENCE,
    SUSPECTS: SUSPECTS,
    TIMELINE_EVENTS: TIMELINE_EVENTS,
    CORKBOARD_NODES: CORKBOARD_NODES,
    CORKBOARD_LINKS: CORKBOARD_LINKS,
    State: State,
    UI: UI
  };
});
