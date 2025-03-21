
import React from 'react';
import { motion } from 'framer-motion';
import { MatchFactor } from '@/utils/fileUtils';
import { Filter } from 'lucide-react';

interface MatchFactorsListProps {
  matchFactors: MatchFactor[];
}

const MatchFactorsList: React.FC<MatchFactorsListProps> = ({ matchFactors }) => {
  // Sort match factors by importance and score
  const sortedMatchFactors = [...matchFactors].sort((a, b) => {
    const importanceMap = { high: 3, medium: 2, low: 1 };
    const importanceA = importanceMap[a.importance];
    const importanceB = importanceMap[b.importance];
    
    if (importanceA !== importanceB) {
      return importanceB - importanceA;
    }
    
    return b.score - a.score;
  });

  // Function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    return 'bg-amber-500';
  };

  // Function to get importance badge color
  const getImportanceColor = (importance: 'high' | 'medium' | 'low') => {
    switch (importance) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-green-500';
    }
  };

  return (
    <motion.div
      className="grid grid-cols-1 gap-3 mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Job Matching Factors</h3>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm">Sorted by importance</span>
        </div>
      </div>
      
      {sortedMatchFactors.map((factor, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + (index * 0.05) }}
          className="p-4 rounded-lg bg-background border"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${getScoreColor(factor.score)}`}></div>
              <h4 className="font-medium">{factor.name}</h4>
              <span className={`text-xs rounded-full px-2 py-0.5 ${getImportanceColor(factor.importance)} text-white`}>
                {factor.importance}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-gray-200 dark:bg-gray-700 w-32 h-2 rounded-full">
                <div 
                  className={`${getScoreColor(factor.score)} h-full rounded-full`}
                  style={{ width: `${factor.score}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium w-8">{factor.score}%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{factor.details}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MatchFactorsList;
