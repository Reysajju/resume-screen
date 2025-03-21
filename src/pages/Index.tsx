
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MainContent from '@/components/MainContent';
import { analyzeMultipleResumes } from '@/utils/analyzeResume';
import { 
  CachedResumeResult, 
  getResultsFromCache, 
  addResultToCache 
} from '@/utils/fileUtils';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentView, setCurrentView] = useState<'upload' | 'list' | 'details'>('upload');
  const [cachedResults, setCachedResults] = useState<CachedResumeResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<CachedResumeResult | null>(null);
  const { toast } = useToast();

  // Load cached results on component mount
  useEffect(() => {
    const savedResults = getResultsFromCache();
    if (savedResults.length > 0) {
      setCachedResults(savedResults);
      // If we have cached results, show the list view by default
      setCurrentView('list');
    }
  }, []);

  const handleSubmit = async (resumeFiles: File[], jobDescription: string) => {
    setIsAnalyzing(true);
    
    try {
      // Analyze all resumes
      const newResults = await analyzeMultipleResumes(resumeFiles, jobDescription);
      
      if (newResults.length > 0) {
        // Add all new results to cache and update state
        let updatedResults = [...cachedResults];
        for (const result of newResults) {
          updatedResults = addResultToCache(result);
        }
        setCachedResults(updatedResults);
        
        // Show success message
        toast({
          title: "Analysis Complete",
          description: `${newResults.length} resume${newResults.length > 1 ? 's' : ''} analyzed successfully.`,
        });
        
        // Switch to list view
        setCurrentView('list');
      }
    } catch (error) {
      console.error('Error in analysis:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your resumes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResultSelect = (result: CachedResumeResult) => {
    setSelectedResult(result);
    setCurrentView('details');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedResult(null);
  };

  const handleNewAnalysis = () => {
    setCurrentView('upload');
    setSelectedResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cachedResultsExist={cachedResults.length > 0}
        onShowResultsList={() => setCurrentView('list')}
        onStartNewAnalysis={handleNewAnalysis}
      />

      <MainContent 
        currentView={currentView}
        isAnalyzing={isAnalyzing}
        cachedResults={cachedResults}
        selectedResult={selectedResult}
        onSubmit={handleSubmit}
        onResultSelect={handleResultSelect}
        onBackToList={handleBackToList}
        onNewAnalysis={handleNewAnalysis}
      />

      <Footer />
    </div>
  );
};

export default Index;
