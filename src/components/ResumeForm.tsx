import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { FileWithProgress, ValidationError } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ResumeFormProps {
  onSubmit: (files: FileWithProgress[], jobDescription: string) => Promise<void>;
  isAnalyzing: boolean;
  files: FileWithProgress[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithProgress[]>>;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ 
  onSubmit, 
  isAnalyzing, 
  files, 
  setFiles 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const validateFile = async (file: File): Promise<string | null> => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload PDF, DOC, or DOCX files only.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit.';
    }
    
    // Simulate content validation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if file is not empty
    if (file.size === 0) {
      return 'File appears to be empty.';
    }

    return null;
  };

  const handleFiles = async (newFiles: FileList) => {
    setValidationErrors([]);
    setIsValidating(true);
    
    const fileArray = Array.from(newFiles);
    const validFiles: FileWithProgress[] = [];
    const errors: ValidationError[] = [];

    for (const file of fileArray) {
      const validationError = await validateFile(file);
      
      const fileWithProgress: FileWithProgress = {
        ...file,
        id: uuidv4(),
        progress: 0,
        status: 'uploading',
        uploadTime: Date.now(),
        validationStatus: 'pending'
      };

      if (validationError) {
        errors.push({
          message: `${file.name}: ${validationError}`,
          type: 'error',
          field: 'file'
        });
        fileWithProgress.validationStatus = 'invalid';
        fileWithProgress.validationMessage = validationError;
      } else {
        fileWithProgress.validationStatus = 'valid';
        validFiles.push(fileWithProgress);
      }
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      
      // Simulate upload progress for each file
      validFiles.forEach(file => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress <= 100) {
            setFiles(prev =>
              prev.map(f =>
                f.id === file.id
                  ? { ...f, progress }
                  : f
              )
            );
          }
          if (progress >= 100) {
            clearInterval(interval);
            setFiles(prev =>
              prev.map(f =>
                f.id === file.id
                  ? { ...f, status: 'complete' }
                  : f
              )
            );
          }
        }, 200);
      });
    }
    
    setIsValidating(false);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const validateForm = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (files.length === 0) {
      errors.push({
        message: 'Please upload at least one resume.',
        type: 'error',
        field: 'files'
      });
    }

    if (!jobDescription.trim()) {
      errors.push({
        message: 'Please enter a job description.',
        type: 'error',
        field: 'jobDescription'
      });
    } else if (jobDescription.trim().length < 50) {
      errors.push({
        message: 'Job description seems too short. Please provide more details.',
        type: 'warning',
        field: 'jobDescription'
      });
    }

    // Check if all files are properly uploaded
    const incompleteFiles = files.filter(f => f.status !== 'complete');
    if (incompleteFiles.length > 0) {
      errors.push({
        message: 'Please wait for all files to finish uploading.',
        type: 'error',
        field: 'files'
      });
    }

    // Check for invalid files
    const invalidFiles = files.filter(f => f.validationStatus === 'invalid');
    if (invalidFiles.length > 0) {
      errors.push({
        message: 'Some files failed validation. Please remove them and try again.',
        type: 'error',
        field: 'files'
      });
    }

    return errors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const errors = validateForm();
    setValidationErrors(errors);

    if (errors.length > 0) {
      // Only block submission for error type validations
      if (errors.some(e => e.type === 'error')) {
        return;
      }
    }

    try {
      await onSubmit(files, jobDescription);
    } catch (error) {
      console.error('Error processing files:', error);
      setValidationErrors([{
        message: 'Error processing files. Please try again.',
        type: 'error'
      }]);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setValidationErrors([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Upload Resumes (PDF, DOC, or DOCX)
        </label>
        
        <div
          ref={dropZoneRef}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
            ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}
            ${isValidating ? 'opacity-50' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            multiple
            className="hidden"
            disabled={isValidating}
          />
          
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isValidating ? 'Validating files...' : 'Drag and drop your resumes here or click to upload'}
          </p>
          <p className="text-xs text-gray-500">
            Maximum file size: 5MB per file
          </p>
        </div>

        {validationErrors.length > 0 && (
          <div className="space-y-2">
            {validationErrors.map((error, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-2 text-sm ${
                  error.type === 'error' ? 'text-red-600' : 'text-yellow-600'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>{error.message}</span>
              </div>
            ))}
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-4 space-y-4">
            {files.map((file) => (
              <div
                key={file.id}
                className={`bg-gray-50 rounded-lg p-4 ${
                  file.validationStatus === 'invalid' ? 'border-red-300 border' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        {file.validationStatus === 'valid' && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {new Date(file.uploadTime).toLocaleString()}
                      </p>
                      {file.validationMessage && (
                        <p className="text-xs text-red-500 mt-1">{file.validationMessage}</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {file.progress !== undefined && file.progress < 100 && (
                  <div className="mt-3">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {file.progress}% uploaded
                    </span>
                  </div>
                )}
              </div>
            ))}
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
          className={`w-full h-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
            validationErrors.some(e => e.field === 'jobDescription')
              ? 'border-red-300'
              : 'border-gray-300'
          }`}
          placeholder="Paste the job description here..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={isAnalyzing || isValidating || files.length === 0}
        className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
            Analyzing Resumes...
          </div>
        ) : isValidating ? (
          'Validating Files...'
        ) : (
          'Analyze Resumes'
        )}
      </button>
    </form>
  );
};