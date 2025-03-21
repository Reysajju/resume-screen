
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { 
  handleDragOver, 
  handleDragEnter, 
  handleDragLeave, 
  handleDrop, 
  isValidResumeFile,
  formatFileSize
} from '@/utils/fileUtils';

interface UploadSectionProps {
  onSubmit: (resumeFiles: File[], jobDescription: string) => void;
  isAnalyzing: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onSubmit, isAnalyzing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelect = (files: File[]) => {
    const validFiles = files.filter(file => isValidResumeFile(file));
    if (validFiles.length === 0) {
      setError('Please upload PDF or DOCX files only.');
      return;
    }
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
    setError(null);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFilesSelect(files);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length > 0 && jobDescription.trim()) {
      onSubmit(selectedFiles, jobDescription);
    } else {
      if (selectedFiles.length === 0) setError('Please upload at least one resume file.');
      else if (!jobDescription.trim()) setError('Please enter a job description.');
    }
  };

  const placeholderText = `Enter the job description here...

Example:
We are looking for a Software Engineer with experience in React, Node.js, and cloud technologies. The ideal candidate should have at least 3 years of experience building scalable web applications and a strong understanding of modern JavaScript frameworks.

Responsibilities:
- Develop and maintain front-end applications using React
- Work with backend APIs and database systems
- Collaborate with UX/UI designers to implement responsive designs
- Participate in code reviews and contribute to technical architecture

Requirements:
- Strong experience with React, JavaScript, and HTML/CSS
- Knowledge of Node.js and RESTful APIs
- Experience with cloud platforms (AWS, Azure, or GCP)
- Bachelor's degree in Computer Science or equivalent experience`;

  return (
    <motion.div 
      id="upload-section"
      className="max-w-4xl mx-auto p-6 md:p-8 mb-16 rounded-xl bg-card border shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Upload Resumes</h2>
          <p className="text-muted-foreground">
            Drag and drop multiple resume files, or click to browse
          </p>
        </div>

        {/* Drop zone */}
        <div
          className={`drag-area ${dragActive ? 'active' : ''} ${selectedFiles.length > 0 ? 'border-primary/50 bg-primary/5' : ''}`}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, setDragActive)}
          onDragLeave={(e) => handleDragLeave(e, setDragActive)}
          onDrop={(e) => handleDrop(e, setDragActive, handleFilesSelect)}
          onClick={handleButtonClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx"
            className="hidden"
            multiple
          />
          
          <AnimatePresence mode="wait">
            {selectedFiles.length > 0 ? (
              <motion.div
                key="files-selected"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full"
              >
                <div className="flex flex-col items-center gap-2 mb-4">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-7 w-7 text-primary" />
                  </div>
                  <p className="font-medium text-lg">{selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} selected</p>
                </div>
                
                <div className="max-h-60 overflow-y-auto w-full">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-background rounded-md p-2 mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm truncate max-w-[200px]">{file.name}</span>
                        <span className="text-muted-foreground text-xs">{formatFileSize(file.size)}</span>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-destructive hover:bg-destructive/10 p-1 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button
                  type="button"
                  className="mt-4 flex items-center gap-1 text-sm text-primary hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                      fileInputRef.current.click();
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add more files
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="no-file"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center mb-2">
                  <Upload className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="font-medium">Drag & drop your resumes here</p>
                <p className="text-muted-foreground text-sm">Supports multiple PDF or DOCX files</p>
                <p className="mt-2 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow">
                  Browse Files
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <motion.div 
            className="flex items-center gap-2 text-destructive text-sm p-3 rounded-md bg-destructive/10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </motion.div>
        )}

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Job Description</h2>
          <p className="text-muted-foreground">
            Enter the job description to match against your resumes
          </p>
        </div>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder={placeholderText}
          className="w-full min-h-[200px] rounded-md border border-input bg-background px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isAnalyzing}
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Resumes...
              </>
            ) : (
              'Analyze Resumes'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default UploadSection;
