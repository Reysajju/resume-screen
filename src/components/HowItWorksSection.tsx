
import React from 'react';
import { motion } from 'framer-motion';

const HowItWorksSection: React.FC = () => {
  return (
    <motion.div 
      id="how-it-works"
      className="max-w-4xl mx-auto py-16 px-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-3xl font-bold tracking-tight mb-8">How It Works</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          className="flex flex-col items-center p-6"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-primary font-bold text-xl">1</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Upload Resumes</h3>
          <p className="text-muted-foreground">
            Upload multiple resumes in PDF or DOCX format to analyze in bulk.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center p-6"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-primary font-bold text-xl">2</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Add Job Description</h3>
          <p className="text-muted-foreground">
            Enter the job description to match against your resumes.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center p-6"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-primary font-bold text-xl">3</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Get AI Analysis</h3>
          <p className="text-muted-foreground">
            Receive detailed feedback and match scores for all resumes.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HowItWorksSection;
