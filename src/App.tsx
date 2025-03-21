import React, { useState } from 'react';
import { Upload, FileText, Briefcase, ArrowRight } from 'lucide-react';
import { ResumeForm } from './components/ResumeForm';
import { Results } from './components/Results';
import { FileWithProgress } from './types';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [files, setFiles] = useState<FileWithProgress[]>([]);

  const handleAnalysis = async (files: FileWithProgress[], jobDescription: string) => {
    setIsAnalyzing(true);
    const apiKey = 'AIzaSyBpfZ8A8UkehG-emI-ujmxfsCunLFyM9Sk';
    const BATCH_SIZE = 3; // Process 3 files at a time
    const DELAY_BETWEEN_BATCHES = 2000; // 2 seconds delay between batches

    try {
      // Process files in batches
      for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batch = files.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map(async (file) => {
            try {
              setFiles((prev) => 
                prev.map((f) => 
                  f.id === file.id ? { ...f, status: 'processing' } : f
                )
              );

              const fileContent = await readFileContent(file);
              
              const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  contents: [{
                    parts: [{
                      text: `You are a professional resume analyzer. Analyze this resume against the job description and provide detailed matching analysis. Format your response in JSON with the following structure:
                        {
                          "matchScore": "number 0-100",
                          "insights": "detailed analysis",
                          "skillsMatch": {
                            "matched": ["skill1", "skill2"],
                            "missing": ["skill3"],
                            "score": "number 0-100"
                          },
                          "experienceMatch": {
                            "relevance": "number 0-100",
                            "details": "string"
                          },
                          "educationMatch": {
                            "relevance": "number 0-100",
                            "details": "string"
                          },
                          "technicalMatch": {
                            "score": "number 0-100",
                            "matches": ["tech1", "tech2"],
                            "gaps": ["tech3"]
                          },
                          "suggestions": ["suggestion1", "suggestion2"]
                        }

                        Resume: ${fileContent}
                        Job Description: ${jobDescription}`
                    }]
                  }],
                  generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                  }
                })
              });

              if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
              }

              const data = await response.json();
              const analysisText = data.candidates[0].content.parts[0].text;
              const analysis = JSON.parse(analysisText);

              setFiles((prev) =>
                prev.map((f) =>
                  f.id === file.id
                    ? { ...f, status: 'complete', result: analysis }
                    : f
                )
              );
            } catch (error) {
              console.error(`Error processing file ${file.name}:`, error);
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === file.id ? { ...f, status: 'error' } : f
                )
              );
            }
          })
        );

        // Add delay between batches if not the last batch
        if (i + BATCH_SIZE < files.length) {
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }
      }
    } catch (error) {
      console.error('Error in analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const readFileContent = async (file: File): Promise<string> => {
    if (file.type === 'application/pdf') {
      // For PDF files, we'll need to handle them differently in a production environment
      // For now, we'll return a placeholder message
      return `[PDF Content of ${file.name}]`;
    } else {
      // For DOC/DOCX files
      const arrayBuffer = await file.arrayBuffer();
      const result = await window.mammoth.extractRawText({
        arrayBuffer: arrayBuffer
      });
      return result.value;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Resume Matching System
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-600">
            <Upload className="w-5 h-5" />
            <ArrowRight className="w-4 h-4" />
            <FileText className="w-5 h-5" />
            <ArrowRight className="w-4 h-4" />
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
          {files.length === 0 || !files.some(f => f.status === 'complete') ? (
            <ResumeForm 
              onSubmit={handleAnalysis} 
              isAnalyzing={isAnalyzing}
              files={files}
              setFiles={setFiles}
            />
          ) : (
            <Results 
              files={files} 
              onReset={() => setFiles([])} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;