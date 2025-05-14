
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type StoryTheme = 'adventure' | 'fantasy' | 'mystery' | 'animals' | 'friendship' | 'space' | 'random';

export interface Story {
  id: string;
  title: string;
  content: string;
  theme: StoryTheme;
  timestamp: Date;
  custom?: boolean;
}

interface StoryContextType {
  stories: Story[];
  currentStory: Story | null;
  setCurrentStory: (story: Story | null) => void;
  addStory: (story: Story) => void;
  getStoryById: (id: string) => Story | undefined;
  getStoriesByTheme: (theme: StoryTheme) => Story[];
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

// Sample stories
const sampleStories: Story[] = [
  {
    id: '1',
    title: 'The Magic Forest',
    content: 'Once upon a time, in a forest filled with tall trees and magical creatures, there lived a small rabbit named Hopper. Hopper was different from the other rabbits because he had bright blue fur that sparkled in the sunlight.\n\nOne day, Hopper discovered a hidden path that led to a clearing where a wise old owl sat on a branch. "Hello, little one," the owl said. "I've been waiting for you." The owl told Hopper about a special mission. There was a golden carrot hidden deep in the forest, and only a brave rabbit with a kind heart could find it.\n\nHopper set off on his adventure, hopping through flowers and crossing tiny streams. Along the way, he met a fox who tried to trick him, but Hopper was clever and kind. He shared his berries with the fox, who was so touched by Hopper's generosity that he decided to help instead of trick.\n\nTogether, they found the golden carrot glowing beneath a mushroom. When Hopper touched it, the carrot transformed into a crown. The owl appeared and explained that the forest needed a new guardian, and Hopper's kindness made him the perfect choice.\n\nFrom that day on, Hopper the blue rabbit wore his crown proudly and protected all the creatures of the magic forest, teaching everyone that kindness is the greatest magic of all.',
    theme: 'fantasy',
    timestamp: new Date(),
  },
  {
    id: '2',
    title: 'Captain Whiskers and the Space Adventure',
    content: 'Captain Whiskers was a brave cat astronaut with a shiny helmet and a fluffy tail. He lived in a small spaceship shaped like a cat toy, orbiting around Earth.\n\n"Time for a new adventure!" Captain Whiskers meowed as he pressed buttons on his control panel. His spaceship zoomed past the moon and headed toward Mars, the red planet.\n\nOn the way, Captain Whiskers saw a strange light blinking. It was coming from a tiny asteroid. He steered his spaceship closer and discovered a lost alien pet! The alien pet was round and green with three eyes and made happy chirping sounds.\n\n"Don't worry, little friend," said Captain Whiskers. "I'll help you find your home."\n\nThey traveled together through a field of sparkly stars and past Jupiter's swirling clouds. The alien pet pointed toward a colorful planet with rainbow rings.\n\n"Is that your home?" asked Captain Whiskers.\n\nThe alien pet bounced up and down excitedly.\n\nWhen they landed on the rainbow planet, many more alien pets came running to greet them. They were so happy to see their lost friend! The alien pets threw a thank-you party for Captain Whiskers with space treats and zero-gravity dancing.\n\nBefore he left, the alien pets gave Captain Whiskers a special collar tag that glowed in the dark. Whenever he wears it, he remembers his friends on the rainbow planet.\n\nAnd so, with another adventure complete, Captain Whiskers headed back to Earth, ready for his next mission among the stars.',
    theme: 'space',
    timestamp: new Date(),
  },
  {
    id: '3',
    title: 'The Secret of Whistle Island',
    content: 'Maya and her dog Pepper were spending summer vacation at Grandpa's beach house. Grandpa told them stories about Whistle Island—a mysterious place where the wind made special whistling sounds.\n\n"Can we go there?" Maya asked, her eyes wide with excitement.\n\n"The island only appears when the time is right," Grandpa said with a wink.\n\nEarly the next morning, Maya woke up to Pepper barking at the window. Through the mist, she could see an island that wasn't there yesterday! It had to be Whistle Island!\n\nMaya and Pepper took Grandpa's little boat (with permission and life jackets, of course) and rowed to the island. As they got closer, they heard the gentle whistling sound. It was like the island was singing to them!\n\nOn the beach, they found a trail of seashells that led into a forest of twisted trees. Following the path, they discovered a large clearing with an ancient stone whistle in the center.\n\n"Wow," whispered Maya.\n\nPepper sniffed around the stone and wagged his tail. Maya gently blew into the stone whistle. The sound echoed across the island, and suddenly, colorful birds flew out from the trees. They circled around Maya and Pepper, creating a rainbow in the sky.\n\nA note appeared at Maya's feet. It said: "The island appears to those with pure hearts and curious minds. Take care of nature, and it will reveal its magic to you."\n\nMaya and Pepper spent the day exploring the island, finding friendly creatures and beautiful plants. When the sun began to set, they returned to Grandpa with pockets full of special shells and hearts full of memories.\n\n"Did you discover the secret of Whistle Island?" Grandpa asked.\n\nMaya smiled. "It's not really a secret if I tell you, is it?"\n\nGrandpa laughed and gave her a hug. Sometimes the best adventures are the ones you keep in your heart.',
    theme: 'mystery',
    timestamp: new Date(),
  }
];

export const StoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stories, setStories] = useState<Story[]>(sampleStories);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);

  const addStory = (story: Story) => {
    setStories((prevStories) => [...prevStories, story]);
  };

  const getStoryById = (id: string) => {
    return stories.find((story) => story.id === id);
  };

  const getStoriesByTheme = (theme: StoryTheme) => {
    if (theme === 'random') return stories;
    return stories.filter((story) => story.theme === theme);
  };

  return (
    <StoryContext.Provider
      value={{
        stories,
        currentStory,
        setCurrentStory,
        addStory,
        getStoryById,
        getStoriesByTheme,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};
