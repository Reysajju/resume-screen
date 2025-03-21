
import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface StrengthsWeaknessesProps {
  strengths: string[];
  weaknesses: string[];
}

const StrengthsWeaknesses: React.FC<StrengthsWeaknessesProps> = ({ strengths, weaknesses }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Strengths */}
      <motion.div 
        className="bg-green-50 dark:bg-green-950/20 rounded-lg p-6 border border-green-100 dark:border-green-900"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 24 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold">Strengths</h3>
        </div>
        <ul className="space-y-2">
          {strengths.map((strength, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (index * 0.1) }}
              className="flex items-start gap-2"
            >
              <Check className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <span>{strength}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Weaknesses */}
      <motion.div 
        className="bg-red-50 dark:bg-red-950/20 rounded-lg p-6 border border-red-100 dark:border-red-900"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, type: 'spring', stiffness: 300, damping: 24 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
            <X className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold">Weaknesses</h3>
        </div>
        <ul className="space-y-2">
          {weaknesses.map((weakness, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + (index * 0.1) }}
              className="flex items-start gap-2"
            >
              <X className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
              <span>{weakness}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default StrengthsWeaknesses;
