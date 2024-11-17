# YouTube Transcript Generator

A web application that generates transcripts from YouTube videos with multi-language support.

## Prerequisites

- Node.js 18 or higher
- A YouTube Data API key ([Get it here](https://console.cloud.google.com/apis/library/youtube.googleapis.com))

## Setup Instructions

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your YouTube API key to `.env`:
```
YOUTUBE_API_KEY=your_actual_api_key_here
```

## Development

Start the development server:
```bash
npm run dev
```

This will start:
- Frontend at: http://localhost:5173
- Backend at: http://localhost:3000

## Testing

1. Open http://localhost:5173 in your browser
2. Paste a YouTube URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
3. Click "Generate" to fetch the transcript
4. Try different features:
   - Switch between languages
   - Toggle timestamps
   - Copy transcript
   - Download transcript

## Common Test URLs

Here are some YouTube videos good for testing:

- Multi-language video: https://www.youtube.com/watch?v=dQw4w9WgXcQ
- Long video with chapters: https://www.youtube.com/watch?v=jNQXAC9IVRw
- Short video: https://www.youtube.com/watch?v=Y8Wp3dafaMQ

## Troubleshooting

1. If you see "Invalid YouTube URL":
   - Ensure the URL is from youtube.com or youtu.be
   - Check if the video ID is 11 characters long

2. If you see "No captions available":
   - Try a different video that has closed captions

3. If you see "Failed to fetch transcript":
   - Verify your YouTube API key is correct
   - Check if you've enabled YouTube Data API in Google Cloud Console
   - Ensure you haven't exceeded API quota limits