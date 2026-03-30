// components/Main.jsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Main Hero Component
 * @param {Object} props
 * @param {Object} props.mainBanner - Banner data from Sanity
 */
const Main = ({ mainBanner }) => {
  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const imageVariants = {
    animate: {
      scale: 1.1,
      transition: {
        duration: 7,
        repeat: Infinity,
        repeatDelay: 0.3,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }
    }
  };

  // Debug: Log the banner data to see what's coming in
  console.log('Main component - mainBanner:', mainBanner);
  console.log('Main component - imageUrl:', mainBanner?.imageUrl);
  console.log('Main component - image field:', mainBanner?.image);

  // Try multiple ways to get the image URL
  let imageUrl = null;
  
  if (mainBanner) {
    // Method 1: Direct imageUrl from query
    if (mainBanner.imageUrl) {
      imageUrl = mainBanner.imageUrl;
      console.log('Using imageUrl:', imageUrl);
    }
    // Method 2: Nested image.asset.url
    else if (mainBanner.image?.asset?.url) {
      imageUrl = mainBanner.image.asset.url;
      console.log('Using image.asset.url:', imageUrl);
    }
    // Method 3: Direct image string
    else if (typeof mainBanner.image === 'string') {
      imageUrl = mainBanner.image;
      console.log('Using string image:', imageUrl);
    }
    // Method 4: Check if image is an object with url
    else if (mainBanner.image?.url) {
      imageUrl = mainBanner.image.url;
      console.log('Using image.url:', imageUrl);
    }
  }

  // Default title and subtitle if not provided
  const title = mainBanner?.title || 'Качественные изделия из ППУ';
  const subtitle = mainBanner?.subtitle || 'Производство изделий из мягкого, жесткого и интегрального пенополиуретана';

  return (
    <div className="relative w-full h-screen overflow-hidden main-page" id="main">
      {/* Background Image with Animation */}
      {imageUrl ? (
        <div className="absolute inset-0 image-container-div">
          <motion.img
            variants={imageVariants}
            animate="animate"
            className="object-cover w-full h-full main-image-cont"
            src={imageUrl}
            alt={title}
            onError={(e) => {
              console.error('Image failed to load:', imageUrl);
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 z-10 main-img-overlay bg-black/50" />
        </div>
      ) : (
        // Fallback gradient background when no image
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute w-64 h-64 rounded-full top-20 left-10 bg-yellow-main/20 blur-3xl animate-pulse" />
            <div className="absolute rounded-full bottom-20 right-10 w-96 h-96 bg-yellow-main/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-main/5 rounded-full blur-3xl" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center sm:px-6 lg:px-8">
        <motion.h1
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-3xl font-light leading-tight tracking-wide text-white sm:text-4xl md:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto mt-4 text-base text-yellow-main sm:text-lg md:text-xl"
        >
          {subtitle}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8"
        >
          <a
            href="/catalog"
            className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-yellow-main text-black rounded-lg font-medium text-sm sm:text-base hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Смотреть продукцию
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute transform -translate-x-1/2 bottom-8 left-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="hidden text-xs text-white/60 sm:block">Прокрутите вниз</span>
            <div className="flex justify-center w-6 h-10 border-2 rounded-full border-white/40">
              <div className="w-1 h-2 mt-2 rounded-full bg-white/60 animate-bounce" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Main;