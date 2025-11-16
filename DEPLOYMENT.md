# 🚀 Deployment Guide

## Quick Deployment Options

### Option 1: GitHub Pages with GitHub Actions (Recommended)

This automatically deploys your app whenever you push to the main branch.

#### Steps:

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/password-manager.git
   git push -u origin main
   ```

2. **Add Secrets to GitHub**
   - Go to your repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add these two secrets:
     - Name: `VITE_SUPABASE_URL`, Value: your Supabase URL
     - Name: `VITE_SUPABASE_ANON_KEY`, Value: your Supabase anon key

3. **Update vite.config.js**
   ```javascript
   base: '/password-manager/',  // Change to your repo name
   ```

4. **Push Changes**
   ```bash
   git add .
   git commit -m "Configure deployment"
   git push
   ```

5. **Enable GitHub Pages**
   - Go to repo Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Click Save

6. **Wait for Deployment**
   - Go to Actions tab to see deployment progress
   - Once complete, your app will be at: `https://yourusername.github.io/password-manager/`

### Option 2: Manual GitHub Pages Deployment

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json scripts**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

### Option 3: Vercel (Fastest)

1. **Push to GitHub** (if not already)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click "Deploy"

3. **Done!** Your app will be live in ~1 minute

### Option 4: Netlify

1. **Push to GitHub** (if not already)

2. **Deploy to Netlify**
   - Go to https://netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose your GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click "Deploy site"

3. **Done!** Your app will be live with a custom Netlify URL

### Option 5: Static File Hosting

Build locally and upload to any static host:

```bash
# Build the app
npm run build

# The dist folder contains your entire app
# Upload the contents of dist/ to any web host:
# - AWS S3
# - Google Cloud Storage
# - Azure Static Web Apps
# - Cloudflare Pages
# - Any web server
```

## 🔒 Security Considerations for Deployment

### Environment Variables

- **Never commit .env to GitHub** - It's already in .gitignore
- **Use secrets/environment variables** in your deployment platform
- **Anon key is safe to expose** - Supabase anon key is meant to be public

### Supabase Settings

1. **Email Settings** (Supabase → Authentication → Email Templates)
   - Update "Confirm signup" template with your domain
   - Update "Magic Link" template

2. **URL Configuration** (Supabase → Authentication → URL Configuration)
   - Add your deployed URL to "Site URL"
   - Add your deployed URL to "Redirect URLs"

### HTTPS

- All deployment options above provide HTTPS by default
- Never deploy without HTTPS for a password manager!

## 🔄 Update Deployment

### GitHub Actions (Automatic)
Just push to main branch:
```bash
git add .
git commit -m "Update feature"
git push
```

### Manual gh-pages
```bash
npm run deploy
```

### Vercel/Netlify
Push to GitHub - auto-deploys:
```bash
git push
```

## 📊 Monitoring

### Check Deployment Status

- **GitHub Actions**: Repo → Actions tab
- **Vercel**: Dashboard → Deployments
- **Netlify**: Dashboard → Deploys

### View Logs

- Check build logs if deployment fails
- Common issues:
  - Missing environment variables
  - Build errors (check locally first: `npm run build`)
  - Wrong base path in vite.config.js

## 🎉 Success!

Once deployed, share your password manager:
- `https://yourusername.github.io/password-manager/` (GitHub Pages)
- `https://your-app.vercel.app/` (Vercel)
- `https://your-app.netlify.app/` (Netlify)

Remember: This is **your** password manager. Only share the URL if you want others to create their own accounts!

