
import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  cachedResultsExist: boolean;
  onShowResultsList: () => void;
  onStartNewAnalysis: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  cachedResultsExist, 
  onShowResultsList, 
  onStartNewAnalysis 
}) => {
  return (
    <header className="border-b sticky top-0 z-10 glassmorphism">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div 
            className="h-8 w-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            R
          </motion.div>
          <span className="font-semibold text-lg">ResumeScore</span>
        </div>
        
        <nav className="flex items-center gap-6">
          <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
            How It Works
          </a>
          {cachedResultsExist && (
            <>
              <button 
                onClick={onShowResultsList}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                My Results
              </button>
              <button
                onClick={onStartNewAnalysis}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                New Analysis
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
