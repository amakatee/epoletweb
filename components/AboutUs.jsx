// components/AboutUs.jsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaAnchor } from 'react-icons/fa';
import { AiOutlineCopyrightCircle } from 'react-icons/ai';
import { HiLightBulb } from 'react-icons/hi';

const AboutUs = ({ aboutBanner }) => {
  const router = useRouter();

  // Default content if no banner data
  const mainDetails = aboutBanner?.maindetails || 'Компания Эполет специализируется на производстве изделий из мягкого, жесткого и интегрального пенополиуретана. Мы предлагаем высококачественную продукцию для различных отраслей промышленности и бытового использования.';
  const buttonText = aboutBanner?.aboutsection || 'Подробнее о компании';

  const features = [
    { 
      icon: FaAnchor, 
      title: aboutBanner?.aboutArray?.[0]?.description || 'Гибкое ценообразование',
    },
    { 
      icon: AiOutlineCopyrightCircle, 
      title: aboutBanner?.aboutArray?.[1]?.description || 'Изготовление изделий любой сложности',
    },
    { 
      icon: HiLightBulb, 
      title: aboutBanner?.aboutArray?.[2]?.description || 'Гарантия качества 20 лет',
    }
  ];

  const handleAboutClick = () => {
    router.push('/about');
  };

  return (
    <section className="relative w-full py-16 overflow-hidden about-section bg-gradient-to-r from-yellow-400 to-yellow-500 md:py-20 lg:py-24">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
          {/* Logo Section */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <h1 className="text-3xl font-light leading-tight sm:text-4xl md:text-5xl text-main-dark">
              Компания <br />
              <span className="font-bold text-white">Эполет</span>
            </h1>
            <div className="w-20 h-1 mx-auto mt-4 bg-white rounded-full lg:mx-0" />
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex-1 text-center lg:text-left"
          >
            <p className="mb-6 text-base leading-relaxed text-main-dark sm:text-lg">
              {mainDetails}
            </p>
            
            <button
              onClick={handleAboutClick}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-main-dark text-white rounded-lg font-medium text-sm sm:text-base hover:bg-black transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              {buttonText}
            </button>
          </motion.div>
        </div>

        {/* Features Grid - Preview only, not full details */}
        {/* <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-5 mt-12 sm:grid-cols-2 lg:grid-cols-3 md:gap-6 md:mt-16"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-6 text-center transition-all duration-300 shadow-lg bg-white/95 rounded-2xl hover:shadow-xl"
              >
                <div className="flex items-center justify-center mx-auto mb-4 rounded-full w-14 h-14 bg-yellow-500/20">
                  <IconComponent size={32} className="text-yellow-600" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-main-dark sm:text-lg">
                  {feature.title}
                </h3>
              </motion.div>
            );
          })}
        </motion.div> */}
      </div>
    </section>
  );
};

export default AboutUs;