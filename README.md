# 📥 TikTok Downloader Terminal (VMD)

A professional-grade Discord bot designed for seamless, high-speed TikTok media retrieval. Built with a "Terminal" aesthetic, it allows users to extract content without watermarks directly into their Discord server.

![Status](https://img.shields.io/badge/Status-Operational-0x12B5B5)
![Platform](https://img.shields.io/badge/Platform-Discord-7289DA)
![Node](https://img.shields.io/badge/Node.js-v16.x+-339933)

---

## 🚀 Key Features

* **Extraction Protocols**: Choose between **No Watermark**, **HD Quality**, **Watermarked**, or **MP3 Audio**.
* **Modern Interface**: Fully interactive UI using Discord Buttons, Modals, and Professional Embeds.
* **Secure & Ephemeral**: Processing is kept private to the user until final delivery.
* **Multi-Guild Ready**: Independent configurations for logs and setup in every server.
* **Advanced Stats**: Displays real-time video data (Likes, Comments, Views).

---

## ⚙️ Installation & Hosting

Follow these steps to get your own instance running on **PC** or **VPS**:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v16.11.0 or higher) installed on your system.

### 2. Setup the Project
* **Download**: Click the green **Code** button and select **Download ZIP**, then extract it.
* **Navigate**: Open your Terminal / Command Prompt (CMD) in the project folder.
* **Install Dependencies**:
    ```bash
    npm install discord.js axios
    ```

### 3. Configuration
Open `config.json` and enter your credentials:
```json
{
  "token": "YOUR_BOT_TOKEN_HERE",
  "brandName": "K9K",
  "features": { "tiktok": { "enabled": true } }
}
