import React from 'react';
import { motion } from 'framer-motion';
import { Check, AlertTriangle, X, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ComparisonItem {
  requirement: string;
  candidateMatch: string;
  matchType: 'perfect' | 'partial' | 'missing';
  details: string;
  score: number;
}

interface CategoryComparison {
  name: string;
  description: string;
  items: ComparisonItem[];
  overallScore: number;
}

interface DetailedComparisonProps {
  jobTitle: string;
  categories: CategoryComparison[];
}

const DetailedComparison: React.FC<DetailedComparisonProps> = ({
  jobTitle,
  categories
}) => {
  const getMatchIcon = (matchType: string) => {
    switch (matchType) {
      case 'perfect':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'partial':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'missing':
        return <X className="h-4 w-4 text-red-500" />;
    }
  };

  const getMatchColor = (matchType: string) => {
    switch (matchType) {
      case 'perfect':
        return 'bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900';
      case 'partial':
        return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-100 dark:border-yellow-900';
      case 'missing':
        return 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900';
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Detailed Requirements Analysis</h2>
        <p className="text-muted-foreground">
          Comprehensive comparison between job requirements and your qualifications for: {jobTitle}
        </p>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span>Perfect Match</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            <span>Partial Match</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span>Missing</span>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {categories.map((category, index) => (
            <AccordionItem key={index} value={`category-${index}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-1 items-center justify-between pr-4">
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground text-left">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Match Score:</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-200 dark:bg-gray-700 w-24 h-2 rounded-full">
                          <div
                            className={`h-full rounded-full ${
                              category.overallScore >= 85
                                ? "bg-green-500"
                                : category.overallScore >= 70
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${category.overallScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-9">
                          {category.overallScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`rounded-lg border p-4 ${getMatchColor(
                        item.matchType
                      )}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            {getMatchIcon(item.matchType)}
                            <h4 className="font-medium">Requirement</h4>
                          </div>
                          <p className="text-sm pl-6">{item.requirement}</p>
                          
                          <div className="flex items-center gap-2 mt-4">
                            <div className="h-4 w-4" /> {/* Spacing for alignment */}
                            <h4 className="font-medium">Your Qualification</h4>
                          </div>
                          <p className="text-sm pl-6">{item.candidateMatch}</p>
                          
                          <div className="mt-4 pl-6">
                            <p className="text-sm text-muted-foreground">
                              {item.details}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-200 dark:bg-gray-700 w-16 h-2 rounded-full">
                            <div
                              className={`h-full rounded-full ${
                                item.score >= 85
                                  ? "bg-green-500"
                                  : item.score >= 70
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-9">
                            {item.score}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </motion.div>
  );
};

export default DetailedComparison;