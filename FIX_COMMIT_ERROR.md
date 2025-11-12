# Fix: "Failed to commit files" Error

## Quick Fix

The error usually means Git doesn't know who you are. Configure your name and email:

### Method 1: Run These Commands

Open Command Prompt in your project folder and run:

```cmd
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

Then try running `setup-git.bat` again.

### Method 2: Use the Updated Script

I've updated `setup-git.bat` to automatically check and configure this. 

**Just run `setup-git.bat` again** - it will now:
- ✅ Check if Git user is configured
- ✅ Prompt you to enter your name and email if needed
- ✅ Configure Git automatically
- ✅ Then proceed with the commit

---

## Step-by-Step Fix

1. **Open Command Prompt**
   - Press `Windows Key + R`
   - Type `cmd` and press Enter

2. **Navigate to your project:**
   ```cmd
   cd "M:\Projects\Library Management System"
   ```

3. **Configure Git (if not done):**
   ```cmd
   git config user.name "Your Name"
   git config user.email "your.email@example.com"
   ```

4. **Verify configuration:**
   ```cmd
   git config --list
   ```
   You should see `user.name` and `user.email` in the list.

5. **Try committing manually:**
   ```cmd
   git add .
   git commit -m "Initial commit - Library Management System"
   ```

6. **If successful, run `setup-git.bat` again** to continue with GitHub setup.

---

## Alternative: Manual Setup

If the script keeps failing, you can do everything manually:

```cmd
cd "M:\Projects\Library Management System"

:: Configure Git
git config user.name "Your Name"
git config user.email "your.email@example.com"

:: Initialize and commit
git init
git add .
git commit -m "Initial commit"

:: Add GitHub remote (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

:: Push to GitHub
git branch -M main
git push -u origin main
```

---

## Common Causes

1. **Git user not configured** ← Most common
   - Fix: Run `git config user.name` and `git config user.email`

2. **No changes to commit**
   - Fix: Make sure you have files to commit (check with `git status`)

3. **Permission issues**
   - Fix: Run Command Prompt as Administrator

4. **Files already committed**
   - Fix: Check with `git status` - if everything is committed, you're good!

---

## Check Current Status

Run these commands to see what's happening:

```cmd
git status
git config --list | findstr user
```

This will show:
- What files need to be committed
- Your Git user configuration

---

## Updated Script

The updated `setup-git.bat` now handles this automatically. **Just run it again** and it will:
- Check Git configuration
- Prompt you for name/email if needed
- Configure everything automatically
- Continue with the commit

---

**Try running `setup-git.bat` again - it should work now!** 🚀

