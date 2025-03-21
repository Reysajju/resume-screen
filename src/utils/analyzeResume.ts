
/**
 * Utility functions for resume analysis
 */

import { readFileAsBase64, CachedResumeResult, ResumeAnalysisResult, generateUniqueId, MatchFactor } from './fileUtils';
import { toast } from '@/components/ui/use-toast';

// Main function to analyze a resume
export const analyzeResume = async (
  resumeFile: File,
  jobDescription: string
): Promise<ResumeAnalysisResult | null> => {
  try {
    // Convert resume to base64
    const resumeData = await readFileAsBase64(resumeFile);
    
    // Prepare data for API
    const apiData = {
      resume: resumeData,
      jobDescription: jobDescription
    };
    
    // Call the API
    const result = await callResumeAPI(apiData);
    return result;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    toast({
      title: "Analysis Failed",
      description: "There was an error analyzing your resume. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// New function to analyze multiple resumes
export const analyzeMultipleResumes = async (
  resumeFiles: File[],
  jobDescription: string
): Promise<CachedResumeResult[]> => {
  const results: CachedResumeResult[] = [];
  
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' } as const;
  const dateFormatted = new Date().toLocaleDateString('en-US', options);
  
  for (const file of resumeFiles) {
    try {
      const analysisResult = await analyzeResume(file, jobDescription);
      
      if (analysisResult) {
        const cachedResult: CachedResumeResult = {
          id: generateUniqueId(),
          fileName: file.name,
          fileSize: file.size,
          dateAnalyzed: dateFormatted,
          jobDescription: jobDescription,
          result: analysisResult
        };
        
        results.push(cachedResult);
      }
    } catch (error) {
      console.error(`Error analyzing ${file.name}:`, error);
      toast({
        title: `Analysis Failed for ${file.name}`,
        description: "There was an error analyzing this resume.",
        variant: "destructive",
      });
    }
  }
  
  return results;
};

// Call the resume analysis API
const callResumeAPI = async (data: { resume: string; jobDescription: string }): Promise<ResumeAnalysisResult> => {
  // For demonstration, we'll return mock data
  // In a real app, this would make an actual API call
  
  // Mock API call timing
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000)); // Variable delay for multiple files
  
  // Generate a random score between 65 and 95
  const score = Math.floor(Math.random() * 31) + 65;
  
  // Return mock data with some randomized content
  const insights = [
    "The candidate's experience aligns well with the required technical skills.",
    "Strong background in relevant technologies mentioned in the job description.",
    "Previous roles demonstrate similar responsibilities to the position.",
    "Education and certifications are relevant to the required qualifications.",
    "Project experience shows capability to handle similar challenges."
  ];
  
  const strengths = [
    "Technical skills match job requirements",
    "Relevant industry experience",
    "Educational background aligns with position",
    "Demonstrated leadership abilities",
    "Strong problem-solving experience"
  ];
  
  const weaknesses = [
    "Missing specific certification mentioned in job description",
    "Limited experience with one required technology",
    "Resume could highlight achievements more effectively",
    "Gap in employment history",
    "Could better quantify accomplishments"
  ];
  
  const recommendations = [
    "Highlight specific achievements with measurable results",
    "Emphasize experience with key technologies mentioned in the job",
    "Consider adding relevant certifications to strengthen application",
    "Tailor summary statement to better align with job requirements",
    "Add more quantifiable metrics to demonstrate impact"
  ];

  // Generate detailed matching factors
  const matchFactors: MatchFactor[] = [
    {
      name: "Job Location",
      score: Math.floor(Math.random() * 31) + 70,
      details: Math.random() > 0.5 ? "Your location matches the job location" : "Consider highlighting relocation willingness",
      importance: "high"
    },
    {
      name: "Experience",
      score: Math.floor(Math.random() * 41) + 60,
      details: "Your experience level is " + (Math.random() > 0.5 ? "well-aligned" : "slightly below requirements"),
      importance: "high"
    },
    {
      name: "Education",
      score: Math.floor(Math.random() * 31) + 70,
      details: "Your educational background is " + (Math.random() > 0.5 ? "relevant to the position" : "acceptable but could be better aligned"),
      importance: "medium"
    },
    {
      name: "Skills",
      score: Math.floor(Math.random() * 21) + 75,
      details: "You have " + (Math.random() > 0.7 ? "most" : "some") + " of the required technical skills",
      importance: "high"
    },
    {
      name: "Notice Period",
      score: Math.floor(Math.random() * 31) + 70,
      details: "Your availability " + (Math.random() > 0.5 ? "meets" : "may not meet") + " their timeline requirements",
      importance: "medium"
    },
    {
      name: "Summary",
      score: Math.floor(Math.random() * 41) + 60,
      details: "Your resume summary " + (Math.random() > 0.5 ? "highlights relevant experience" : "could be more focused"),
      importance: "medium"
    },
    {
      name: "Language",
      score: Math.floor(Math.random() * 21) + 80,
      details: "Your language proficiency " + (Math.random() > 0.7 ? "matches requirements" : "may need improvement"),
      importance: "medium"
    },
    {
      name: "Availability",
      score: Math.floor(Math.random() * 31) + 70,
      details: "Your work schedule preferences " + (Math.random() > 0.6 ? "align with job requirements" : "may need adjustment"),
      importance: "low"
    },
    {
      name: "Project Experience",
      score: Math.floor(Math.random() * 21) + 75,
      details: "Your projects demonstrate " + (Math.random() > 0.5 ? "relevant experience" : "some applicable skills"),
      importance: "high"
    },
    {
      name: "Certifications",
      score: Math.floor(Math.random() * 41) + 60,
      details: Math.random() > 0.4 ? "You have relevant certifications" : "Consider obtaining industry certifications",
      importance: "low"
    },
    {
      name: "Technical Proficiency",
      score: Math.floor(Math.random() * 21) + 75,
      details: "Your technical skills are " + (Math.random() > 0.6 ? "strong in required areas" : "adequate but could be stronger"),
      importance: "high"
    },
    {
      name: "Team Collaboration",
      score: Math.floor(Math.random() * 31) + 70,
      details: "Your resume " + (Math.random() > 0.5 ? "emphasizes teamwork" : "could highlight collaboration more"),
      importance: "medium"
    },
    {
      name: "Industry Knowledge",
      score: Math.floor(Math.random() * 31) + 65,
      details: "Your industry experience is " + (Math.random() > 0.5 ? "relevant" : "somewhat limited"),
      importance: "medium"
    },
    {
      name: "Problem-Solving",
      score: Math.floor(Math.random() * 21) + 75,
      details: "Your resume " + (Math.random() > 0.6 ? "demonstrates problem-solving abilities" : "could emphasize problem-solving more"),
      importance: "high"
    },
    {
      name: "Cultural Fit",
      score: Math.floor(Math.random() * 41) + 60,
      details: "Your values and work style " + (Math.random() > 0.5 ? "seem aligned with company culture" : "may need more alignment"),
      importance: "medium"
    }
  ];
  
  // Randomly select 3-5 items from each array to add variety
  const getRandomSubset = (arr: string[], min = 3, max = 5) => {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    return arr.sort(() => 0.5 - Math.random()).slice(0, count);
  };
  
  return {
    matchScore: score,
    insights: getRandomSubset(insights),
    strengths: getRandomSubset(strengths),
    weaknesses: getRandomSubset(weaknesses),
    recommendations: getRandomSubset(recommendations),
    matchFactors: matchFactors
  };
  
  /* 
  // Real API implementation would look like this:
  const apiUrl = 'https://api.example.com/analyze-resume';
  const apiKey = 'AIzaSyBpfZ8A8UkehG-emI-ujmxfsCunLFyM9Sk'; // This would be properly secured
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return await response.json();
  */
};
