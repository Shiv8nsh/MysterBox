# 🕵️ MysteryBox — JavaScript Implementation Guide (Beginner Friendly)

Welcome to the **MysteryBox** JavaScript Architecture guide! This document explains how JavaScript powers all the interactive features in the project in simple, beginner-friendly terms.

---

## 📚 1. Core JavaScript Concepts Used

| JavaScript Concept | Where It Is Used in MysteryBox | Example in Code |
| :--- | :--- | :--- |
| **Variables & Constants** | Storing clues, keys, and game parameters | `var CLUES = [...]`, `const STORAGE_KEYS = {...}` |
| **Objects & Arrays** | Representing suspects, timeline events, and evidence | `SUSPECTS[0].name`, `CLUES.map(...)` |
| **Browser Storage (`localStorage`)** | Remembering progress, solved clues, and notes | `localStorage.setItem('mb_detective_notes', text)` |
| **Asynchronous Timers** | The live stopwatch clock ticking every second | `setInterval(updateTimer, 1000)` |
| **DOM Manipulation** | Creating cards, updating text, toggling classes | `document.createElement()`, `classList.toggle()` |
| **Event Listeners** | Detecting clicks, typing, and form submissions | `addEventListener('click')`, `addEventListener('input')` |
| **Form Handling & Validation** | Verifying accusations before closing the case | `e.preventDefault()`, checking culprit & proof |

---

## 📝 2. Feature Spotlight: The Detective Notes System

### What It Does:
While solving clues across different URLs (`/clue/X7K92.html`, `/index.html`, etc.), the detective can open their **📝 Case Notes** notepad to jot down observations, timestamps, and theories.

### How the JavaScript Works (Step-by-Step):

#### Step 1: Storing and Reading Notes with `localStorage`
Because the user moves between multiple HTML pages, standard JavaScript variables would reset on page reload. We use `localStorage` so notes stay permanently in the browser until cleared:
```javascript
// Reading saved notes:
var savedNotes = localStorage.getItem("mb_detective_notes") || "";

// Saving updated notes:
localStorage.setItem("mb_detective_notes", userText);
```

#### Step 2: Auto-Saving As You Type (`input` Event)
Instead of requiring the user to press a save button, we listen for every key stroke with the `input` event:
```javascript
textarea.addEventListener("input", function () {
  // Save whatever is typed immediately
  localStorage.setItem("mb_detective_notes", textarea.value);
  statusEl.textContent = "Saved ✓";
});
```

#### Step 3: Two-Way Synchronization
Whether the detective uses the **Floating Notes Widget** on any clue page or the **Full-Page Notes Tab** on the dashboard, both textareas synchronize automatically!

#### Step 4: Exporting Notes as a `.txt` File
JavaScript can create and trigger a file download right in the browser:
```javascript
var blob = new Blob([notesText], { type: "text/plain;charset=utf-8" });
var url = URL.createObjectURL(blob);
var downloadLink = document.createElement("a");
downloadLink.href = url;
downloadLink.download = "MysteryBox_Detective_Notes.txt";
downloadLink.click();
```

---

## ⏱️ 3. How the Live Investigation Timer Works

The timer uses a combination of `Date.now()` and `setInterval`:
1. When the case begins, we save the current timestamp:
   ```javascript
   localStorage.setItem("mb_timer_start", Date.now().toString());
   ```
2. Every second (1000 milliseconds), `setInterval` calculates elapsed seconds:
   ```javascript
   var elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
   ```
3. A helper function converts seconds into standard `MM:SS` format:
   ```javascript
   function formatTime(totalSeconds) {
     var mins = Math.floor(totalSeconds / 60);
     var secs = totalSeconds % 60;
     var pad = function(n) { return n < 10 ? '0' + n : n; };
     return pad(mins) + ":" + pad(secs);
   }
   ```

---

## 🔍 4. How Clue Verification Works

In each clue file (`clue/X7K92.html`, `clue/A4P81.html`, etc.):
1. The user types their answer into an `<input>` field.
2. When the user clicks **Submit Answer** or presses <kbd>Enter</kbd>:
   ```javascript
   var input = answerInput.value.trim().toLowerCase();
   var isCorrect = CORRECT_ANSWERS.some(function(ans) {
     return input === ans.toLowerCase();
   });
   ```
3. If correct:
   * We mark the clue as solved in `localStorage`: `localStorage.setItem('clue1_solved', 'true')`.
   * We display the success message.
   * We reveal the **Discover Next Clue →** button.
   * The Evidence Library automatically unlocks the corresponding evidence card!

---

## ⚖️ 5. How Final Accusation Validation Works

When the user enters the **Final Solution Chamber**:
1. It first checks if all 5 clues are solved:
   ```javascript
   if (solvedCount < 5) {
     // Show "Evidence Threshold Not Met" screen
   }
   ```
2. When unlocked, the user chooses a suspect and checkboxes for evidence.
3. On submission (`submit` event):
   * If they choose **Arjun** or **Kabir**: Feedback explains their alibis eliminate them.
   * If they choose **Rohan** but checked fewer than 2 evidence citations: Feedback requests more corroborating proof.
   * If they accuse **Rohan** with proper proof:
     ```javascript
     MysteryBox.State.closeCase({ culprit: "Rohan Patel", ... });
     window.location.href = "solution.html";
     ```

---

## 💡 Quick Questions Your Teacher Might Ask & How to Answer

* **Q: Why is JavaScript placed in a separate file (`mysterybox.js`)?**  
  * **Answer:** Separation of concerns! Placing reusable logic in `mysterybox.js` allows all 5 clue pages, the dashboard, and the solution page to share the same game state and functions without duplicating code.

* **Q: How does the game remember which clues I solved if I refresh the page?**  
  * **Answer:** Through the browser's `localStorage` API. Data is saved as key-value pairs (`clue1_solved: "true"`) and persists across page reloads and browser sessions.

* **Q: How does the Crime Board draw red threads between cards?**  
  * **Answer:** JavaScript dynamically creates Scalable Vector Graphics (`<svg>` and `<line>`) elements and computes $(x, y)$ coordinates between the suspect card and the evidence cards.
