# Hosting Guide - Library Management System

This guide covers multiple hosting options for your Library Management System, from free platforms to production servers.

## Table of Contents
1. [Quick Start - Local Hosting](#local-hosting)
2. [Free Cloud Hosting Options](#free-cloud-hosting)
3. [Production Hosting](#production-hosting)
4. [Environment Configuration](#environment-configuration)
5. [Troubleshooting](#troubleshooting)

---

## Local Hosting

### For Testing/Development
Your app is already set up for local hosting:

```bash
npm install
npm start
```

Access at: `http://localhost:3000`

### Make it Accessible on Your Network
To access from other devices on your network:

1. Find your local IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`

2. Update `server.js` to listen on all interfaces:
   ```javascript
   app.listen(PORT, '0.0.0.0', () => {
     console.log(`Server running on http://0.0.0.0:${PORT}`);
   });
   ```

3. Access from other devices: `http://YOUR_IP:3000`

---

## Free Cloud Hosting

### Option 1: Render (Recommended - Easiest)

**Pros:** Free tier, automatic HTTPS, easy deployment
**Cons:** Spins down after inactivity (free tier)

#### Steps:

1. **Create Account**
   - Go to https://render.com
   - Sign up with GitHub (recommended)

2. **Prepare Your Code**
   - Push your code to GitHub
   - Make sure `package.json` has a start script

3. **Deploy on Render**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     - **Name:** library-management-system
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Plan:** Free
   - Click "Create Web Service"

4. **Environment Variables** (if needed)
   - Go to Environment tab
   - Add any required variables

5. **Your app will be live at:** `https://your-app-name.onrender.com`

---

### Option 2: Railway

**Pros:** Free tier, no credit card required, easy setup
**Cons:** Limited free usage

#### Steps:

1. **Create Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway auto-detects Node.js and deploys

3. **Configure**
   - Add environment variables if needed
   - Your app gets a `.railway.app` domain automatically

---

### Option 3: Heroku

**Pros:** Well-established, good documentation
**Cons:** Requires credit card for free tier (but won't charge)

#### Steps:

1. **Install Heroku CLI**
   ```bash
   # Windows: Download from https://devcenter.heroku.com/articles/heroku-cli
   # Mac: brew install heroku/brew/heroku
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   heroku create your-app-name
   ```

4. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

5. **Open App**
   ```bash
   heroku open
   ```

---

### Option 4: Vercel

**Pros:** Great for static + serverless, fast
**Cons:** Better for frontend, requires serverless functions for backend

#### Steps:

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow prompts and your app will be live!

---

## Production Hosting

### Option 1: DigitalOcean Droplet

**Cost:** ~$6/month
**Pros:** Full control, dedicated resources

#### Steps:

1. **Create Droplet**
   - Go to https://www.digitalocean.com
   - Create Ubuntu 22.04 droplet
   - Choose $6/month plan

2. **SSH into Server**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   ```

5. **Clone Your Repository**
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   npm install
   ```

6. **Start with PM2**
   ```bash
   pm2 start server.js --name library-system
   pm2 save
   pm2 startup
   ```

7. **Setup Nginx (Reverse Proxy)**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/default
   ```
   
   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

### Option 2: AWS EC2

**Cost:** Free tier available, then pay-as-you-go
**Pros:** Scalable, powerful

Similar setup to DigitalOcean, but with AWS-specific configurations.

---

## Environment Configuration

### Create `.env` file (for production)

Create a `.env` file in your project root:

```env
PORT=3000
SESSION_SECRET=your-super-secret-key-change-this
NODE_ENV=production
```

### Update `server.js` to use environment variables:

```javascript
require('dotenv').config(); // Add at top
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'library-secret-key-2024';
```

Install dotenv:
```bash
npm install dotenv
```

---

## Production Checklist

Before deploying to production:

- [ ] Change default admin password
- [ ] Set strong `SESSION_SECRET` environment variable
- [ ] Enable HTTPS (most platforms do this automatically)
- [ ] Set `NODE_ENV=production`
- [ ] Backup database regularly
- [ ] Set up monitoring/logging
- [ ] Configure firewall rules
- [ ] Set up domain name (optional but recommended)

---

## Database Backup

### Backup SQLite Database:

```bash
# Manual backup
cp library.db library.db.backup

# Automated backup script (backup.sh)
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp library.db backups/library_$DATE.db
```

### Restore:
```bash
cp library.db.backup library.db
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Database Locked
- Make sure only one instance of the app is running
- Check file permissions on `library.db`

### App Crashes
- Check logs: `pm2 logs library-system`
- Check server logs on hosting platform
- Ensure all dependencies are installed

### Can't Access from Internet
- Check firewall settings
- Verify port is open
- Check hosting platform's network settings

---

## Quick Deploy Scripts

### For Render/Railway (add to package.json):
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### For PM2 (production):
```bash
pm2 start server.js --name library-system --env production
```

---

## Recommended Setup for Production

1. **Use Render or Railway** for quick deployment (free tier)
2. **Add custom domain** (optional, costs ~$10/year)
3. **Set up automated backups** for database
4. **Monitor with PM2** or hosting platform's monitoring
5. **Enable HTTPS** (automatic on most platforms)

---

## Need Help?

- Check hosting platform's documentation
- Review error logs
- Test locally first
- Ensure all environment variables are set

---

## Security Notes

- Never commit `.env` file to Git
- Use strong, unique passwords
- Enable HTTPS in production
- Regularly update dependencies
- Keep Node.js updated

