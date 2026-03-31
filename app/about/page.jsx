// app/about/page.jsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { client } from '../../lib/sanity/client';
import { FaAnchor } from 'react-icons/fa';
import { AiOutlineCopyrightCircle } from 'react-icons/ai';
import { HiLightBulb } from 'react-icons/hi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeaderSection from '../../components/HeaderSection';
import Link from 'next/link';
import SEO from '../../components/Seo';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  const [bannerData, setBannerData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const cardsRef = useRef([]);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);
  const containerRef = useRef(null);

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

  useEffect(() => {
    if (!containerRef.current || loading) return;

    const ctx = gsap.context(() => {
      // Cards stagger animation
      const validCards = cardsRef.current.filter(card => card);
      if (validCards.length > 0) {
        gsap.fromTo(validCards,
          {
            opacity: 0,
            y: 50,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.15,
            duration: 0.8,
            ease: "back.out(0.7)",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Add hover animations for each card
        validCards.forEach((card) => {
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -10,
              scale: 1.03,
              duration: 0.3,
              ease: "power2.out",
              boxShadow: "0 25px 40px rgba(0,0,0,0.2)"
            });
          });
          
          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
            });
          });
        });
      }

      // Description animation
      if (descriptionRef.current) {
        gsap.fromTo(descriptionRef.current,
          {
            opacity: 0,
            y: 40
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: descriptionRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // CTA Button animation
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          {
            opacity: 0,
            scale: 0.9,
            y: 30
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            delay: 0.5,
            ease: "back.out(0.8)",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Hover animation for CTA button
        const ctaButton = ctaRef.current;
        const handleMouseEnter = () => {
          gsap.to(ctaButton, {
            scale: 1.05,
            boxShadow: "0 15px 30px rgba(251, 176, 64, 0.4)",
            duration: 0.3,
            ease: "power2.out"
          });
        };

        const handleMouseLeave = () => {
          gsap.to(ctaButton, {
            scale: 1,
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            duration: 0.3,
            ease: "power2.out"
          });
        };

        ctaButton.addEventListener('mouseenter', handleMouseEnter);
        ctaButton.addEventListener('mouseleave', handleMouseLeave);
        
        return () => {
          ctaButton.removeEventListener('mouseenter', handleMouseEnter);
          ctaButton.removeEventListener('mouseleave', handleMouseLeave);
        };
      }

    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

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
      title: bannerData?.aboutArray?.[0]?.description || 'Гибкое ценообразование',
      description: 'Индивидуальный подход к каждому клиенту'
    },
    {
      icon: AiOutlineCopyrightCircle,
      title: bannerData?.aboutArray?.[1]?.description || 'Изготовление изделий любой сложности',
      description: 'Современное оборудование и технологии'
    },
    {
      icon: HiLightBulb,
      title: bannerData?.aboutArray?.[2]?.description || 'Гарантия качества 20 лет',
      description: 'Надежность и долговечность продукции'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      
      <SEO 
        title="О компании"
        description="Узнайте больше о компании Эполет. 20 лет опыта в производстве изделий из пенополиуретана. Наши преимущества: гибкое ценообразование, индивидуальный подход, высокое качество."
        image="/ep.png"
        type="website"
      />
   
      <HeaderSection 
        imageURL={bannerData?.imageAbout} 
        mainText={bannerData?.aboutsection || 'О компании'} 
        currentPage={bannerData?.titleAbout || 'О нас'} 
      />

      {/* About Content Section */}
      <div ref={containerRef} className="w-full bg-black about-route-section">
        {/* Features Grid */}
        <div className="w-full px-4 py-12 sm:px-6 md:px-8 sm:py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8 md:gap-10 lg:gap-12">
              {aboutItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={index}
                    ref={el => cardsRef.current[index] = el}
                    className="group cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, #FDB813 0%, #F59E0B 50%, #FBBF24 100%)',
                      borderRadius: '1.5rem',
                      padding: '2rem 1.5rem',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      minHeight: '300px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div className="mb-5 sm:mb-6">
                      <IconComponent 
                        size={48} 
                        className="text-gray-900 transition-transform duration-300 group-hover:scale-110" 
                      />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-gray-900 sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-800 sm:text-base">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Company Description - Only fetched data */}
        {bannerData?.maindetails && (
          <div ref={descriptionRef} className="w-full px-4 pb-12 sm:px-6 md:px-8 sm:pb-16 md:pb-20 lg:pb-24">
            <div className="max-w-4xl mx-auto">
              <div className="relative p-8 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800">
                <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-yellow-main to-yellow-600 rounded-2xl" />
                <p className="relative text-base leading-relaxed text-center text-gray-200 sm:text-lg md:text-xl">
                  {bannerData.maindetails}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="pb-12 text-center sm:pb-16 md:pb-20 lg:pb-24">
  <Link 
    href="/catalog"
    ref={ctaRef}
    className="inline-block px-8 py-3.5 bg-yellow-main text-white-900 font-medium rounded-lg text-base sm:text-lg hover:bg-yellow-400 transition-all duration-300 shadow-md hover:shadow-lg"
  >
    Перейти в каталог
  </Link>
</div>
      </div>
    </div>
  );
}