# Deploying `github_upload` to GitHub Pages

This repository includes a ready-to-push static site in the `github_upload` folder and a GitHub Actions workflow that publishes that folder to the `gh-pages` branch automatically.

How it works

- The workflow (in `.github/workflows/deploy.yml`) runs on pushes to `main`.
- It checks out the repo and publishes the `github_upload` folder to the `gh-pages` branch.
- After the first successful deployment, your site will be available at:

  `https://<github-username>.github.io/<repo-name>`

Quick steps to publish

1. Replace the contents of `github_upload` with your project's built static files (HTML/CSS/JS).
2. Commit and push to `main`:

```bash
git add github_upload
git commit -m "Add site for GitHub Pages"
git push origin main
```

3. Wait a minute and then open `https://<github-username>.github.io/<repo-name>`.

Notes

- If your repository is private, enable GitHub Pages for the repo or make it public.
- If you prefer to serve from the `docs/` folder without a workflow, move your files to `docs/` and enable Pages from that folder in repo settings.
