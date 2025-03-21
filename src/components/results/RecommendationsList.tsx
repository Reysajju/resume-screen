
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, AlertTriangle } from 'lucide-react';

interface RecommendationsListProps {
  recommendations: string[];
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations }) => {
  return (
    <motion.div 
      className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 border border-blue-100 dark:border-blue-900 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, type: 'spring', stiffness: 300, damping: 24 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
          <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold">Recommendations</h3>
      </div>
      <ul className="space-y-2">
        {recommendations.map((recommendation, index) => (
          <motion.li 
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + (index * 0.1) }}
            className="flex items-start gap-2"
          >
            <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <span>{recommendation}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default RecommendationsList;
