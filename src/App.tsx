import React, { useState } from 'react';
import { Upload, FileText, Briefcase, ArrowRight } from 'lucide-react';
import { ResumeForm } from './components/ResumeForm';
import { Results } from './components/Results';
import { AnalysisResponse } from './types';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResponse | null>(null);

  const handleAnalysis = async (resumeData: string, jobDescription: string) => {
    setIsAnalyzing(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('API key is not configured. Please set VITE_GEMINI_API_KEY in your environment variables.');
      }

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a professional resume analyzer. Analyze this resume against the job description and provide a match score (0-100) and detailed insights. Format your response as follows:
                Score: [number]
                Insights: [detailed analysis]
                
                Resume: ${atob(resumeData)}
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`
        );
      }

      const data = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid API response format');
      }

      const text = data.candidates[0].content.parts[0].text;
      
      // Parse the response to extract score and insights
      const scoreMatch = text.match(/Score:\s*(\d+)/i);
      const insightsMatch = text.match(/Insights:([\s\S]+)(?:Resume:|$)/i);
      
      if (!scoreMatch || !insightsMatch) {
        throw new Error('Unable to parse API response format');
      }

      const matchScore = scoreMatch[1];
      const insights = insightsMatch[1].trim();

      setResults({
        matchScore,
        insights
      });
    } catch (error) {
      console.error('Error calling API:', error);
      let errorMessage = 'An error occurred while analyzing the resume.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Resume Screening
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
          {!results ? (
            <ResumeForm onSubmit={handleAnalysis} isAnalyzing={isAnalyzing} />
          ) : (
            <Results results={results} onReset={() => setResults(null)} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;