#!/bin/bash

# GitHub Repository Setup Script for YouTube Blocker
echo "🚀 Setting up YouTube Blocker for GitHub..."

# Replace the main README with the GitHub version
echo "📝 Updating README..."
mv README_GITHUB.md README.md

# Update .gitignore for GitHub
echo "🔒 Updating .gitignore..."
mv .gitignore_github .gitignore

# Initialize git repository if not already done
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Add all files
echo "📁 Adding files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: YouTube Blocker & Progress Tracker

- Complete web app with progress tracking and check-ins
- Chrome extension with real-time blocking toggle
- Static deployment ready
- Full messaging bridge between web app and extension"

echo "✅ Repository setup complete!"
echo ""
echo "🌐 Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Run: git remote add origin <your-github-repo-url>"
echo "3. Run: git branch -M main"
echo "4. Run: git push -u origin main"
echo ""
echo "📋 Share with users:"
echo "- Send them your GitHub repository URL"
echo "- They can download ZIP and follow installation instructions"
echo "- Web app works immediately at: https://youtube-blocker-tracker.windsurf.build"
