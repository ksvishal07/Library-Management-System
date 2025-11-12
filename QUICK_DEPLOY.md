# Quick Deployment Guide

## Fastest Way to Deploy (5 minutes)

### 🚀 Quick Start (Windows Users)

**Easiest Method:**
1. Double-click `setup-git.bat` in your project folder
2. Follow the on-screen prompts
3. The script will guide you through Git setup and GitHub push
4. Then follow the Render deployment steps below

**For detailed step-by-step instructions, see:** `DEPLOY_TO_RENDER.md`

---

### Option 1: Render (Recommended - Easiest & Free)

1. **Push to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Deploy on Render**:
   - Go to https://render.com
   - Sign up (free)
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select your repository
   - Configure:
     - **Name:** library-management-system
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Plan:** Free
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Your app is live! 🎉

3. **Access your app:**
   - URL: `https://library-management-system.onrender.com`
   - Login: ITLibrary / IT@Library01

---

### Option 2: Railway (Also Free & Easy)

1. **Push to GitHub** (same as above)

2. **Deploy on Railway**:
   - Go to https://railway.app
   - Sign up with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway auto-detects and deploys!
   - Your app gets a `.railway.app` domain

---

## Important Notes

### Database Persistence
- On free tiers, the database file (`library.db`) may reset when the app restarts
- For production, consider:
  - Using a persistent database (PostgreSQL, MySQL)
  - Setting up automated backups
  - Using a paid hosting plan with persistent storage

### Environment Variables (Optional)
If you want to customize settings, add these in your hosting platform:

- `PORT` - Server port (default: 3000)
- `SESSION_SECRET` - Change this to a random string for security

---

## Testing Your Deployment

1. Visit your deployed URL
2. You should see the login page
3. Login with: **ITLibrary** / **IT@Library01**
4. Test adding a book
5. Test borrowing/returning

---

## Troubleshooting

### Build Fails
- Make sure `package.json` has all dependencies
- Check build logs in your hosting platform

### App Crashes
- Check logs in your hosting platform dashboard
- Ensure PORT is set correctly (most platforms set this automatically)

### Database Issues
- Free tiers may reset the database on restart
- Consider upgrading to a plan with persistent storage

---

## Next Steps

1. ✅ Deploy to Render or Railway
2. ✅ Test all features
3. ✅ Change default password
4. ⭐ (Optional) Add custom domain
5. ⭐ (Optional) Set up database backups

---

## Need More Help?

See `HOSTING_GUIDE.md` for detailed instructions on:
- VPS hosting (DigitalOcean, AWS)
- Production setup
- Database migration
- Security hardening

