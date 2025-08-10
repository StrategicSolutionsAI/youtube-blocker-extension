# YouTube Blocker & Progress Tracker

A complete productivity system to help you avoid YouTube and track your progress staying focused.

## 🎯 What It Does

- **🚫 Blocks YouTube** when you need to focus
- **📊 Tracks your progress** with daily check-ins and streak counting
- **🎉 Celebrates success** with confetti animations
- **🔄 Real-time toggle** between blocking and allowing YouTube
- **💾 Local storage** - your data stays private on your device

## 🌐 Web App

**Try it live**: [https://youtube-blocker-tracker.windsurf.build](https://youtube-blocker-tracker.windsurf.build)

The web app includes:
- Daily check-in system ("On track" or "Slip")
- Progress statistics (current streak, best streak, totals)
- Recent check-in history
- YouTube blocking toggle (requires Chrome extension)

## 🔧 Chrome Extension

The Chrome extension works with the web app to provide real-time YouTube blocking.

### Installation

1. **Download this repository**
   - Click the green "Code" button → "Download ZIP"
   - Extract the ZIP file

2. **Install extension in Chrome**
   - Open Chrome → go to `chrome://extensions/`
   - Enable **"Developer mode"** (toggle in top right)
   - Click **"Load unpacked"**
   - Select the `extension` folder from the downloaded files

3. **Start using**
   - Visit [the web app](https://youtube-blocker-tracker.windsurf.build)
   - Use the red toggle to enable/disable YouTube blocking
   - Track your progress with daily check-ins

### How It Works

- **Toggle ON**: YouTube redirects to a blocked page with link back to the tracker
- **Toggle OFF**: YouTube works normally
- **Real-time sync**: Changes in the web app immediately update the extension
- **Privacy-focused**: No data leaves your browser

## 🛠️ Tech Stack

**Web App:**
- Next.js 15 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Shadcn UI components
- LocalStorage for persistence

**Chrome Extension:**
- Manifest V3
- Service Worker background script
- Content script for web app communication
- Declarative Net Request API for blocking

## 🚀 Features

### Web App Features
- ✅ Daily check-in form with status tracking
- ✅ Progress statistics and streak counting
- ✅ Recent check-in history display
- ✅ Confetti animation for successful check-ins
- ✅ Real-time YouTube blocking toggle
- ✅ Fully static - works offline after first load
- ✅ Mobile-responsive design

### Extension Features
- ✅ Blocks all YouTube domains (youtube.com, m.youtube.com, etc.)
- ✅ Real-time communication with web app
- ✅ Custom blocked page with helpful messaging
- ✅ Minimal permissions (only YouTube domains + web app)
- ✅ No background data collection

## 🔒 Privacy

- **No external servers**: All data stored locally in your browser
- **No tracking**: Extension only blocks YouTube, doesn't monitor browsing
- **No accounts**: No sign-up or personal information required
- **Open source**: All code is visible and auditable

## 🐛 Troubleshooting

**Extension not blocking YouTube?**
- Ensure extension is enabled in `chrome://extensions/`
- Try reloading the extension
- Check that Developer mode is enabled

**Toggle not working?**
- Hard refresh the web app (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console (F12) for error messages
- Ensure extension has permissions for the web app domain

**Lost progress data?**
- Data is stored in browser localStorage
- Clearing browser data will reset progress
- Each browser/device maintains separate progress

## 🤝 Contributing

This is a personal productivity tool, but feel free to:
- Report bugs via GitHub Issues
- Suggest improvements
- Fork and customize for your needs

## 📄 License

Open source - feel free to use, modify, and share!

---

**Built to help you stay focused and productive!** 🎯

*If this tool helps you avoid YouTube distractions, consider sharing it with others who might benefit.*
