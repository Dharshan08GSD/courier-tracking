@echo off
REM ============================================================================
REM One-Click GitHub Deployment Script
REM Student: Dharshan S | Reg: 732925ITR026 | Class: 25IT3A | VCET IT
REM Scenario 26: Courier and Parcel Tracking Management System
REM ============================================================================

echo ================================================================================
echo           SWIFTTRACK: GITHUB DEPLOYMENT & GITHUB PAGES ACTIVATION               
echo ================================================================================
echo.

git --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not installed or not in your system PATH!
    echo Please install Git from https://git-scm.com and retry.
    pause
    exit /b 1
)

echo [1/4] Staging all files...
git add .

echo [2/4] Committing project files...
git commit -m "Complete Scenario 26 Courier Tracking Management System - Dharshan S (732925ITR026)"

echo.
echo [3/4] Configure GitHub Remote Repository:
set /p REPO_URL="Enter your GitHub Repository URL (e.g., https://github.com/username/repo-name.git): "

if "%REPO_URL%"=="" (
    echo [WARNING] No repository URL provided. Skipping remote push.
    echo You can push manually using:
    echo   git remote add origin ^<your-url^>
    echo   git push -u origin main
    pause
    exit /b 0
)

git branch -M main
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%

echo [4/4] Pushing to GitHub (main branch)...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================================================
    echo [SUCCESS] Your project has been pushed to GitHub!
    echo.
    echo To activate your 24/7 LIVE Website on GitHub Pages:
    echo   1. Open your repository on GitHub in your browser.
    echo   2. Go to: Settings -^> Pages
    echo   3. Under 'Build and deployment' -^> 'Branch', select: main
    echo   4. Select folder: / (root) and click Save!
    echo.
    echo Your website will be live 24/7 with zero hosting costs!
    echo ================================================================================
) else (
    echo.
    echo [ERROR] Failed to push to GitHub. Please check your repository URL and credentials.
)

pause
