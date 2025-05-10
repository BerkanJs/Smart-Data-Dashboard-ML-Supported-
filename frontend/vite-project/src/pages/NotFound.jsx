import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedPattern from '../components/AnimatedPattern';

const NotFound = () => {
  return (
    <div className="relative flex flex-col justify-center items-center h-screen bg-base-200 overflow-hidden">
   
      <div className="absolute inset-0 z-0">
        <AnimatedPattern />
      </div>


      <div className="z-10 text-center space-y-6">
        <motion.h1
          className="text-5xl font-bold"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          404 - Page Not Found
        </motion.h1>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
        >
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
