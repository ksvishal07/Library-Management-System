@echo off
chcp 65001 >nul
color 0A
title Library Management System - Git Setup

echo.
echo ========================================
echo   Library Management System
echo   Git Setup for Cloud Deployment
echo ========================================
echo.

:: Check if Git is installed
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed!
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo After installation, run this script again.
    echo.
    pause
    exit /b 1
)

echo [✓] Git is installed
echo.

:: Check if already a git repository
if exist ".git" (
    echo [INFO] Git repository already initialized
    echo.
) else (
    echo [1/5] Initializing Git repository...
    git init
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to initialize Git repository
        pause
        exit /b 1
    )
    echo [✓] Git repository initialized
    echo.
)

:: Check if .gitignore exists
if not exist ".gitignore" (
    echo [WARNING] .gitignore file not found. Creating one...
    echo node_modules/ > .gitignore
    echo library.db >> .gitignore
    echo .DS_Store >> .gitignore
    echo *.log >> .gitignore
    echo .env >> .gitignore
    echo [✓] .gitignore created
    echo.
)

:: Stage all files
echo [2/5] Staging files...
git add .
if %errorlevel% neq 0 (
    echo [ERROR] Failed to stage files
    pause
    exit /b 1
)
echo [✓] Files staged
echo.

:: Check if there are changes to commit
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo [INFO] No changes to commit
    echo.
) else (
    echo [3/5] Committing files...
    git commit -m "Initial commit - Library Management System"
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to commit files
        pause
        exit /b 1
    )
    echo [✓] Files committed
    echo.
)

:: Check for existing remote
git remote -v >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Remote repository already configured
    git remote -v
    echo.
    set /p push_choice="Do you want to push to GitHub now? (Y/N): "
    if /i "%push_choice%"=="Y" (
        echo.
        echo [4/5] Pushing to GitHub...
        git branch -M main
        git push -u origin main
        if %errorlevel% equ 0 (
            echo [✓] Successfully pushed to GitHub!
        ) else (
            echo [ERROR] Failed to push. Please check your remote URL and credentials.
        )
    )
) else (
    echo [4/5] GitHub Repository Setup
    echo.
    echo You need to create a GitHub repository first:
    echo.
    echo Steps:
    echo 1. Go to https://github.com/new
    echo 2. Create a new repository (name it: library-management-system)
    echo 3. DO NOT initialize with README, .gitignore, or license
    echo 4. Copy the repository URL (e.g., https://github.com/username/library-management-system.git)
    echo.
    set /p github_url="Enter your GitHub repository URL: "
    
    if "%github_url%"=="" (
        echo [SKIP] No URL provided. You can add it later with:
        echo        git remote add origin YOUR_URL
        echo        git push -u origin main
    ) else (
        echo.
        echo [INFO] Adding remote repository...
        git branch -M main
        git remote add origin "%github_url%"
        if %errorlevel% neq 0 (
            echo [ERROR] Failed to add remote. The URL might be incorrect.
            pause
            exit /b 1
        )
        echo [✓] Remote repository added
        echo.
        
        set /p push_now="Do you want to push to GitHub now? (Y/N): "
        if /i "%push_now%"=="Y" (
            echo.
            echo [5/5] Pushing to GitHub...
            echo [INFO] You may be prompted for GitHub credentials
            git push -u origin main
            if %errorlevel% equ 0 (
                echo [✓] Successfully pushed to GitHub!
            ) else (
                echo.
                echo [ERROR] Push failed. Common issues:
                echo - Authentication required (use GitHub Personal Access Token)
                echo - Repository doesn't exist or URL is incorrect
                echo.
                echo You can push manually later with: git push -u origin main
            )
        )
    )
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo.
echo 1. If you haven't pushed to GitHub yet:
echo    - Create a repository at https://github.com/new
echo    - Run: git remote add origin YOUR_REPO_URL
echo    - Run: git push -u origin main
echo.
echo 2. Deploy to Render (Free):
echo    - Go to https://render.com
echo    - Sign up with GitHub
echo    - Click "New +" ^> "Web Service"
echo    - Connect your GitHub repository
echo    - Settings:
echo      * Build Command: npm install
echo      * Start Command: npm start
echo      * Plan: Free
echo    - Click "Create Web Service"
echo    - Wait 2-3 minutes for deployment
echo.
echo 3. Your app will be live at:
echo    https://your-app-name.onrender.com
echo.
echo For detailed instructions, see: QUICK_DEPLOY.md
echo.
pause

