
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, BookOpen, Headphones, ArrowLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="py-4 px-6 bg-white bg-opacity-90 backdrop-blur-sm shadow-md rounded-b-2xl">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          {!isHome && (
            <Link 
              to="/" 
              className="mr-2 p-2 rounded-full hover:bg-bubbly-purple hover:bg-opacity-20 transition-colors"
              aria-label="Go back home"
            >
              <ArrowLeft className="h-5 w-5 text-primary" />
            </Link>
          )}
          <Link to="/" className="flex items-center gap-2">
            <Book className="h-7 w-7 text-primary animate-bounce-soft" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">StoryBubble</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <div className="w-6 h-0.5 bg-primary mb-1.5 transition-all"></div>
          <div className="w-6 h-0.5 bg-primary mb-1.5 transition-all"></div>
          <div className="w-6 h-0.5 bg-primary transition-all"></div>
        </button>

        {/* Desktop navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <Link 
            to="/" 
            className="font-medium hover:text-primary transition flex items-center gap-1"
          >
            <BookOpen className="h-5 w-5" /> 
            <span>Stories</span>
          </Link>
          <Link 
            to="/history" 
            className="font-medium hover:text-primary transition flex items-center gap-1"
          >
            <Book className="h-5 w-5" /> 
            <span>History</span>
          </Link>
          <Link 
            to="/create" 
            className="font-medium hover:text-primary transition flex items-center gap-1"
          >
            <Headphones className="h-5 w-5" /> 
            <span>Create</span>
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden mt-4 bg-white rounded-xl shadow-lg p-4 absolute left-4 right-4 z-10">
          <div className="flex flex-col gap-4">
            <Link 
              to="/" 
              className="p-2 rounded-lg hover:bg-bubbly-purple hover:bg-opacity-20 transition-all flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <BookOpen className="h-5 w-5 text-primary" /> 
              <span>Stories</span>
            </Link>
            <Link 
              to="/history" 
              className="p-2 rounded-lg hover:bg-bubbly-purple hover:bg-opacity-20 transition-all flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <Book className="h-5 w-5 text-primary" /> 
              <span>History</span>
            </Link>
            <Link 
              to="/create" 
              className="p-2 rounded-lg hover:bg-bubbly-purple hover:bg-opacity-20 transition-all flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <Headphones className="h-5 w-5 text-primary" /> 
              <span>Create</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
