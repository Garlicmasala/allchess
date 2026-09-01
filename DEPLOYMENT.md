# Deployment Guide: allchessb.com

This document explains how allchessb is deployed and hosted.

## Architecture

- **Static site**: No build step required. HTML, CSS, and JavaScript are served directly.
- **Hosting**: GitHub Pages from the main branch
- **Custom domain**: allchessb.com (configured via CNAME file)
- **Deployment**: Automatic via GitHub Actions on every push to main

## Automatic Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

1. Triggers on every push to the main branch
2. Uploads the entire repository as the pages artifact
3. Deploys to GitHub Pages
4. Automatically recognizes the CNAME file for custom domain routing

## Manual Setup (if needed)

If GitHub Pages is not already enabled, follow these steps:

### 1. Enable GitHub Pages on the Repository

1. Go to: https://github.com/Garlicmasala/allchess/settings/pages
2. Under "Source", select:
   - **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
3. Click "Save"

### 2. Verify CNAME Configuration

The file `CNAME` in the repository root contains:

```
allchessb.com
```

This tells GitHub Pages to serve the site at allchessb.com instead of the default github.io domain.

### 3. Point DNS to GitHub Pages

For the domain registrar (where allchessb.com is registered):

Configure DNS records:
- **Type A records** (for IPv4): Point to GitHub's IP addresses:
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153

OR

- **Type CNAME record** (if your registrar allows root domain CNAME):
  - Point to: `Garlicmasala.github.io`

### 4. Verify the Setup

After DNS propagates (5-30 minutes), check:

```bash
nslookup allchessb.com
```

Should resolve to one of GitHub's IP addresses.

Visit: https://allchessb.com

You should see the allchessb atlas and simulator.

## Deployment Status

Monitor the deployment progress:

1. Push changes to the main branch
2. Go to: https://github.com/Garlicmasala/allchess/actions
3. Watch the "Deploy to GitHub Pages" workflow run
4. Once green, the site is live at https://allchessb.com

## Local Testing

To test the site locally before deployment:

```bash
npm install --global serve
npm start
# Opens local server, typically at http://localhost:3000
```

Then open http://localhost:3000 in your browser.

## File Structure

```
.
├── index.html           # Main page shell
├── app.js              # Game logic and UI interactions
├── core.js             # Variant metadata and utilities
├── styles.css          # Visual styling
├── package.json        # Project metadata
├── CNAME               # Custom domain configuration
├── .github/
│   └── workflows/
│       └── deploy.yml  # Automated deployment workflow
└── README.md           # Project overview
```

## Troubleshooting

### Site not showing up at allchessb.com

1. **Check DNS**: `nslookup allchessb.com` should resolve to 185.199.x.x
2. **Check Pages settings**: Confirm main branch is selected as source in repo settings
3. **Check workflow**: Go to Actions tab and verify the deploy workflow succeeded
4. **Wait for DNS**: DNS changes can take 5-30 minutes to propagate

### HTTPS not working

GitHub Pages automatically provides HTTPS. If you see warnings:

1. Verify the CNAME file is exactly: `allchessb.com` (no trailing newline or spaces)
2. Wait 5-10 minutes for the SSL certificate to be provisioned
3. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

### Custom domain not recognized

1. Check the CNAME file content: should be exactly `allchessb.com`
2. Verify DNS is pointing to GitHub's servers
3. Try removing and re-adding the custom domain in Pages settings

## Production Checklist

Before going live, verify:

- [ ] CNAME file exists and contains `allchessb.com`
- [ ] GitHub Pages is enabled on main branch in repo settings
- [ ] DNS records point to GitHub Pages (A records or CNAME)
- [ ] `.github/workflows/deploy.yml` is present
- [ ] Site loads at https://allchessb.com
- [ ] All game variants load and are playable
- [ ] Auth/login works with localStorage
- [ ] Responsive design works on mobile
- [ ] No console errors (F12 developer tools)

## Next Steps for Full Production

While this deployment is production-ready, future enhancements might include:

- Custom 404.html for routing SPA requests (if converting to SPA mode)
- Environment-specific configuration files
- Automated testing in the CI/CD pipeline
- Analytics tracking
- Server-backed user authentication (instead of localStorage)
