import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Minimize2, X } from 'lucide-react';
import FeedbackForm from './FeedbackForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const messages = [
  "Apka feedback hamaray liye zaroori hai!",
  "Your opinion matters to us!",
  "Humain batayein, aap kya sochtay hain?",
  "Help us serve you better!"
];

const FeedbackWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    setShowThankYou(true);
    setTimeout(() => {
      setIsOpen(false);
      setShowThankYou(false);
    }, 2000);
  };

  if (isMinimized) {
    return (
      <motion.button
        className="fixed bottom-4 right-4 bg-primary text-primary-foreground rounded-full p-2 shadow-lg cursor-pointer z-50"
        onClick={() => setIsMinimized(false)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>
    );
  }

  return (
    <>
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <motion.div
          className="bg-card border shadow-lg rounded-lg p-4 flex items-center gap-3 cursor-pointer relative"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.02 }}
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(true);
            }}
            className="absolute top-1 right-1 p-1 hover:bg-muted rounded-full"
          >
            <Minimize2 className="h-4 w-4 text-muted-foreground" />
          </button>
          
          <div className="bg-primary/10 rounded-full p-2">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="pr-6"
            >
              <p className="text-sm font-medium">{messages[currentMessage]}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <Minimize2 className="h-4 w-4" />
              <span className="sr-only">Minimize</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {showThankYou ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
                <p className="text-muted-foreground">
                  Your feedback has been submitted successfully.
                </p>
              </motion.div>
            ) : (
              <FeedbackForm onSubmit={handleSubmit} />
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeedbackWidget;