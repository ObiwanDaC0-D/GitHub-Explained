# GitHub Explained

A free, self-contained interactive learning app covering the Git and GitHub workflow.

## Start

Open `index.html` in any modern browser. No build tools, dependencies, accounts, or subscriptions are required.

For GitHub Pages, go to **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, and save.

## Lessons

- Git vs GitHub, repositories, clones, and forks
- Saving vs staging vs committing vs pushing
- Branches, merges, and pull requests
- Debugging, testing, refactoring, and optimization
- Pulling and synchronizing changes
- Worked Metronome feature-development example
- Interactive practice simulator with prerequisite feedback
- Ten-question self-check quiz

## Important limitations

The simulator is a conceptual model, not a real Git terminal. It does not edit files or access GitHub. It simplifies merges and does not simulate conflicts, remote divergence, authentication, or Git object internals. Simulator and quiz progress are kept in memory only and reset when the page reloads. Learning Path completion is stored in browser localStorage when permitted.

## Architecture

One dependency-free `index.html` containing semantic HTML, responsive CSS, and vanilla JavaScript. No external assets or telemetry.

## Manual smoke test

1. Open `index.html` and switch among all nine tabs.
2. In the simulator, try committing before staging; expect a helpful prerequisite message.
3. Run Clone → Create branch → Edit files → Stage → Commit → Push → Merge; expect local main after merge.
4. Reset the simulator; expect all counters to clear.
5. Complete the quiz; expect a score and a restart button.
6. Check layout on a narrow mobile viewport.

## License

No license has been added yet; the repository owner can choose one.

## Phase 2 — Interactive learning

- **Learning Path:** Six sequential modules with practice tasks, progress indicator, and browser-local completion storage (when supported).
- **Visual Lab:** Animated branch-and-merge timeline with play/pause and manual step controls.
- **Scenarios:** Six interactive decision exercises with explanatory feedback.
- All original lessons, workflow examples, simulator, quiz, and reference materials remain available.

### Phase 2 manual checks

1. Navigate to Learning Path; complete module 1 and verify module 2 unlocks.
2. Refresh and confirm progress persists in browsers permitting localStorage.
3. Reset progress and confirm all modules return to incomplete.
4. Play and pause the Visual Lab; check manual controls and end state.
5. Answer each scenario and confirm correct-answer highlighting and feedback.
6. Revisit original simulator, quiz, and reference tabs for regressions.

## Phase 3 — Git Command Laboratory

The **Command Lab** tab contains a simulated terminal with commands `git clone`, `git status`, `git switch`, `git checkout`, `git branch`, `git add`, `git commit`, `git log`, `git push`, `git pull`, and `git merge`. Training-only commands `edit`, `test`, `help`, `clear`, and `reset` support guided exercises.

Try the full exercise:

```bash
git clone https://github.com/example/Metronome.git
git switch -c feature/tuner
edit
test
git add .
git commit -m "Add tuner"
git push -u origin feature/tuner
git switch main
git merge feature/tuner
git push
```

The lab provides contextual errors, status information, and a **Show next step** hint. It runs entirely in the browser and **never executes actual shell commands or changes a real repository**.

### Phase 3 manual checks

1. Try `git status` before cloning and confirm a not-a-repository message.
2. Clone the sample repository and verify the local repository display.
3. Attempt a commit before staging and verify a prerequisite message.
4. Run the full exercise above and verify the merge completion message.
5. Run `git status`, `git branch`, and `git log` at different points.
6. Reset the lab and verify all state counters return to initial values.

The terminal is intentionally simplified: it does not implement real Git parsing, merge conflicts, detached HEAD, network synchronization, authentication, or filesystem operations.

## Optimization Stage A — Stabilization and CI

- Improved next-step hints in the Command Lab, especially after branching, committing, and merging.
- Strengthened safeguards for unpublished feature commits and pending changes.
- Added `scripts/check.mjs` using Node.js built-in assertions and VM syntax compilation.
- Added `.github/workflows/verify.yml` to run the checks on pushes and pull requests.

Run the checks locally with:

```bash
node scripts/check.mjs
```

These checks validate JavaScript syntax, navigation, and selected regression safeguards. They are **not browser end-to-end tests** and do not guarantee all interactions work. Review the GitHub Actions run to confirm the workflow passed. Additional architectural work, accessibility testing, and the remaining optimization phases are pending.

## Optimization Stage A — Maintainable assets

The application has been separated into:
- `index.html` — markup and semantic structure
- `assets/styles.css` — responsive styling
- `assets/app.js` — interactive learning behavior
- `scripts/check.mjs` — dependency-free static checks
- `.github/workflows/verify.yml` — CI execution

The static test now checks the asset links, parses the extracted JavaScript, checks nine navigation sections, validates direct DOM ID references, and verifies selected safeguards.

**Note:** JavaScript remains in a single app module for now. Further separation of state models, instructional content, and UI behavior is planned. Browser interaction and accessibility audits remain pending.
