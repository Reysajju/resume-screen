
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { CachedResumeResult } from '@/utils/fileUtils';
import HeroSection from './HeroSection';
import UploadSection from './UploadSection';
import HowItWorksSection from './HowItWorksSection';
import ResultsListView from './ResultsListView';
import ResultsDetailView from './ResultsDetailView';

interface MainContentProps {
  currentView: 'upload' | 'list' | 'details';
  isAnalyzing: boolean;
  cachedResults: CachedResumeResult[];
  selectedResult: CachedResumeResult | null;
  onSubmit: (resumeFiles: File[], jobDescription: string) => Promise<void>;
  onResultSelect: (result: CachedResumeResult) => void;
  onBackToList: () => void;
  onNewAnalysis: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  currentView,
  isAnalyzing,
  cachedResults,
  selectedResult,
  onSubmit,
  onResultSelect,
  onBackToList,
  onNewAnalysis,
}) => {
  return (
    <main className="container pt-8 pb-16">
      {/* Only show hero on upload view */}
      {currentView === 'upload' && <HeroSection />}
      
      {/* How It Works Section - only on upload view */}
      {currentView === 'upload' && <HowItWorksSection />}
      
      {/* View upload form, results list, or detailed results based on current view */}
      <AnimatePresence mode="wait">
        {currentView === 'upload' && (
          <UploadSection 
            key="upload" 
            onSubmit={onSubmit} 
            isAnalyzing={isAnalyzing} 
          />
        )}

        {currentView === 'list' && (
          <ResultsListView 
            key="list"
            results={cachedResults}
            onResultSelect={onResultSelect}
            onNewAnalysis={onNewAnalysis}
          />
        )}

        {currentView === 'details' && selectedResult && (
          <ResultsDetailView
            key="details"
            selectedResult={selectedResult}
            onBackToList={onBackToList}
          />
        )}
      </AnimatePresence>
    </main>
  );
};

export default MainContent;
