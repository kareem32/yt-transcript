import axios from 'axios';
import type { Transcript, VideoInfo } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

interface TranscriptResponse {
  transcript: Transcript[];
  videoInfo: VideoInfo;
}

export async function getTranscript(url: string): Promise<TranscriptResponse> {
  try {
    const response = await axios.post<TranscriptResponse>(`${API_BASE_URL}/transcript`, { url });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to fetch transcript');
    }
    throw error;
  }
}

export async function getTranscriptInLanguage(videoId: string, language: string): Promise<{ transcript: Transcript[] }> {
  try {
    const response = await axios.post<{ transcript: Transcript[] }>(
      `${API_BASE_URL}/transcript/${encodeURIComponent(language)}`,
      { url: `https://www.youtube.com/watch?v=${videoId}` }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to fetch transcript');
    }
    throw error;
  }
}