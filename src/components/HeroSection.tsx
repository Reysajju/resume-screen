
import React from 'react';
import { motion } from 'framer-motion';

// Hero section component that appears at the top of the page
const HeroSection: React.FC = () => {
  // Animation variants for the hero elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div 
      className="py-16 md:py-24 text-center max-w-4xl mx-auto px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6">
        <span className="relative flex h-2 w-2 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        Powered by Artificial Intelligence
      </motion.div>
      
      <motion.h1 
        variants={itemVariants}
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6"
      >
        Your Resume,{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
          Intelligently Analyzed
        </span>
      </motion.h1>
      
      <motion.p 
        variants={itemVariants}
        className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
      >
        Upload your resume and job description to get instant insights on your match score, strengths, and areas for improvement.
      </motion.p>
      
      <motion.div 
        variants={itemVariants}
        className="flex flex-wrap justify-center gap-4"
      >
        <a 
          href="#upload-section" 
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Get Started
        </a>
        <a 
          href="#how-it-works" 
          className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Learn More
        </a>
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;
