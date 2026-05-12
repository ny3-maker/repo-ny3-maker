const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const DOWNLOADS_DIR = path.join(__dirname, 'downloads');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/downloads', express.static(DOWNLOADS_DIR));

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Get Video Information
app.get('/api/info', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }

    // Validate YouTube URL
    if (!isValidYouTubeUrl(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const command = `yt-dlp -j "${url}"`;
    const output = execSync(command, { encoding: 'utf-8' });
    const videoInfo = JSON.parse(output);

    res.json({
      title: videoInfo.title,
      duration: videoInfo.duration,
      uploader: videoInfo.uploader,
      upload_date: videoInfo.upload_date,
      view_count: videoInfo.view_count,
      formats: videoInfo.formats.map(f => ({
        format_id: f.format_id,
        ext: f.ext,
        resolution: f.format,
        filesize: f.filesize
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download Video or Audio
app.post('/api/download', async (req, res) => {
  try {
    const { url, format = 'best', audioOnly = false } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }

    if (!isValidYouTubeUrl(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    let command = `yt-dlp -o "${DOWNLOADS_DIR}/%(title)s.%(ext)s"`;

    if (audioOnly) {
      command += ` -x --audio-format mp3 --audio-quality 192K`;
    } else {
      command += ` -f "${format}"`;
    }

    command += ` "${url}"`;

    try {
      execSync(command, { encoding: 'utf-8' });
      res.json({ 
        success: true, 
        message: audioOnly ? 'Audio extracted successfully' : 'Video downloaded successfully',
        downloadPath: '/downloads'
      });
    } catch (execError) {
      res.status(500).json({ error: 'Failed to download video', details: execError.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List Downloaded Files
app.get('/api/downloads', (req, res) => {
  try {
    const files = fs.readdirSync(DOWNLOADS_DIR).map(file => {
      const filePath = path.join(DOWNLOADS_DIR, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        created: stats.birthtime,
        url: `/downloads/${file}`
      };
    });

    res.json({ files, count: files.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download File
app.get('/downloads/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(DOWNLOADS_DIR, filename);

    // Prevent directory traversal
    if (!filePath.startsWith(DOWNLOADS_DIR)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate YouTube URL
function isValidYouTubeUrl(url) {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\/\S+$/;
  return youtubeRegex.test(url);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 YouTube Downloader API running on http://localhost:${PORT}`);
  console.log(`📁 Downloads directory: ${DOWNLOADS_DIR}`);
});
