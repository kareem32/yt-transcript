export interface Transcript {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  language: string;
}

export interface TranscriptSegment {
  text: string;
  startTime: number;
  endTime: number;
}

export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  availableLanguages: string[];
}