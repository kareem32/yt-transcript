import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { YoutubeTranscript } from 'youtube-transcript';
import { YOUTUBE_API_KEY } from './config.js';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Schema validation
const urlSchema = z.object({
  url: z.string().url()
});

// Helper function to extract video ID from YouTube URL
function extractVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Helper function to get video info using YouTube Data API
async function getVideoInfo(videoId) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found');
    }
    
    const snippet = data.items[0].snippet;
    return {
      id: videoId,
      title: snippet.title,
      thumbnail: snippet.thumbnails.high.url
    };
  } catch (error) {
    console.error('Error fetching video info:', error);
    throw new Error('Failed to fetch video info');
  }
}

app.post('/api/transcript', async (req, res) => {
  try {
    // Validate request body
    const { url } = urlSchema.parse(req.body);
    
    // Extract video ID
    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Get transcripts
    const transcriptList = await YoutubeTranscript.listTranscripts(videoId);
    const defaultTranscript = await transcriptList.getDefaultTranscript();
    const transcript = await defaultTranscript.fetch();
    
    // Get available languages
    const availableLanguages = transcriptList.translationLanguages.map(lang => lang.languageName);
    
    // Get video info
    const videoInfo = await getVideoInfo(videoId);

    res.json({
      transcript: transcript.map((item, index) => ({
        id: index.toString(),
        text: item.text,
        startTime: item.start,
        endTime: item.start + item.duration,
        language: 'en'
      })),
      videoInfo: {
        ...videoInfo,
        availableLanguages: ['English', ...availableLanguages]
      }
    });
  } catch (error) {
    console.error('Error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request format' });
    }
    
    if (error.message === 'Video not found') {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (error.message.includes('No captions')) {
      return res.status(404).json({ error: 'No captions available for this video' });
    }

    res.status(500).json({ error: 'Failed to fetch transcript. Please try again.' });
  }
});

app.post('/api/transcript/:language', async (req, res) => {
  try {
    const { url } = urlSchema.parse(req.body);
    const { language } = req.params;
    
    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const transcriptList = await YoutubeTranscript.listTranscripts(videoId);
    let transcript;

    if (language.toLowerCase() === 'english') {
      const defaultTranscript = await transcriptList.getDefaultTranscript();
      transcript = await defaultTranscript.fetch();
    } else {
      const languageCode = transcriptList.translationLanguages.find(
        lang => lang.languageName === language
      )?.languageCode;

      if (!languageCode) {
        return res.status(400).json({ error: 'Language not available' });
      }

      const defaultTranscript = await transcriptList.getDefaultTranscript();
      transcript = await defaultTranscript.translate(languageCode);
    }

    res.json({
      transcript: transcript.map((item, index) => ({
        id: index.toString(),
        text: item.text,
        startTime: item.start,
        endTime: item.start + item.duration,
        language
      }))
    });
  } catch (error) {
    console.error('Error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request format' });
    }
    
    if (error.message.includes('No captions')) {
      return res.status(404).json({ error: 'No captions available for this video' });
    }

    res.status(500).json({ 
      error: 'Failed to fetch transcript in the requested language. Please try again.' 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});