// components/HeaderSection.jsx
'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { urlFor } from '../lib/sanity/client';
import { BsArrowRight } from 'react-icons/bs';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HeaderSection = ({ imageURL, mainText, currentPage }) => {
    const router = useRouter();
    const headerRef = useRef(null);
    const titleRef = useRef(null);
    const navRef = useRef(null);

    // GSAP Animation for smooth entrance
    useEffect(() => {
        if (!headerRef.current) return;

        const ctx = gsap.context(() => {
            // Title fade-in + slide up
            gsap.fromTo(
                titleRef.current,
                { 
                    opacity: 0, 
                    y: 40 
                },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 1.2, 
                    ease: "power3.out",
                    delay: 0.2
                }
            );

            // Navigation fade-in
            gsap.fromTo(
                navRef.current,
                { 
                    opacity: 0, 
                    y: 20 
                },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.9, 
                    ease: "power2.out",
                    delay: 0.6
                }
            );
        }, headerRef);

        return () => ctx.revert();
    }, [mainText]);

    const handleHomeClick = () => {
        router.push('/');
    };

    // Fallback text if mainText is missing
    const displayText = mainText || currentPage || 'Страница';

    return (
        <div ref={headerRef} className="upper-about-cont relative w-full h-[380px] sm:h-[420px] md:h-[480px] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 upper-img">
                {imageURL ? (
                    <Image
                        src={urlFor(imageURL).url()}
                        alt={displayText}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 1200px"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
                )}
            </div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 upper-overlay bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
                {/* Main Title */}
                <div ref={titleRef} className="mb-6 upper-about-title">
                    <h1 className="text-4xl font-light tracking-wide text-white sm:text-5xl md:text-6xl">
                        {displayText}
                    </h1>
                </div>

                {/* Breadcrumb Navigation */}
                <div ref={navRef} className="flex items-center gap-3 text-sm upper-nav sm:text-base text-white/90">
                    <span 
                        onClick={handleHomeClick}
                        className="transition-colors duration-300 cursor-pointer navSpan hover:text-primary-yellow"
                    >
                        Главная
                    </span>
                    
                    <BsArrowRight className="text-white/70" size={18} />
                    
                    <span className="font-medium navSpan currentLink text-primary-yellow">
                        {displayText}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HeaderSection;