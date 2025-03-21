
import React from 'react';
import { motion } from 'framer-motion';

interface MatchScoreDisplayProps {
  score: number;
}

const MatchScoreDisplay: React.FC<MatchScoreDisplayProps> = ({ score }) => {
  // Determine match level based on score
  const getMatchLevel = (score: number) => {
    if (score >= 85) return { text: 'Excellent', color: 'bg-green-500' };
    if (score >= 70) return { text: 'Good', color: 'bg-blue-500' };
    return { text: 'Average', color: 'bg-amber-500' };
  };

  const matchLevel = getMatchLevel(score);

  return (
    <motion.div 
      className="flex flex-col items-center justify-center mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <div className="relative w-40 h-40 mb-4">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="10"
          />
          {/* Progress circle - animated */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={matchLevel.color.replace('bg-', 'text-')}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="282.7"
            initial={{ strokeDashoffset: 282.7 }}
            animate={{ strokeDashoffset: 282.7 * (1 - score / 100) }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            transform="rotate(-90 50 50)"
          />
          {/* Text in the middle */}
          <text
            x="50"
            y="45"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-3xl font-bold"
            fill="currentColor"
          >
            {score}%
          </text>
          <text
            x="50"
            y="65"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm"
            fill="currentColor"
          >
            Match
          </text>
        </svg>
      </div>
      <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${matchLevel.color} text-white`}>
        {matchLevel.text} Match
      </div>
    </motion.div>
  );
};

export default MatchScoreDisplay;
