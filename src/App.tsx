import React, { useState } from 'react';
import { VideoInput } from './components/VideoInput';
import { TranscriptViewer } from './components/TranscriptViewer';
import { Subtitles } from 'lucide-react';
import type { Transcript, VideoInfo } from './types';
import { getTranscript, getTranscriptInLanguage } from './lib/api';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<Transcript[] | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const handleSubmit = async (url: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const { transcript, videoInfo } = await getTranscript(url);
      setTranscript(transcript);
      setVideoInfo(videoInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transcript');
      setTranscript(null);
      setVideoInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (language: string) => {
    if (!videoInfo) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const { transcript: newTranscript } = await getTranscriptInLanguage(videoInfo.id, language);
      setTranscript(newTranscript);
      setSelectedLanguage(language);
    } catch (err) {
      setError(`Failed to load transcript in ${language}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Subtitles size={40} className="text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              YouTube Transcript Generator
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Generate and download transcripts from any YouTube video in seconds.
            Multiple language support and easy-to-use interface.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center gap-8">
          <VideoInput onSubmit={handleSubmit} isLoading={isLoading} />

          {error && (
            <div className="w-full max-w-3xl p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {transcript && videoInfo && (
            <TranscriptViewer
              transcript={transcript}
              videoInfo={videoInfo}
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
            />
          )}

          {/* Features Section */}
          {!transcript && !error && (
            <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl">
              {[
                {
                  title: 'Multiple Languages',
                  description: 'Support for subtitles in various languages'
                },
                {
                  title: 'Easy Download',
                  description: 'Download transcripts in TXT or SRT formats'
                },
                {
                  title: 'Time Stamps',
                  description: 'Toggle timestamps for precise video reference'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-xl shadow-sm text-center"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;