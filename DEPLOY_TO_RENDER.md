# Deploy to Render - Step by Step Guide

Follow these steps to deploy your Library Management System to Render (FREE).

## Prerequisites

1. ✅ Run `setup-git.bat` to set up Git and push to GitHub
2. ✅ Have a GitHub account

---

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `library-management-system`
3. Description: "Library Management System for College"
4. Choose: **Public** (free) or **Private**
5. **DO NOT** check:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
6. Click **"Create repository"**

---

## Step 2: Push Code to GitHub

### Option A: Using setup-git.bat (Easiest)
1. Double-click `setup-git.bat`
2. Follow the prompts
3. Enter your GitHub repository URL when asked
4. Choose "Y" to push

### Option B: Manual (Command Line)
```bash
git remote add origin https://github.com/YOUR_USERNAME/library-management-system.git
git branch -M main
git push -u origin main
```

**Note:** If asked for credentials:
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your password)
  - Create one at: https://github.com/settings/tokens
  - Select scope: `repo`

---

## Step 3: Deploy on Render

1. **Go to Render**
   - Visit https://render.com
   - Click **"Get Started for Free"**
   - Sign up with **GitHub** (recommended)

2. **Create Web Service**
   - Click **"New +"** button (top right)
   - Select **"Web Service"**

3. **Connect Repository**
   - Click **"Connect account"** if not connected
   - Select your GitHub account
   - Find and select: `library-management-system`
   - Click **"Connect"**

4. **Configure Service**
   - **Name:** `library-management-system` (or any name you like)
   - **Environment:** `Node`
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** (leave empty)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Select **"Free"**

5. **Create Service**
   - Click **"Create Web Service"**
   - Wait 2-3 minutes for deployment
   - You'll see build logs in real-time

---

## Step 4: Access Your App

Once deployment completes:

1. Your app URL will be: `https://library-management-system.onrender.com`
   (or whatever name you chose)

2. **Test the app:**
   - Visit the URL
   - You should see the login page
   - Login with: **ITLibrary** / **IT@Library01**

---

## Step 5: Important Notes

### ⚠️ Free Tier Limitations

1. **Spins Down After Inactivity**
   - Free tier apps sleep after 15 minutes of inactivity
   - First request after sleep takes ~30 seconds to wake up
   - Consider upgrading to paid plan for always-on service

2. **Database Persistence**
   - SQLite database may reset on restart (free tier)
   - For production, consider:
     - Upgrading to paid plan
     - Using PostgreSQL (Render provides free PostgreSQL)
     - Setting up automated backups

### 🔒 Security

1. **Change Default Password**
   - After first login, go to Dashboard
   - Change the default password immediately

2. **Environment Variables** (Optional)
   - Go to your service → **Environment** tab
   - Add variables if needed:
     - `SESSION_SECRET` - Random string for security
     - `NODE_ENV` - Set to `production`

---

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure `package.json` has all dependencies
- Verify Node.js version compatibility

### App Crashes
- Check logs in Render dashboard
- Look for error messages
- Ensure PORT is set correctly (Render sets this automatically)

### Can't Access App
- Wait for deployment to complete (green status)
- Check if service is running (not sleeping)
- Verify URL is correct

### Database Issues
- Free tier may reset database on restart
- Consider using Render's free PostgreSQL
- Set up regular backups

---

## Next Steps

1. ✅ Test all features
2. ✅ Change default password
3. ⭐ (Optional) Add custom domain
4. ⭐ (Optional) Set up database backups
5. ⭐ (Optional) Upgrade to paid plan for production

---

## Need Help?

- Render Documentation: https://render.com/docs
- Check Render dashboard logs
- Review `HOSTING_GUIDE.md` for more options

---

## Quick Commands Reference

```bash
# Check Git status
git status

# Add files
git add .

# Commit
git commit -m "Your message"

# Push to GitHub
git push origin main

# View logs on Render
# (Go to Render dashboard → Your service → Logs)
```

---

**Congratulations! Your Library Management System is now live on the internet! 🎉**

