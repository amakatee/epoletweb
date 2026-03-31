// components/AboutUs.jsx
'use client';

import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaAnchor } from 'react-icons/fa';
import { AiOutlineCopyrightCircle } from 'react-icons/ai';
import { HiLightBulb } from 'react-icons/hi';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const AboutUs = ({ aboutBanner }) => {
  const router = useRouter();
  
  const sectionRef = useRef(null);
  const leftSectionRef = useRef(null);
  const rightSectionRef = useRef(null);
  const buttonRef = useRef(null);
  const featuresRef = useRef(null);

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

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Left section animation - slide in from left
      if (leftSectionRef.current) {
        gsap.fromTo(leftSectionRef.current,
          { 
            opacity: 0, 
            x: -50
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: leftSectionRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Right section animation - slide in from right
      if (rightSectionRef.current) {
        gsap.fromTo(rightSectionRef.current,
          { 
            opacity: 0, 
            x: 50
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rightSectionRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Button animation - fade up with scale
      if (buttonRef.current) {
        gsap.fromTo(buttonRef.current,
          { 
            opacity: 0, 
            y: 30,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: 0.4,
            ease: "back.out(0.8)",
            scrollTrigger: {
              trigger: buttonRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Hover animation for button
        const button = buttonRef.current;
        const handleMouseEnter = () => {
          gsap.to(button, {
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            duration: 0.3,
            ease: "power2.out"
          });
        };

        const handleMouseLeave = () => {
          gsap.to(button, {
            scale: 1,
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            duration: 0.3,
            ease: "power2.out"
          });
        };

        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseleave', handleMouseLeave);
        
        return () => {
          button.removeEventListener('mouseenter', handleMouseEnter);
          button.removeEventListener('mouseleave', handleMouseLeave);
        };
      }

      // Features stagger animation
      if (featuresRef.current?.children) {
        const featureItems = Array.from(featuresRef.current.children);
        
        gsap.fromTo(featureItems,
          { 
            opacity: 0, 
            y: 40
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featuresRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Add hover animations for each feature
        featureItems.forEach((item) => {
          item.addEventListener('mouseenter', () => {
            gsap.to(item, {
              y: -5,
              duration: 0.2,
              ease: "power2.out"
            });
          });
          
          item.addEventListener('mouseleave', () => {
            gsap.to(item, {
              y: 0,
              duration: 0.2,
              ease: "power2.out"
            });
          });
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-16 overflow-hidden md:py-20 lg:py-24"
      style={{ background: 'linear-gradient(135deg, #FDB813 0%, #F59E0B 50%, #FBBF24 100%)' }}
    >
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        {/* Main Content - 50/50 Desktop Layout */}
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
          
          {/* Left Side - Logo Section */}
          <div
            ref={leftSectionRef}
            className="w-full lg:w-1/2 text-center lg:text-left"
          >
            <h1 className="text-3xl font-light leading-tight text-gray-900 sm:text-4xl md:text-5xl">
              Компания <br />
              <span className="font-bold text-gray-900">Эполет</span>
            </h1>
            <div className="w-20 h-1 mx-auto mt-4 bg-gray-900 rounded-full lg:mx-0" />
          </div>

          {/* Right Side - Content Section */}
          <div
            ref={rightSectionRef}
            className="w-full lg:w-1/2 text-center lg:text-left"
          >
            <p className="mb-6 text-base leading-relaxed text-gray-800 sm:text-lg">
              {mainDetails}
            </p>
            
            <button
              ref={buttonRef}
              onClick={handleAboutClick}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-900 text-white rounded-lg font-medium text-sm sm:text-base hover:bg-black transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              {buttonText}
            </button>
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default AboutUs;