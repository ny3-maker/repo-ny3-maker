# 🎬 YouTube Video Downloader API

A powerful Express.js web server API for downloading YouTube videos and extracting audio. Built with Node.js and yt-dlp.

## 📋 Features

✅ **Download Videos** - Download videos in multiple quality options (720p, 480p, 360p, best)  
✅ **Extract Audio** - Convert videos to MP3 audio files  
✅ **Video Information** - Get detailed video metadata (title, duration, uploader, formats)  
✅ **List Downloads** - View all downloaded files  
✅ **File Management** - Download your files through the API  
✅ **Error Handling** - Comprehensive error messages and validation  
✅ **CORS Enabled** - Works with frontend applications  

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.6 or higher)
- yt-dlp

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ny3-maker/repo-ny3-maker.git
   cd repo-ny3-maker
   ```

2. **Install Node dependencies:**
   ```bash
   npm install
   ```

3. **Install yt-dlp:**
   ```bash
   # Using pip
   pip install yt-dlp

   # Or using brew (macOS)
   brew install yt-dlp

   # Or using chocolatey (Windows)
   choco install yt-dlp
   ```

4. **Create `.env` file** (optional):
   ```bash
   cp .env.example .env
   ```

5. **Start the server:**
   ```bash
   npm run dev    # Development mode with auto-reload
   # or
   npm start      # Production mode
   ```

The server will run on `http://localhost:3000`

## 📡 API Endpoints

### 1. Health Check
```
GET /api/health
```
**Response:**
```json
{
  "status": "Server is running",
  "timestamp": "2026-05-12T19:20:00Z"
}
```

### 2. Get Video Information
```
GET /api/info?url=https://www.youtube.com/watch?v=VIDEO_ID
```

**Query Parameters:**
- `url` (required) - YouTube video URL

**Response:**
```json
{
  "title": "Video Title",
  "duration": 600,
  "uploader": "Channel Name",
  "upload_date": "20260512",
  "view_count": 1000000,
  "formats": [
    {
      "format_id": "22",
      "ext": "mp4",
      "resolution": "720x1280",
      "filesize": 52428800
    }
  ]
}
```

### 3. Download Video or Audio
```
POST /api/download
```

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "format": "best",
  "audioOnly": false
}
```

**Parameters:**
- `url` (required) - YouTube video URL
- `format` (optional) - Video quality: `best`, `720p`, `480p`, `360p` (default: `best`)
- `audioOnly` (optional) - Extract audio as MP3 only (default: `false`)

**Response:**
```json
{
  "success": true,
  "message": "Video downloaded successfully",
  "downloadPath": "/downloads"
}
```

### 4. List Downloaded Files
```
GET /api/downloads
```

**Response:**
```json
{
  "files": [
    {
      "name": "video-title.mp4",
      "size": 52428800,
      "created": "2026-05-12T19:20:00Z",
      "url": "/downloads/video-title.mp4"
    }
  ],
  "count": 1
}
```

### 5. Download File
```
GET /downloads/:filename
```

**Parameters:**
- `filename` - Name of the file to download

## 💻 Usage Examples

### Using cURL

**Check server health:**
```bash
curl http://localhost:3000/api/health
```

**Get video information:**
```bash
curl "http://localhost:3000/api/info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

**Download a video:**
```bash
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "format": "best",
    "audioOnly": false
  }'
```

**Download audio only (MP3):**
```bash
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "audioOnly": true
  }'
```

**List downloaded files:**
```bash
curl http://localhost:3000/api/downloads
```

### Using JavaScript/Fetch

```javascript
// Get video information
async function getVideoInfo(url) {
  const response = await fetch(`/api/info?url=${encodeURIComponent(url)}`);
  return response.json();
}

// Download video
async function downloadVideo(url, format = 'best') {
  const response = await fetch('/api/download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, format, audioOnly: false })
  });
  return response.json();
}

// Download audio only
async function downloadAudio(url) {
  const response = await fetch('/api/download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, audioOnly: true })
  });
  return response.json();
}

// List downloads
async function listDownloads() {
  const response = await fetch('/api/downloads');
  return response.json();
}
```

### Using Python/Requests

```python
import requests

# Get video information
url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
response = requests.get(f"http://localhost:3000/api/info?url={url}")
print(response.json())

# Download video
data = {
    "url": url,
    "format": "best",
    "audioOnly": False
}
response = requests.post("http://localhost:3000/api/download", json=data)
print(response.json())
```

## 📁 Project Structure

```
repo-ny3-maker/
├── server.js              # Express.js server
├── package.json           # Dependencies
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── downloads/             # Downloaded files directory
└── README.md              # This file
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
```

## 🛠️ Available Scripts

```bash
npm start      # Start the server
npm run dev    # Start with nodemon (auto-reload)
```

## ⚠️ Important Notes

1. **yt-dlp Installation** - Make sure yt-dlp is installed and accessible from your PATH
2. **Storage** - Downloaded files are stored in the `downloads/` directory
3. **YouTube Terms** - Ensure you comply with YouTube's Terms of Service when downloading content
4. **File Size** - Large videos may take time to download
5. **Formats** - Not all videos support all quality formats

## 🐛 Troubleshooting

### "yt-dlp command not found"
- Ensure yt-dlp is installed: `pip install yt-dlp`
- Add it to your PATH or use the full path in the command

### "Port already in use"
- Change the PORT in `.env` file or use: `PORT=3001 npm start`

### "Invalid YouTube URL"
- Make sure the URL is a valid YouTube video URL
- Example valid URLs:
  - `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
  - `https://youtu.be/dQw4w9WgXcQ`

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes

## 🤝 Contributing

Contributions are welcome! Feel free to submit pull requests or open issues.

## 📞 Support

For issues or questions, please open an issue on GitHub: https://github.com/ny3-maker/repo-ny3-maker/issues
