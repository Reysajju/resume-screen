
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CachedResumeResult, formatFileSize } from '@/utils/fileUtils';
import { FileText, ChevronRight, ChevronDown, Search } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

interface ResumeListProps {
  results: CachedResumeResult[];
  onResultSelect: (result: CachedResumeResult) => void;
}

const ResumeList: React.FC<ResumeListProps> = ({ results, onResultSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredResults = results.filter(
    (result) =>
      result.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.jobDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          className="flex-1"
          placeholder="Search resumes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredResults.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          No resume analysis results found.
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filename</TableHead>
                <TableHead>Match Score</TableHead>
                <TableHead>Date Analyzed</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
                <React.Fragment key={result.id}>
                  <TableRow 
                    className="cursor-pointer hover:bg-muted/60"
                    onClick={() => toggleExpand(result.id)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {result.fileName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className={`h-2.5 w-2.5 rounded-full ${
                            result.result.matchScore >= 85
                              ? "bg-green-500"
                              : result.result.matchScore >= 70
                              ? "bg-blue-500"
                              : "bg-amber-500"
                          }`}
                        />
                        {result.result.matchScore}%
                      </div>
                    </TableCell>
                    <TableCell>{result.dateAnalyzed}</TableCell>
                    <TableCell>
                      {expandedId === result.id ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </TableCell>
                  </TableRow>
                  
                  {/* Expanded details */}
                  {expandedId === result.id && (
                    <TableRow>
                      <TableCell colSpan={4} className="p-0">
                        <div className="p-4 bg-muted/30">
                          <div className="flex justify-between mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                File size: {formatFileSize(result.fileSize)}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Job description: {result.jobDescription.substring(0, 100)}...
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onResultSelect(result);
                              }}
                              className="px-4 py-1 rounded bg-primary text-primary-foreground text-sm"
                            >
                              View Full Analysis
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                              <h4 className="text-sm font-medium mb-1">Strengths:</h4>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {result.result.strengths.slice(0, 2).map((strength, i) => (
                                  <li key={i} className="list-disc ml-4">{strength}</li>
                                ))}
                                {result.result.strengths.length > 2 && <li className="list-disc ml-4">...</li>}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">Weaknesses:</h4>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {result.result.weaknesses.slice(0, 2).map((weakness, i) => (
                                  <li key={i} className="list-disc ml-4">{weakness}</li>
                                ))}
                                {result.result.weaknesses.length > 2 && <li className="list-disc ml-4">...</li>}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </motion.div>
  );
};

export default ResumeList;
