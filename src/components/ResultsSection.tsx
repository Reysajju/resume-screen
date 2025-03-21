import React from 'react';
import { motion } from 'framer-motion';
import { ResumeAnalysisResult } from '@/utils/fileUtils';
import { Gauge, Lightbulb } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MatchScoreDisplay from './results/MatchScoreDisplay';
import MatchFactorsList from './results/MatchFactorsList';
import StrengthsWeaknesses from './results/StrengthsWeaknesses';
import RecommendationsList from './results/RecommendationsList';
import DetailedInsights from './results/DetailedInsights';
import DetailedComparison from './results/DetailedComparison';

interface ResultsSectionProps {
  results: ResumeAnalysisResult;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ results }) => {
  // Mock data for the detailed comparison
  const mockComparisonData = {
    jobTitle: "Senior Software Engineer",
    categories: [
      {
        name: "Education",
        description: "Academic qualifications and certifications",
        overallScore: 85,
        items: [
          {
            requirement: "Bachelor's degree in Computer Science or related field",
            candidateMatch: "Bachelor's degree in Computer Science from Top University",
            matchType: "perfect",
            details: "Your degree exactly matches the requirement",
            score: 100
          },
          {
            requirement: "Professional certifications (AWS, Azure, etc.)",
            candidateMatch: "AWS Certified Solutions Architect",
            matchType: "partial",
            details: "You have AWS certification but missing other cloud certifications",
            score: 70
          }
        ]
      },
      {
        name: "Technical Skills",
        description: "Programming languages, frameworks, and tools",
        overallScore: 90,
        items: [
          {
            requirement: "5+ years experience with React.js",
            candidateMatch: "7 years of React.js development experience",
            matchType: "perfect",
            details: "Your React experience exceeds the requirement",
            score: 100
          },
          {
            requirement: "Experience with Node.js and Express",
            candidateMatch: "3 years Node.js experience, built multiple REST APIs",
            matchType: "perfect",
            details: "Strong backend development experience demonstrated",
            score: 95
          },
          {
            requirement: "GraphQL expertise",
            candidateMatch: "Basic GraphQL knowledge, no production experience",
            matchType: "partial",
            details: "You have basic knowledge but lack production experience",
            score: 60
          }
        ]
      },
      {
        name: "Experience",
        description: "Work history and project experience",
        overallScore: 75,
        items: [
          {
            requirement: "8+ years of software development experience",
            candidateMatch: "6 years of professional development experience",
            matchType: "partial",
            details: "You have solid experience but less than required",
            score: 75
          },
          {
            requirement: "Experience leading development teams",
            candidateMatch: "Led 2 development teams of 5+ developers",
            matchType: "perfect",
            details: "Demonstrated leadership experience matches requirement",
            score: 90
          }
        ]
      },
      {
        name: "Soft Skills",
        description: "Communication, leadership, and teamwork",
        overallScore: 95,
        items: [
          {
            requirement: "Strong communication skills",
            candidateMatch: "Regular presenter at team meetings, wrote technical documentation",
            matchType: "perfect",
            details: "Clear evidence of strong communication abilities",
            score: 95
          },
          {
            requirement: "Ability to work in an Agile environment",
            candidateMatch: "5 years experience in Scrum teams, Certified Scrum Master",
            matchType: "perfect",
            details: "Extensive Agile experience with certification",
            score: 100
          }
        ]
      }
    ]
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 md:p-8 mb-16 rounded-xl bg-card border shadow-sm"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          }
        }
      }}
    >
      <motion.div variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }} className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Resume Analysis Results</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Here's how your resume matches with the job description. Use these insights to improve your application.
        </p>
      </motion.div>

      <MatchScoreDisplay score={results.matchScore} />

      <Tabs defaultValue="match-factors" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="match-factors" className="flex items-center gap-2">
            <Gauge className="h-4 w-4" /> Match Factors
          </TabsTrigger>
          <TabsTrigger value="detailed" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" /> Detailed Analysis
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" /> Recommendations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="match-factors" className="mt-4">
          <MatchFactorsList matchFactors={results.matchFactors} />
        </TabsContent>

        <TabsContent value="detailed" className="mt-4">
          <DetailedComparison {...mockComparisonData} />
        </TabsContent>
        
        <TabsContent value="recommendations" className="mt-4">
          <StrengthsWeaknesses 
            strengths={results.strengths} 
            weaknesses={results.weaknesses} 
          />

          <RecommendationsList recommendations={results.recommendations} />

          <DetailedInsights insights={results.insights} />
        </TabsContent>
      </Tabs>

      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
        className="mt-8 flex justify-center"
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Analyze Another Resume
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ResultsSection;