
import React from 'react';
import { motion } from 'framer-motion';

interface DetailedInsightsProps {
  insights: string[];
}

const DetailedInsights: React.FC<DetailedInsightsProps> = ({ insights }) => {
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.1 }}
    >
      <h3 className="text-xl font-semibold">Detailed Insights</h3>
      {insights.map((insight, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 + (index * 0.1) }}
          className="p-4 rounded-lg bg-background border"
        >
          {insight}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DetailedInsights;
