// app/about/page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { client } from '../../lib/sanity/client';
import { FaAnchor } from 'react-icons/fa';
import { AiOutlineCopyrightCircle } from 'react-icons/ai';
import { HiLightBulb } from 'react-icons/hi';
import { motion } from 'framer-motion';
import HeaderSection from '../../components/HeaderSection';
import Link from 'next/link';

export default function AboutPage() {
  const [bannerData, setBannerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await client.fetch(`
          *[_type == "banner"][0] {
            titleAbout,
            aboutsection,
            imageAbout,
            maindetails,
            aboutArray[] {
              description
            }
          }
        `);
        setBannerData(data);
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-t-4 rounded-full border-yellow-main animate-spin border-t-transparent"></div>
          <div className="text-white">Загрузка...</div>
        </div>
      </div>
    );
  }

  const aboutItems = [
    {
      icon: FaAnchor,
      title: bannerData?.aboutArray?.[0]?.description || 'Гибкое ценообразование'
    },
    {
      icon: AiOutlineCopyrightCircle,
      title: bannerData?.aboutArray?.[1]?.description || 'Изготовление изделий любой сложности'
    },
    {
      icon: HiLightBulb,
      title: bannerData?.aboutArray?.[2]?.description || 'Гарантия качества 20 лет'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <HeaderSection 
        imageURL={bannerData?.imageAbout} 
        mainText={bannerData?.aboutsection || 'О компании'} 
        currentPage={bannerData?.titleAbout || 'О нас'} 
      />

      {/* About Content Section */}
      <div className="w-full bg-black about-route-section">
        {/* Features Grid */}
        <div className="w-full px-4 py-12 sm:px-6 md:px-8 sm:py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8 md:gap-10 lg:gap-12">
              {aboutItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05, 
                      transition: { duration: 0.3 },
                      y: -5
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="cursor-pointer group"
                    style={{
                      background: 'linear-gradient(315deg, #fbb034 0%, #ffdd00 74%)',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      minHeight: '280px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div className="mb-4 sm:mb-6">
                      <IconComponent 
                        size={40} 
                        className="sm:size-[45px] text-main-dark transition-transform duration-300 group-hover:scale-110" 
                      />
                    </div>
                    <h3 className="px-2 mb-2 text-base font-semibold text-main-dark sm:text-lg md:text-xl sm:mb-3">
                      {item.title}
                    </h3>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Company Description - Only fetched data */}
        {bannerData?.maindetails && (
          <div className="w-full px-4 pb-12 sm:px-6 md:px-8 sm:pb-16 md:pb-20 lg:pb-24">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <p className="text-sm leading-relaxed text-center text-gray-300 sm:text-base md:text-lg">
                  {bannerData.maindetails}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="pb-12 text-center sm:pb-16 md:pb-20 lg:pb-24">
          <Link 
            href="/katalog"
            className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-yellow-main text-black rounded-lg font-medium text-sm sm:text-base hover:bg-yellow-400 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Перейти в каталог
          </Link>
        </div>
      </div>
    </div>
  );
}