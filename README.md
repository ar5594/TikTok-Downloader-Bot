# 🎬 Vito Multi Downloader (K9K Edition)

A powerful and modern **Discord bot** built with `discord.js v14` that allows users to download TikTok videos in multiple formats — including **No Watermark, HD, Watermarked, and MP3 audio** — through an interactive and clean interface.

---

## ✨ Features

* 🎞️ Download TikTok videos **without watermark**
* 💎 High-quality (HD) video support
* 🏷️ Download with watermark (original format)
* 🎵 Extract audio (MP3)
* ⚡ Fast API integration using TikWM
* 🧠 Smart session handling
* 📩 Send files via DM or log channel
* 🎛️ Slash command system
* 🔒 Admin-only setup commands
* 🎨 Clean UI (Embeds, Buttons, Modals)

---

## 📦 Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/vito-multi-downloader.git
cd vito-multi-downloader
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Bot

Open `config.json` and add your token:

```json
{
  "token": "YOUR_BOT_TOKEN",
  "fixedChannelId": "CHANNEL_ID",
  "logsChannelId": "CHANNEL_ID",
  "brandName": "K9K",
  "sendToDM": false,
  "features": {
    "tiktok": {
      "enabled": true
    }
  }
}
```

---

## 🚀 Run the Bot

```bash
npm start
```

---

## 💻 Run on PC

1. Install Node.js (v18+)
2. Download project files
3. Open folder in terminal
4. Run:

```bash
npm install
npm start
```

---

## ☁️ Run on Hosting (VPS / Panels / Replit / etc.)

1. Upload project files
2. Open `config.json`
3. Paste your **bot token**
4. Run:

```bash
npm install
node index.js
```

> ✔️ Just upload → add token → run

---

## 🤖 How to Use (Inside Discord)

1. Use `/setup`
2. Click the TikTok button
3. Paste video link
4. Choose format:

   * 🎞️ No Watermark
   * 💎 HD
   * 🏷️ Watermark
   * 🎵 MP3
5. Bot sends the file automatically

---

## 🌐 Expand the Bot

You can تطوير البوت بسهولة وإضافة منصات مثل:

* ▶️ YouTube
* 📸 Instagram
* 👍 Facebook
* 🐦 Twitter (X)
* 📌 Pinterest

Just add new buttons + APIs inside `/commands`.

---

## ⭐ Support & Contribution

If you like this project:

* ⭐ Give it a star on GitHub
* 🛠️ Contribute & improve the code
* 💡 Suggest new features
* 🔥 Fork and build your own version

---

## 📞 Technical Support & Community

If you encounter bugs or need help:

* **Discord Community:** https://discord.gg/wxkxHmR9GT
* **Discord Operator:** `r.vu`
* **Version:** Forensic Engine 2.0.26 (Secured Build)

**Engine Architect:** k9k (r.vu)

---
