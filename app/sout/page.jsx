// app/sout/page.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import HeaderSection from '../../components/HeaderSection';
import { client } from '../../lib/sanity/client';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Head from 'next/head';

export default function Sout() {
  const [bannerData, setBannerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  const containerRef = useRef(null);
  const pdf1Ref = useRef(null);
  const pdf2Ref = useRef(null);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch banner data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const query = '*[_type == "banner"]';
        const fetchedBanner = await client.fetch(query);
        setBannerData(fetchedBanner || []);
      } catch (err) {
        console.error('Failed to fetch banner data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!containerRef.current || !isClient) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [pdf1Ref.current, pdf2Ref.current],
        {
          opacity: 0,
          y: 50,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => ctx.revert();
  }, [isClient]);

  const soutBanner = bannerData?.[0] || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="text-white">Загрузка...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>СОУТ - Эполет</title>
        <meta name="description" content="Компания Эполет специализируется на производстве изделий из мягкого, жесткого и интегрального пенополиуретана." />
        <link rel="icon" href="/ep.png" type="image/x-icon" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        {/* Hero Section */}
        <HeaderSection 
          imageURL={soutBanner?.imageSout} 
          mainText={soutBanner?.titleSout || 'СОУТ'} 
          currentPage="СОУТ"
        />

        <div ref={containerRef} className="py-12 container-custom md:py-16">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* First PDF Document */}
            <motion.div 
              ref={pdf1Ref}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden border border-gray-700 bg-white/5 rounded-2xl p-6"
            >
              <h2 className="mb-6 text-2xl font-semibold text-center text-white">Сводная ведомость</h2>
              <div className="flex justify-center">
                {isClient && (
                  <iframe
                    src="/assetspdf/svodnaya.pdf"
                    className="w-full h-[500px] rounded-lg"
                    title="Сводная ведомость"
                  />
                )}
              </div>
              <div className="mt-4 text-center">
                <a 
                  href="/assetspdf/svodnaya.pdf" 
                  download
                  className="inline-flex items-center gap-2 px-6 py-2 text-sm text-white transition-colors bg-primary-yellow text-black rounded-lg hover:bg-yellow-400"
                >
                  Скачать PDF
                </a>
              </div>
            </motion.div>

            {/* Second PDF Document */}
            <motion.div 
              ref={pdf2Ref}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="overflow-hidden border border-gray-700 bg-white/5 rounded-2xl p-6"
            >
              <h2 className="mb-6 text-2xl font-semibold text-center text-white">Рекомендации</h2>
              <div className="flex justify-center">
                {isClient && (
                  <iframe
                    src="/assetspdf/recomendation.pdf"
                    className="w-full h-[500px] rounded-lg"
                    title="Рекомендации"
                  />
                )}
              </div>
              <div className="mt-4 text-center">
                <a 
                  href="/assetspdf/recomendation.pdf" 
                  download
                  className="inline-flex items-center gap-2 px-6 py-2 text-sm text-white transition-colors bg-primary-yellow text-black rounded-lg hover:bg-yellow-400"
                >
                  Скачать PDF
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}