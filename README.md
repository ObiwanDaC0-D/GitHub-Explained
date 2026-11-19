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
