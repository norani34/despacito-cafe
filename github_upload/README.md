# github_upload

This folder contains everything needed to publish a static site to GitHub Pages.

Included files

- `index.html` — preview page to replace with your built site
- `assets/` — example CSS and JS (`assets/css/style.css`, `assets/js/main.js`)
- `.nojekyll` — prevents GitHub Pages from ignoring files starting with `_`
- `CNAME.example` — rename to `CNAME` and put your custom domain (optional)

How to use

1. Replace the contents of this folder with your project's build output (HTML/CSS/JS). Keep `index.html` at the root of this folder.
2. (Optional) If you have a custom domain, rename `CNAME.example` to `CNAME` and replace the content with your domain.
3. Commit and push to GitHub (example commands shown in the repo root):

```powershell
cd "C:/Users/El-Wattaneya/Downloads/despacito-café"
git add github_upload DEPLOY.md .github/workflows/deploy.yml
git commit -m "Add github_upload site and deploy workflow"
# If this is a new repo, create it on GitHub and add the remote, or use gh:
# gh repo create <repo-name> --public --source=. --remote=origin --push --confirm
# Otherwise add your existing remote and push:
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

Preview locally

- Open `github_upload/index.html` in your browser directly, or run a local static server:

```bash
npx serve github_upload
# or
python -m http.server --directory github_upload 8000
```

After pushing

- The workflow in `.github/workflows/deploy.yml` will publish the `github_upload` folder to the `gh-pages` branch automatically when you push to `main`. The site will be available at `https://<github-username>.github.io/<repo-name>`.

If you want, I can now: create the GitHub repository and push these files for you (requires `gh` auth on your machine), or I can just prepare the repo files and give you the exact push commands.

