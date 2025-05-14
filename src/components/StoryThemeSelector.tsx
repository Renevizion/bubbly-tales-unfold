
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StoryTheme, useStory } from '../contexts/StoryContext';
import { BookOpen, Book, Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThemeCard {
  theme: StoryTheme;
  label: string;
  color: string;
  description: string;
}

const themeCards: ThemeCard[] = [
  {
    theme: 'adventure',
    label: 'Adventure',
    color: 'bg-bubbly-blue',
    description: 'Exciting journeys and discoveries',
  },
  {
    theme: 'fantasy',
    label: 'Fantasy',
    color: 'bg-bubbly-purple',
    description: 'Magic, dragons, and wonder',
  },
  {
    theme: 'mystery',
    label: 'Mystery',
    color: 'bg-bubbly-peach',
    description: 'Puzzles and secret clues',
  },
  {
    theme: 'animals',
    label: 'Animals',
    color: 'bg-bubbly-green',
    description: 'Stories with furry friends',
  },
  {
    theme: 'friendship',
    label: 'Friendship',
    color: 'bg-bubbly-pink',
    description: 'Tales of kindness and caring',
  },
  {
    theme: 'space',
    label: 'Space',
    color: 'bg-bubbly-gray',
    description: 'Adventures among the stars',
  },
  {
    theme: 'random',
    label: 'Random',
    color: 'bg-bubbly-yellow',
    description: 'Surprise me with any story!',
  },
];

const StoryThemeSelector: React.FC = () => {
  const navigate = useNavigate();
  const { getStoriesByTheme, setCurrentStory } = useStory();

  const handleSelectTheme = (theme: StoryTheme) => {
    const storiesInTheme = getStoriesByTheme(theme);
    if (storiesInTheme.length > 0) {
      // Pick a random story from the theme
      const randomIndex = Math.floor(Math.random() * storiesInTheme.length);
      const selectedStory = storiesInTheme[randomIndex];
      setCurrentStory(selectedStory);
      navigate(`/story/${selectedStory.id}`);
    } else {
      // If no stories in the theme yet, go to create page
      navigate('/create', { state: { selectedTheme: theme } });
    }
  };

  const handleQuickStart = () => {
    const randomTheme = themeCards[Math.floor(Math.random() * themeCards.length)].theme;
    handleSelectTheme(randomTheme);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <Button 
          onClick={handleQuickStart} 
          className="bg-primary hover:bg-primary/90 text-white text-lg rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 animate-pulse-gentle"
        >
          <Play className="h-5 w-5" />
          Start Reading Now
          <ArrowRight className="h-5 w-5 ml-1" />
        </Button>
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-6">Choose a Story Theme</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {themeCards.map((card) => (
          <button
            key={card.theme}
            onClick={() => handleSelectTheme(card.theme)}
            className={`${card.color} rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full`}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-3 text-center">
              <div className="rounded-full bg-white p-3 shadow-md">
                {card.theme === 'random' ? (
                  <BookOpen className="h-6 w-6 text-primary" />
                ) : (
                  <Book className="h-6 w-6 text-primary" />
                )}
              </div>
              <h3 className="font-bold text-lg">{card.label}</h3>
              <p className="text-sm text-gray-700">{card.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StoryThemeSelector;
