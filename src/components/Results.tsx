import React from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { AnalysisResponse } from '../types';

interface ResultsProps {
  results: AnalysisResponse;
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({ results, onReset }) => {
  const score = parseInt(results.matchScore);
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
          <span className="text-2xl font-bold text-white">{results.matchScore}</span>
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">Match Score</h2>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Key Insights</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 whitespace-pre-line">{results.insights}</p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onReset}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Analyze Another Resume
        </button>
        
        {score >= 70 ? (
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-5 h-5 mr-2" />
            Strong Match
          </div>
        ) : (
          <div className="flex items-center text-red-600">
            <XCircle className="w-5 h-5 mr-2" />
            Low Match
          </div>
        )}
      </div>
    </div>
  );
};