
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStory } from '../contexts/StoryContext';
import { Play, Pause, Book, ArrowLeft, ArrowRight, Volume2, VolumeX, AlertTriangle, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from "@/hooks/use-toast";

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second
const WEBHOOK_URL = 'https://primary-production-470e.up.railway.app/webhook-test/6822f3a1-389b-4b18-84c9-95ce2137f30a';

const StoryDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getStoryById, stories, setCurrentStory } = useStory();
  const [isReading, setIsReading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [storyPages, setStoryPages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [webhookError, setWebhookError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const story = id ? getStoryById(id) : null;
  
  useEffect(() => {
    if (story) {
      setCurrentStory(story);
      // Split content into pages (paragraphs)
      const pages = story.content.split('\n\n').filter(p => p.trim() !== '');
      setStoryPages(pages);
    }
  }, [story, setCurrentStory]);

  useEffect(() => {
    // Cleanup audio when component unmounts or when audio URL changes
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
      }
    };
  }, [audioUrl]);

  const sendToWebhook = async (data: any, retries = 0) => {
    try {
      setWebhookError(null);
      console.log(`Sending data to webhook (attempt ${retries + 1}/${MAX_RETRIES + 1}):`, data);
      
      // Format the webhook payload according to the required format
      const webhookPayload = {
        title: data.title || "Story Reading",
        subject: data.action || "read_aloud",
        content: data.text || ""  // Include the text content in the request
      };
      
      console.log('Webhook payload:', webhookPayload);
      
      // Create a controller to handle timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout (increased to allow time for audio processing)
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Check if the response contains audio data
      const contentType = response.headers.get('Content-Type') || '';
      
      if (contentType.includes('audio') || contentType.includes('application/octet-stream')) {
        // Process audio response
        const audioBlob = await response.blob();
        const audioObjectUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioObjectUrl);
        
        console.log('Audio response received and processed');
        
        // Play audio
        if (audioRef.current) {
          audioRef.current.src = audioObjectUrl;
          audioRef.current.play();
        }
        
        return { success: true, hasAudio: true };
      } else {
        // Try to parse JSON response
        try {
          const jsonData = await response.json();
          console.log('Webhook response:', jsonData);
          return { success: true, hasAudio: false, data: jsonData };
        } catch (e) {
          console.log('Response is not JSON, raw response:', await response.text());
          return { success: true, hasAudio: false };
        }
      }
    } catch (error: any) {
      console.error('Error sending to webhook:', error);
      
      // Try again if we haven't exceeded max retries
      if (retries < MAX_RETRIES) {
        toast({
          title: "Retrying webhook",
          description: `Retrying webhook call (${retries + 1}/${MAX_RETRIES})...`,
        });
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return sendToWebhook(data, retries + 1);
      }
      
      const errorMessage = error.message || "Unknown error occurred";
      setWebhookError(`Failed to send to workflow: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  };

  const handleStartReading = async () => {
    try {
      setIsLoading(true);
      
      const currentPageText = storyPages[currentPage];
      const storyTitle = story ? story.title : '';

      toast({
        title: "Generating audio",
        description: "Sending request to workflow...",
      });

      // Send request to your webhook
      const result = await sendToWebhook({
        text: currentPageText,
        title: storyTitle,
        page: currentPage + 1,
        totalPages: storyPages.length,
        action: "read_aloud"
      });
      
      if (result.success) {
        if (result.hasAudio) {
          setIsReading(true);
          toast({
            title: "Audio generated",
            description: "Playing audio response from n8n workflow.",
          });
        } else {
          // No audio in response, but webhook was successful
          toast({
            title: "Request successful",
            description: "Your request was processed, but no audio was returned.",
          });
          // Create a placeholder audio if we didn't get real audio
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          gainNode.gain.value = 0.1; // Very low volume
          oscillator.frequency.value = 440; // A4 note
          oscillator.start();
          
          // Play for 1 second
          setTimeout(() => {
            oscillator.stop();
          }, 1000);
        }
      } else {
        throw new Error('Failed to receive audio from workflow');
      }
    } catch (error: any) {
      console.error('Error getting audio:', error);
      setIsReading(false);
      toast({
        title: "Error",
        description: error.message || "Failed to generate audio. The server returned an error.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopReading = () => {
    setIsReading(false);
    // Stop the audio
    if (audioRef.current) {
      audioRef.current.pause();
    }
    toast({
      title: "Paused",
      description: "Audio playback paused.",
    });
  };

  const nextPage = () => {
    if (currentPage < storyPages.length - 1) {
      // Stop current audio if playing
      if (isReading && audioRef.current) {
        audioRef.current.pause();
        setIsReading(false);
      }
      
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Clear current audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      // Stop current audio if playing
      if (isReading && audioRef.current) {
        audioRef.current.pause();
        setIsReading(false);
      }
      
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Clear current audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
    }
  };

  const navigateToRandomStory = () => {
    // Stop current audio if playing
    if (isReading && audioRef.current) {
      audioRef.current.pause();
      setIsReading(false);
    }
    
    // Clear current audio URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    
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
      {webhookError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{webhookError}</AlertDescription>
        </Alert>
      )}
      
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
              disabled={currentPage === 0 || isLoading}
              className="rounded-full"
              size="icon"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            {isReading ? (
              <Button
                onClick={handleStopReading}
                variant="outline"
                disabled={isLoading}
                className="rounded-full flex items-center gap-2"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Pause</span>
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleStartReading}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 rounded-full flex items-center gap-2"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>
                    {audioUrl ? (
                      <Headphones className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                    <span>Read Aloud</span>
                  </>
                )}
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={nextPage}
              disabled={currentPage === storyPages.length - 1 || isLoading}
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

      {/* Audio element for playing the returned audio */}
      <audio 
        ref={audioRef} 
        style={{ display: 'none' }}
        onEnded={() => setIsReading(false)}
        onError={(e) => {
          console.error('Audio playback error:', e);
          toast({
            title: "Playback Error",
            description: "There was an error playing the audio file.",
            variant: "destructive",
          });
          setIsReading(false);
        }}
      />
    </div>
  );
};

export default StoryDisplay;
