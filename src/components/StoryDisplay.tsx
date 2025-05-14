
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStory } from '../contexts/StoryContext';
import { Play, Pause, Book, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const StoryDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getStoryById, stories, setCurrentStory } = useStory();
  const [isReading, setIsReading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [storyPages, setStoryPages] = useState<string[]>([]);
  
  const story = id ? getStoryById(id) : null;
  
  useEffect(() => {
    if (story) {
      setCurrentStory(story);
      // Split content into pages (paragraphs)
      const pages = story.content.split('\n\n').filter(p => p.trim() !== '');
      setStoryPages(pages);
    }
  }, [story, setCurrentStory]);

  const handleStartReading = () => {
    setIsReading(true);
    // Here you would connect to the voice model
    console.log('Starting to read story with voice model');
    // For now, we'll just simulate the reading
  };

  const handleStopReading = () => {
    setIsReading(false);
    // Stop the voice model
    console.log('Stopping the voice reading');
  };

  const nextPage = () => {
    if (currentPage < storyPages.length - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToRandomStory = () => {
    const otherStories = stories.filter(s => s.id !== id);
    if (otherStories.length > 0) {
      const randomStory = otherStories[Math.floor(Math.random() * otherStories.length)];
      navigate(`/story/${randomStory.id}`);
    } else {
      navigate('/');
    }
  };

  if (!story) {
    return (
      <div className="page-container">
        <div className="story-card bg-white">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container space-y-6">
      <div className="story-card bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">{story.title}</h1>
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-bubbly-purple">
            {story.theme.charAt(0).toUpperCase() + story.theme.slice(1)}
          </span>
        </div>
        
        <div className="mb-6 bg-bubbly-blue bg-opacity-30 rounded-xl p-4">
          <p className="text-lg leading-relaxed">{storyPages[currentPage]}</p>
        </div>
        
        <div className="flex flex-wrap justify-between items-center gap-4 mt-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Page {currentPage + 1} of {storyPages.length}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={prevPage}
              disabled={currentPage === 0}
              className="rounded-full"
              size="icon"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            {isReading ? (
              <Button
                onClick={handleStopReading}
                variant="outline"
                className="rounded-full flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </Button>
            ) : (
              <Button
                onClick={handleStartReading}
                className="bg-primary hover:bg-primary/90 rounded-full flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                <span>Read Aloud</span>
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={nextPage}
              disabled={currentPage === storyPages.length - 1}
              className="rounded-full"
              size="icon"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button
          onClick={navigateToRandomStory}
          variant="ghost"
          className="rounded-full flex items-center gap-2"
        >
          <Book className="h-4 w-4" />
          <span>Read Another Story</span>
        </Button>
      </div>
    </div>
  );
};

export default StoryDisplay;
