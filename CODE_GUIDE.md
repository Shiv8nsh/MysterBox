# MysteryBox Code Guide

This project is a small detective game that runs locally in a browser. It has no external packages: the server uses Node.js built-in modules and saves data in JSON files.

## Start here

1. Run `npm start`.
2. Open `http://localhost:3000`.
3. The server sends the requested HTML page, plus its shared CSS and JavaScript files.

## File map

| File or folder | Purpose |
| --- | --- |
| `server.js` | Starts the local website, serves files, and handles API requests. |
| `index.html` | Main detective workstation page. |
| `style.css` | Shared visual styles for every page. |
| `auth.js` | Sign-in popup, session storage, and shared browser API helper. |
| `mysterybox.js` | Game state: notes, timer, solved clues, evidence, and accusation progress. |
| `cases.js` | Case content only: suspects, clues, evidence, timelines, and solutions. |
| `interrogations.js` | Question-and-answer data used by the interrogation page and server validation. |
| `interrogation.html` | Lets the player question suspects. |
| `profile.html` | Shows saved player activity. |
| `feedback.html` | Collects player feedback. |
| `solution.html` | Displays the case resolution. |
| `clue/` | Individual clue pages. |
| `data/` | Local JSON storage for users, sessions, results, feedback, and interrogations. |

## How a typical action works

For example, when a player submits an accusation:

1. `index.html` collects the selected suspect and evidence.
2. `mysterybox.js` prepares the current game state.
3. `auth.js` sends a signed-in request to `POST /api/results`.
4. `server.js` validates the request and saves it in `data/results.json`.
5. The browser updates the displayed result.

## Safe places to make changes

- Change puzzle text or add cases in `cases.js`.
- Change question wording or answers in `interrogations.js`.
- Change page layout in the matching `.html` file.
- Change colors, spacing, and responsive layout in `style.css`.
- Change rules or saved-game behavior in `mysterybox.js` and `server.js`.

Keep shared browser files loaded in this order: `auth.js`, `cases.js`, `interrogations.js` (only on the interrogation page), `mysterybox.js`, then the page's inline script. This is the order used by the current pages.
