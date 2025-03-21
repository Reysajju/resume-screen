/**
 * Utility functions for file handling
 */

// Convert file to base64 string
export const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64String = result.split(',')[1]; // Extract the base64 part
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// Get file extension
export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

// Check if file is valid (PDF or DOCX)
export const isValidResumeFile = (file: File): boolean => {
  const extension = getFileExtension(file.name);
  return ['pdf', 'docx'].includes(extension);
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

// File drop handlers
export const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
  e.preventDefault();
  e.stopPropagation();
};

export const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, setActive: (active: boolean) => void): void => {
  e.preventDefault();
  e.stopPropagation();
  setActive(true);
};

export const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, setActive: (active: boolean) => void): void => {
  e.preventDefault();
  e.stopPropagation();
  setActive(false);
};

export const handleDrop = (
  e: React.DragEvent<HTMLDivElement>, 
  setActive: (active: boolean) => void,
  onFilesSelect: (files: File[]) => void
): void => {
  e.preventDefault();
  e.stopPropagation();
  setActive(false);
  
  const droppedFiles = e.dataTransfer.files;
  if (droppedFiles.length > 0) {
    const validFiles: File[] = [];
    
    // Check each file for validity
    for (let i = 0; i < droppedFiles.length; i++) {
      const file = droppedFiles[i];
      if (isValidResumeFile(file)) {
        validFiles.push(file);
      }
    }
    
    if (validFiles.length > 0) {
      onFilesSelect(validFiles);
    } else {
      alert('Please upload PDF or DOCX files only.');
    }
  }
};

// Cache management for resume results
export interface CachedResumeResult {
  id: string;
  fileName: string;
  fileSize: number;
  dateAnalyzed: string;
  jobDescription: string;
  result: ResumeAnalysisResult;
}

export interface MatchFactor {
  name: string;
  score: number;
  details: string;
  importance: 'high' | 'medium' | 'low';
}

export interface ResumeAnalysisResult {
  matchScore: number;
  insights: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  matchFactors: MatchFactor[];
}

// Save results to localStorage
export const saveResultsToCache = (results: CachedResumeResult[]): void => {
  try {
    localStorage.setItem('resumeResults', JSON.stringify(results));
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
};

// Get results from localStorage
export const getResultsFromCache = (): CachedResumeResult[] => {
  try {
    const cached = localStorage.getItem('resumeResults');
    return cached ? JSON.parse(cached) : [];
  } catch (error) {
    console.error('Error retrieving from cache:', error);
    return [];
  }
};

// Add a new result to cache
export const addResultToCache = (result: CachedResumeResult): CachedResumeResult[] => {
  const currentResults = getResultsFromCache();
  const updatedResults = [result, ...currentResults];
  saveResultsToCache(updatedResults);
  return updatedResults;
};

// Generate a unique ID for cached results
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
