
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useStory, StoryTheme } from '../contexts/StoryContext';
import { Play, BookOpen, Book, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';

interface LocationState {
  selectedTheme?: StoryTheme;
}

const StoryInput: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { addStory, setCurrentStory } = useStory();
  const locationState = location.state as LocationState;
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [theme, setTheme] = useState<StoryTheme>(locationState?.selectedTheme || 'fantasy');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your story.",
        variant: "destructive",
      });
      return;
    }
    
    const newStory = {
      id: uuidv4(),
      title,
      content,
      theme,
      timestamp: new Date(),
      custom: true,
    };
    
    addStory(newStory);
    setCurrentStory(newStory);
    
    toast({
      title: "Story created!",
      description: "Your story has been successfully added.",
    });
    
    navigate(`/story/${newStory.id}`);
  };

  const generateRandomStory = () => {
    setIsGenerating(true);
    // Here you would connect to an API for story generation
    // For now, we'll just simulate it
    
    setTimeout(() => {
      const storyTitles = [
        "The Adventure of the Magic Key",
        "Whispers in the Woodland",
        "Starlight Dreams",
        "The Rainbow Dragon",
        "Journey to the Cloud Kingdom"
      ];
      
      const storyStarters = [
        "Once upon a time in a land filled with wonder and magic, a young explorer discovered a hidden path that nobody had noticed before...",
        "In the heart of the Whispering Woods lived a family of talking animals who kept a very important secret...",
        "When the stars began to disappear from the night sky, only one brave child noticed and decided to find out why...",
        "The old treasure map had been in the family for generations, but nobody believed it was real until that rainy afternoon...",
        "The tiny door appeared in the garden overnight, and curious little footprints led right to it..."
      ];
      
      setTitle(storyTitles[Math.floor(Math.random() * storyTitles.length)]);
      setContent(storyStarters[Math.floor(Math.random() * storyStarters.length)]);
      setIsGenerating(false);
      
      toast({
        title: "Story generated!",
        description: "We've created a story starter for you to continue.",
      });
    }, 1500);
  };

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-8 text-center">Create Your Story</h1>
      
      <div className="story-card bg-white mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Story Title</Label>
            <Input
              id="title"
              placeholder="Enter a title for your story..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="theme">Choose a Theme</Label>
            <Select 
              value={theme} 
              onValueChange={(value) => setTheme(value as StoryTheme)}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="fantasy">Fantasy</SelectItem>
                <SelectItem value="mystery">Mystery</SelectItem>
                <SelectItem value="animals">Animals</SelectItem>
                <SelectItem value="friendship">Friendship</SelectItem>
                <SelectItem value="space">Space</SelectItem>
                <SelectItem value="random">Random</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Story Content</Label>
            <Textarea
              id="content"
              placeholder="Type or paste your story here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="rounded-xl min-h-[200px]"
              required
            />
          </div>
          
          <div className="flex flex-wrap justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={generateRandomStory}
              disabled={isGenerating}
              className="rounded-full flex items-center gap-2"
            >
              <Book className="h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate Story Starter'}
            </Button>
            
            <Button 
              type="submit"
              className="rounded-full flex items-center gap-2 bg-primary hover:bg-primary/90"
            >
              <BookOpen className="h-4 w-4" />
              Create Story
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-4">
          Need inspiration? Click the "Generate Story Starter" button for a creative prompt.
        </p>
        <p className="text-sm text-gray-500">
          Voice reading will be available after you create your story.
        </p>
      </div>
    </div>
  );
};

export default StoryInput;
