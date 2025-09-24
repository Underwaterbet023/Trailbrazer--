@echo off
echo 🚀 Setting up GitHub Repository for Trailbrazer--
echo.

REM Check if Git is available
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!
echo.

REM Get GitHub username
echo Please enter your GitHub username:
set /p GITHUB_USERNAME=

if "%GITHUB_USERNAME%"=="" (
    echo ❌ GitHub username cannot be empty.
    pause
    exit /b 1
)

echo.
echo 🔗 Setting up remote repository...
git remote add origin https://github.com/%GITHUB_USERNAME%/Trailbrazer--.git

if %errorlevel% neq 0 (
    echo ⚠️  Remote origin might already exist. Updating...
    git remote set-url origin https://github.com/%GITHUB_USERNAME%/Trailbrazer--.git
)

echo ✅ Remote repository configured!
echo.

echo 📤 Pushing code to GitHub...
git push -u origin main

if %errorlevel% neq 0 (
    echo ❌ Failed to push to GitHub. Please ensure:
    echo    1. You have created the repository 'Trailbrazer--' on GitHub
    echo    2. You have proper permissions
    echo    3. Your GitHub credentials are configured
    pause
    exit /b 1
)

echo ✅ Code pushed to GitHub successfully!
echo.

echo 🌐 Deploying to GitHub Pages...
npm run deploy

if %errorlevel% neq 0 (
    echo ❌ Deployment failed. Please check:
    echo    1. GitHub Pages is enabled in repository settings
    echo    2. Build process completes successfully
    echo    3. No build errors in the console
    pause
    exit /b 1
)

echo.
echo 🎉 SUCCESS! Your TravelHub website is now live!
echo 📍 Website URL: https://%GITHUB_USERNAME%.github.io/Trailbrazer--/
echo.
echo 📝 Next steps:
echo    1. Go to your GitHub repository settings
echo    2. Navigate to Pages section
echo    3. Ensure GitHub Pages is enabled
echo    4. Wait 5-10 minutes for the site to go live
echo.
pause