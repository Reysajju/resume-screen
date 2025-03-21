
import React from 'react';
import { motion } from 'framer-motion';
import { CachedResumeResult } from '@/utils/fileUtils';
import ResumeList from './ResumeList';

interface ResultsListViewProps {
  results: CachedResumeResult[];
  onResultSelect: (result: CachedResumeResult) => void;
  onNewAnalysis: () => void;
}

const ResultsListView: React.FC<ResultsListViewProps> = ({ 
  results, 
  onResultSelect, 
  onNewAnalysis 
}) => {
  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 md:p-8 mb-16 rounded-xl bg-card border shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Resume Analysis Results</h2>
        <button
          onClick={onNewAnalysis}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm"
        >
          New Analysis
        </button>
      </div>
      
      <ResumeList 
        results={results} 
        onResultSelect={onResultSelect} 
      />
    </motion.div>
  );
};

export default ResultsListView;
