# 🚀 Quick Setup Guide

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Supabase Project

1. Go to https://supabase.com
2. Sign in or create account
3. Click "New Project"
4. Fill in details:
   - Name: password-manager
   - Database Password: (create a strong password)
   - Region: Choose closest to you
5. Wait for project to be created (~2 minutes)

### 3. Set Up Database

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste this SQL:

```sql
CREATE TABLE passwords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own passwords"
  ON passwords FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own passwords"
  ON passwords FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own passwords"
  ON passwords FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own passwords"
  ON passwords FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX passwords_user_id_idx ON passwords(user_id);
```

4. Click "Run" or press Ctrl+Enter
5. You should see "Success. No rows returned"

### 4. Get API Keys

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these two values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long key)

### 5. Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and paste your values:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...your-long-key...
   ```

### 6. Run the App

```bash
npm run dev
```

Open http://localhost:5173

### 7. Test It Out

1. Click "Sign Up"
2. Enter email and password
3. Check your email and click the verification link
4. Log in with your credentials
5. Set a master key
6. Start adding passwords!

## 🌐 Deploy to GitHub Pages

### First Time Setup

1. Create a GitHub repository
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

3. Update `vite.config.js` - change the base:
   ```javascript
   base: '/your-repo-name/',
   ```

4. Add to `package.json`:
   ```json
   "scripts": {
     "dev": "vite",
     "build": "vite build",
     "preview": "vite preview",
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   },
   "devDependencies": {
     ...existing dependencies...,
     "gh-pages": "^6.0.0"
   }
   ```

5. Install gh-pages:
   ```bash
   npm install
   ```

6. Deploy:
   ```bash
   npm run deploy
   ```

7. Enable GitHub Pages:
   - Go to repo Settings → Pages
   - Source: gh-pages branch
   - Save

8. Your app will be live at:
   `https://yourusername.github.io/your-repo-name/`

### Update Environment Variables for Production

**Important**: For GitHub Pages, you need to rebuild with production environment variables.

Option 1: Use GitHub Actions (Recommended)
- Add your Supabase keys as GitHub Secrets
- Use GitHub Actions to build and deploy

Option 2: Build locally with .env
- Keep your `.env` file locally (don't commit it!)
- Run `npm run build` locally
- Run `npm run deploy`

The build process will embed the environment variables into the built files.

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Database table created with SQL
- [ ] Row Level Security enabled
- [ ] `.env` file created with correct keys
- [ ] `npm install` completed successfully
- [ ] `npm run dev` starts the app
- [ ] Can sign up a new user
- [ ] Can log in
- [ ] Can add a password
- [ ] Can view passwords
- [ ] Can edit/delete passwords
- [ ] Ready to deploy!

## 🆘 Troubleshooting

### "Missing Supabase environment variables"
- Check that `.env` file exists in root directory
- Check that variable names are correct (VITE_ prefix)
- Restart dev server after creating `.env`

### "Error fetching passwords"
- Make sure you ran the SQL to create the table
- Check that Row Level Security policies are created
- Verify you're logged in with a valid user

### Email verification not working
- Check Supabase Auth settings
- For development, you can disable email confirmation in Supabase → Authentication → Settings → Email Auth → disable "Enable email confirmations"

### Deployment shows blank page
- Check browser console for errors
- Verify `base` in `vite.config.js` matches your repo name
- Make sure environment variables are available during build

## 📧 Need Help?

Check the main README.md for more detailed information!

