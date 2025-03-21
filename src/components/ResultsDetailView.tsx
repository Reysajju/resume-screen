
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { CachedResumeResult } from '@/utils/fileUtils';
import ResultsSection from './ResultsSection';

interface ResultsDetailViewProps {
  selectedResult: CachedResumeResult;
  onBackToList: () => void;
}

const ResultsDetailView: React.FC<ResultsDetailViewProps> = ({ 
  selectedResult, 
  onBackToList 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        onClick={onBackToList}
        className="mb-4 flex items-center text-sm font-medium hover:text-primary transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to all results
      </button>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{selectedResult.fileName}</h2>
        <p className="text-sm text-muted-foreground">Analyzed on {selectedResult.dateAnalyzed}</p>
      </div>
      
      <ResultsSection results={selectedResult.result} />
    </motion.div>
  );
};

export default ResultsDetailView;
