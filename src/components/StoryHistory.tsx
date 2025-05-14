
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStory } from '../contexts/StoryContext';
import { Book, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StoryHistory: React.FC = () => {
  const navigate = useNavigate();
  const { stories } = useStory();
  
  // Sort stories by timestamp, newest first
  const sortedStories = [...stories].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleOpenStory = (id: string) => {
    navigate(`/story/${id}`);
  };

  if (sortedStories.length === 0) {
    return (
      <div className="page-container">
        <div className="story-card bg-bubbly-gray flex flex-col items-center justify-center py-16">
          <Book className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-center mb-2">No Stories Yet</h2>
          <p className="text-muted-foreground mb-6">You haven't read any stories yet</p>
          <Button 
            onClick={() => navigate('/')} 
            className="rounded-full"
          >
            Discover Stories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Story History</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedStories.map((story) => (
          <div 
            key={story.id}
            className="story-card bg-white hover:bg-bubbly-blue hover:bg-opacity-20 cursor-pointer transition-all"
            onClick={() => handleOpenStory(story.id)}
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold text-primary">{story.title}</h2>
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-bubbly-purple bg-opacity-70">
                {story.theme.charAt(0).toUpperCase() + story.theme.slice(1)}
              </span>
            </div>
            
            <p className="line-clamp-3 text-gray-600 mb-4">
              {story.content.substring(0, 150)}...
            </p>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>{new Date(story.timestamp).toLocaleDateString()}</span>
              </div>
              
              <Button 
                variant="ghost" 
                className="p-0 h-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenStory(story.id);
                }}
              >
                <span className="text-sm text-primary font-medium flex items-center">
                  Continue Reading 
                  <ArrowRight className="h-3 w-3 ml-1" />
                </span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryHistory;
