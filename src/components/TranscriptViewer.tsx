import React, { useState } from 'react';
import { Download, Copy, Clock, Type } from 'lucide-react';
import type { Transcript, VideoInfo } from '../types';

interface TranscriptViewerProps {
  transcript: Transcript[];
  videoInfo: VideoInfo;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export function TranscriptViewer({
  transcript,
  videoInfo,
  selectedLanguage,
  onLanguageChange,
}: TranscriptViewerProps) {
  const [showTimestamps, setShowTimestamps] = useState(true);

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    return date.toISOString().substr(11, 8);
  };

  const copyToClipboard = () => {
    const text = transcript
      .map((segment) => {
        return showTimestamps
          ? `[${formatTime(segment.startTime)}] ${segment.text}`
          : segment.text;
      })
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Video Info Header */}
      <div className="p-6 bg-gray-50 border-b">
        <div className="flex items-center gap-4">
          <img
            src={videoInfo.thumbnail}
            alt={videoInfo.title}
            className="w-24 h-16 object-cover rounded"
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 line-clamp-1">
              {videoInfo.title}
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <select
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="px-3 py-1 rounded border text-sm"
              >
                {videoInfo.availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowTimestamps(!showTimestamps)}
                className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                  showTimestamps ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
                }`}
              >
                <Clock size={16} />
                Timestamps
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Content */}
      <div className="p-6">
        <div className="mb-4 flex justify-end gap-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Copy size={18} />
            Copy
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <Download size={18} />
            Download
          </button>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {transcript.map((segment, index) => (
            <div
              key={index}
              className="mb-4 p-3 rounded hover:bg-gray-50 transition-colors"
            >
              {showTimestamps && (
                <span className="text-sm text-gray-500 font-mono block mb-1">
                  [{formatTime(segment.startTime)}]
                </span>
              )}
              <p className="text-gray-800">{segment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}