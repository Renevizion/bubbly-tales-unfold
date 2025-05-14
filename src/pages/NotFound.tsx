
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Book } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-bubbly-blue to-white p-4">
      <div className="text-center bubble-container bg-white">
        <div className="inline-block mb-6">
          <div className="rounded-full bg-bubbly-purple p-4 animate-bounce-soft">
            <Book className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Oops!</h1>
        <p className="text-xl text-gray-600 mb-6">We can't find that story page</p>
        <Button asChild className="rounded-full">
          <a href="/">Return to Story Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
