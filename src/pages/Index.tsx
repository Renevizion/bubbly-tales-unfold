
import React from 'react';
import StoryThemeSelector from '@/components/StoryThemeSelector';
import { Book } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-bubbly-blue to-white py-16 px-4 rounded-b-3xl">
        <div className="container mx-auto text-center">
          <div className="inline-block animate-bounce-soft">
            <div className="rounded-full bg-white p-4 shadow-lg inline-block mb-4">
              <Book className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            StoryBubble
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover magical stories, listen to adventures, and create your own tales in just a few taps!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <StoryThemeSelector />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bubble-container bg-bubbly-yellow">
            <h2 className="text-xl font-bold mb-3">Listen to Stories</h2>
            <p className="mb-4">Choose from our collection and have stories read aloud in a friendly voice.</p>
            <div className="h-32 flex items-center justify-center bg-white bg-opacity-50 rounded-xl">
              <span className="text-gray-500 italic">Voice model connecting soon</span>
            </div>
          </div>

          <div className="bubble-container bg-bubbly-green">
            <h2 className="text-xl font-bold mb-3">Create Your Own</h2>
            <p className="mb-4">Write or paste your own stories and listen to them come alive.</p>
            <div className="h-32 flex items-center justify-center bg-white bg-opacity-50 rounded-xl">
              <span className="text-gray-500 italic">Your stories will appear here</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
