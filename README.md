# 🔐 Password Manager

A secure password management web application built with React and Supabase. Store all your passwords securely with client-side encryption.

## ✨ Features

- 🔒 **Secure Authentication** - User signup/login with Supabase Auth
- 🔐 **Client-Side Encryption** - Passwords encrypted with your master key
- 👤 **User-Specific** - Each user only sees their own passwords
- ✏️ **Full CRUD** - Add, view, edit, and delete passwords
- 🎲 **Password Generator** - Generate strong random passwords
- 📋 **Copy to Clipboard** - Quick copy functionality
- 💾 **Notes & URLs** - Store additional information with passwords
- 📱 **Responsive Design** - Works on desktop and mobile
- 🚀 **Easy Deployment** - Deploy to GitHub Pages or any static host

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account (free tier works great!)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd password-manager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project

#### Create the Database Table

Go to the SQL Editor in your Supabase dashboard and run this SQL:

```sql
-- Create passwords table
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

-- Enable Row Level Security
ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;

-- Create policies so users can only access their own passwords
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

-- Create index for better performance
CREATE INDEX passwords_user_id_idx ON passwords(user_id);
```

#### Get Your Supabase Credentials

1. Go to Project Settings → API
2. Copy your **Project URL** and **anon/public key**

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Building for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## 🌐 Deployment

### Deploy to GitHub Pages

1. **Update `vite.config.js`** with your repo name:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',  // Change this to your repo name
})
```

2. **Install gh-pages**:

```bash
npm install --save-dev gh-pages
```

3. **Add deploy scripts to `package.json`**:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

4. **Deploy**:

```bash
npm run deploy
```

5. **Enable GitHub Pages**:
   - Go to your repo → Settings → Pages
   - Source: Deploy from branch
   - Branch: gh-pages / root
   - Save

Your app will be live at: `https://yourusername.github.io/your-repo-name/`

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Add environment variables
8. Deploy!

## 🔒 Security Features

- **Client-Side Encryption**: Passwords are encrypted in the browser with AES encryption before being sent to Supabase
- **Master Key**: Only you know your master key - it's never sent to the server
- **Row Level Security**: Supabase RLS ensures users can only access their own data
- **Secure Authentication**: Email/password authentication with Supabase Auth
- **HTTPS**: All communication with Supabase is encrypted with HTTPS

## 🎯 How It Works

1. **User Signs Up/Logs In**: Authentication handled by Supabase Auth
2. **Sets Master Key**: User creates a master key (stored only in memory, never saved)
3. **Adds Password**: Password is encrypted with the master key using AES encryption
4. **Stores in Supabase**: Encrypted password is stored in Supabase database
5. **Views Password**: Encrypted password is fetched and decrypted with the master key
6. **RLS Protection**: Supabase Row Level Security ensures users only see their own passwords

## 📝 Important Notes

- **Master Key**: Remember your master key! It's not stored anywhere and cannot be recovered
- **Each Session**: You'll need to enter your master key each time you reload the app
- **Encrypted Storage**: Passwords are stored encrypted in Supabase
- **Privacy First**: Your master key never leaves your browser

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Encryption**: CryptoJS (AES)
- **Styling**: Custom CSS

## 📱 Usage

1. **Sign Up**: Create an account with your email and password
2. **Set Master Key**: Create a master key for encryption (remember this!)
3. **Add Passwords**: Click "Add New Password" and fill in the details
4. **Generate Password**: Use the "Generate" button for strong passwords
5. **View/Copy**: Click "Show" to reveal passwords or "Copy" to copy them
6. **Edit/Delete**: Manage your passwords with edit and delete options

## 🤝 Contributing

Feel free to open issues or submit pull requests!

## 📄 License

MIT License - feel free to use this for your own projects!

## ⚠️ Disclaimer

This is a personal password manager. While it uses encryption and security best practices, please use at your own risk. For critical passwords, consider using established password managers like Bitwarden or 1Password.

---

Made with ❤️ using React and Supabase

