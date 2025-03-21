import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, AlertCircle, FileText } from 'lucide-react';

interface ResumeFormProps {
  onSubmit: (resumeData: string, jobDescription: string) => Promise<void>;
  isAnalyzing: boolean;
}

interface FileWithProgress extends File {
  progress?: number;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ onSubmit, isAnalyzing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<FileWithProgress | null>(null);
  const [error, setError] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['application/pdf'];

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload a PDF file.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit.';
    }
    return null;
  };

  const handleFile = async (file: File) => {
    setError('');
    setUploadStatus('Validating file...');

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setFile(null);
      setUploadStatus('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const fileWithProgress = new File([file], file.name, {
      type: file.type,
      lastModified: file.lastModified,
    }) as FileWithProgress;
    
    fileWithProgress.progress = 0;
    setFile(fileWithProgress);
    setUploadStatus('Processing file...');

    // Simulate upload progress
    const interval = setInterval(() => {
      setFile(prevFile => {
        if (!prevFile) return null;
        const progress = (prevFile.progress || 0) + 10;
        if (progress >= 100) {
          clearInterval(interval);
          setUploadStatus('File ready');
        }
        const newFile = new File([prevFile], prevFile.name, {
          type: prevFile.type,
          lastModified: prevFile.lastModified,
        }) as FileWithProgress;
        newFile.progress = progress;
        return newFile;
      });
    }, 100);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!file || !(file instanceof File)) {
      setError('Please upload a valid PDF file.');
      return;
    }

    try {
      setUploadStatus('Processing submission...');
      const fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
          const result = reader.result;
          if (typeof result === 'string') {
            const base64Content = result.split(',')[1];
            resolve(base64Content);
          } else {
            reject(new Error('Failed to read file content'));
          }
        };

        reader.onerror = () => {
          reject(new Error('Error reading file'));
        };

        reader.readAsDataURL(file);
      });

      await onSubmit(fileData, jobDescription);
    } catch (error) {
      console.error('Error processing file:', error);
      setError('Error processing file. Please try again.');
      setUploadStatus('');
    }
  };

  const removeFile = () => {
    setFile(null);
    setError('');
    setUploadStatus('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700" id="resume-upload-label">
          Upload Resume (PDF only)
        </label>
        
        {/* Drag and drop zone */}
        <div
          ref={dropZoneRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
            ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}
          `}
          role="button"
          tabIndex={0}
          aria-labelledby="resume-upload-label"
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
            aria-hidden="true"
          />
          
          <Upload className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop your PDF resume here or click to upload
          </p>
          <p className="text-xs text-gray-500">
            Maximum file size: 5MB
          </p>
        </div>

        {/* Upload Status */}
        {uploadStatus && (
          <div className="flex items-center gap-2 text-indigo-600 text-sm mt-2">
            <span>{uploadStatus}</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm mt-2" role="alert">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* File preview */}
        {file && (
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="text-gray-400 hover:text-gray-500"
                aria-label="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress bar */}
            {file.progress !== undefined && file.progress < 100 && (
              <div className="mt-3">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                    role="progressbar"
                    aria-valuenow={file.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {file.progress}% uploaded
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
          Job Description
        </label>
        <textarea
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Paste the job description here..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={isAnalyzing || !file}
        className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-busy={isAnalyzing}
      >
        {isAnalyzing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
            Analyzing...
          </div>
        ) : (
          'Analyze Resume'
        )}
      </button>
    </form>
  );
};