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

The simulator is a conceptual model, not a real Git terminal. It does not edit files or access GitHub. It simplifies merges and does not simulate conflicts, remote divergence, authentication, or Git object internals. Simulator and quiz progress are kept in memory only and reset when the page reloads.

## Architecture

One dependency-free `index.html` containing semantic HTML, responsive CSS, and vanilla JavaScript. No external assets or telemetry.

## Manual smoke test

1. Open `index.html` and switch among all five tabs.
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
