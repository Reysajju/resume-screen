import React, { useState, useMemo } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Download, Award, ArrowUpDown } from 'lucide-react';
import { FileWithProgress, SortOption } from '../types';

interface ResultsProps {
  files: FileWithProgress[];
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({ files, onReset }) => {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const toggleExpanded = (fileId: string) => {
    setExpandedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'score':
          const scoreA = a.result?.matchScore ? parseInt(a.result.matchScore) : 0;
          const scoreB = b.result?.matchScore ? parseInt(b.result.matchScore) : 0;
          comparison = scoreB - scoreA;
          break;
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'time':
          const timeA = a.uploadTime || 0;
          const timeB = b.uploadTime || 0;
          comparison = timeB - timeA;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [files, sortBy, sortDirection]);

  const getMatchColor = (score: number): string => {
    if (score === 100) return 'text-yellow-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 50) return 'text-green-600';
    return 'text-red-600';
  };

  const getMatchBg = (score: number): string => {
    if (score === 100) return 'bg-yellow-50';
    if (score >= 75) return 'bg-blue-50';
    if (score >= 50) return 'bg-green-50';
    return 'bg-red-50';
  };

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('desc');
    }
  };

  const exportReport = (file: FileWithProgress) => {
    if (!file.result) return;

    const report = `
Resume Analysis Report for ${file.name}

Overall Match Score: ${file.result.matchScore}%

Skills Analysis:
- Matched Skills: ${file.result.skillsMatch.matched.join(', ')}
- Missing Skills: ${file.result.skillsMatch.missing.join(', ')}
- Skills Match Score: ${file.result.skillsMatch.score}%

Experience Match:
- Relevance Score: ${file.result.experienceMatch.relevance}%
- Details: ${file.result.experienceMatch.details}

Education Match:
- Relevance Score: ${file.result.educationMatch.relevance}%
- Details: ${file.result.educationMatch.details}

Technical Qualifications:
- Technical Match Score: ${file.result.technicalMatch.score}%
- Matched Technologies: ${file.result.technicalMatch.matches.join(', ')}
- Technology Gaps: ${file.result.technicalMatch.gaps.join(', ')}

Suggestions for Improvement:
${file.result.suggestions.map(s => '- ' + s).join('\n')}

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name}-analysis-report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={onReset}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Upload More Resumes
        </button>

        <div className="flex gap-4">
          <button
            onClick={() => toggleSort('score')}
            className={`flex items-center px-3 py-1 rounded ${
              sortBy === 'score' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'
            }`}
          >
            Score
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </button>
          <button
            onClick={() => toggleSort('name')}
            className={`flex items-center px-3 py-1 rounded ${
              sortBy === 'name' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'
            }`}
          >
            Name
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </button>
          <button
            onClick={() => toggleSort('time')}
            className={`flex items-center px-3 py-1 rounded ${
              sortBy === 'time' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'
            }`}
          >
            Upload Time
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedFiles.map((file, index) => {
          if (!file.result) return null;
          const score = parseInt(file.result.matchScore);
          const isExpanded = expandedFiles.has(file.id);

          return (
            <div
              key={file.id}
              className={`rounded-lg border transition-all duration-300 ${
                isExpanded ? 'shadow-lg' : 'shadow'
              }`}
            >
              <div
                className={`p-4 cursor-pointer ${getMatchBg(score)}`}
                onClick={() => toggleExpanded(file.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <div className={`text-2xl font-bold ${getMatchColor(score)}`}>
                        {score}%
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{file.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(file.uploadTime).toLocaleString()}
                      </p>
                    </div>
                    {score === 100 && (
                      <Award className="w-6 h-6 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportReport(file);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title="Export Report"
                    >
                      <Download className="w-5 h-5 text-gray-600" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 space-y-4 bg-white rounded-b-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Skills Match</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-green-600">
                          Matched: {file.result.skillsMatch.matched.join(', ')}
                        </p>
                        <p className="text-sm text-red-600">
                          Missing: {file.result.skillsMatch.missing.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Experience</h4>
                      <p className="text-sm text-gray-600">
                        {file.result.experienceMatch.details}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Education</h4>
                      <p className="text-sm text-gray-600">
                        {file.result.educationMatch.details}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">
                        Technical Qualifications
                      </h4>
                      <div className="space-y-1">
                        <p className="text-sm text-green-600">
                          Matched: {file.result.technicalMatch.matches.join(', ')}
                        </p>
                        <p className="text-sm text-red-600">
                          Gaps: {file.result.technicalMatch.gaps.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">
                      Suggested Improvements
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {file.result.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};