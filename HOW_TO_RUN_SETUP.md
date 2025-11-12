# How to Run setup-git.bat

## 🖱️ Method 1: Double-Click (Easiest)

1. Open **File Explorer**
2. Navigate to: `M:\Projects\Library Management System`
3. Find the file: **`setup-git.bat`**
4. **Double-click** it
5. A Command Prompt window will open automatically
6. Follow the prompts shown on screen

---

## ⌨️ Method 2: From Command Prompt

1. Press **Windows Key + R**
2. Type: `cmd` and press **Enter**
3. Navigate to your project:
   ```cmd
   cd "M:\Projects\Library Management System"
   ```
4. Run the script:
   ```cmd
   setup-git.bat
   ```

---

## 💻 Method 3: From PowerShell

1. Press **Windows Key + X**
2. Select **"Windows PowerShell"** or **"Terminal"**
3. Navigate to your project:
   ```powershell
   cd "M:\Projects\Library Management System"
   ```
4. Run the script:
   ```powershell
   .\setup-git.bat
   ```

---

## 🔍 What You'll See

When you run the script, you'll see:

```
========================================
  Library Management System
  Git Setup for Cloud Deployment
========================================

[✓] Git is installed

[1/5] Initializing Git repository...
[✓] Git repository initialized

[2/5] Staging files...
[✓] Files staged

[3/5] Committing files...
[✓] Files committed

[4/5] GitHub Repository Setup
...
```

---

## ⚠️ Troubleshooting

### Script Closes Immediately
- **Solution:** Run from Command Prompt to see error messages
- Open Command Prompt, navigate to folder, run: `setup-git.bat`

### "Git is not recognized"
- **Solution:** Install Git from https://git-scm.com/download/win
- After installation, restart Command Prompt and try again

### Permission Denied
- **Solution:** Right-click `setup-git.bat` → Properties → Unblock → OK
- Or run Command Prompt as Administrator

### Script Won't Run
- **Solution:** Check if file extension is `.bat` (not `.bat.txt`)
- Make sure you're in the correct folder

---

## ✅ Quick Test

To verify everything works:

1. Open Command Prompt
2. Type:
   ```cmd
   cd "M:\Projects\Library Management System"
   setup-git.bat
   ```
3. You should see the setup menu

---

## 📝 Next Steps After Running

Once the script completes:

1. ✅ Your code is committed to Git
2. ✅ (If you provided GitHub URL) Code is pushed to GitHub
3. 📖 Read `DEPLOY_TO_RENDER.md` for deployment steps
4. 🚀 Deploy to Render (free hosting)

---

**That's it! Just double-click `setup-git.bat` to get started! 🎉**

