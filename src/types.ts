export interface AnalysisResponse {
  matchScore: string;
  insights: string;
  skillsMatch: {
    matched: string[];
    missing: string[];
    score: number;
  };
  experienceMatch: {
    relevance: number;
    details: string;
  };
  educationMatch: {
    relevance: number;
    details: string;
  };
  technicalMatch: {
    score: number;
    matches: string[];
    gaps: string[];
  };
  suggestions: string[];
  uploadTime: number;
}

export interface FileWithProgress extends File {
  progress?: number;
  id: string;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  result?: AnalysisResponse;
  uploadTime: number;
  validationStatus?: 'pending' | 'valid' | 'invalid';
  validationMessage?: string;
}

export type SortOption = 'score' | 'name' | 'time';

export interface ValidationError {
  message: string;
  type: 'error' | 'warning';
  field?: string;
}