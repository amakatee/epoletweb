// components/ProductGridImg.jsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity/client';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';

export default function ProductGridImg({ 
    tapBack, 
    tapForward, 
    image, 
    existingImg, 
    openImg, 
    isLightTheme 
}) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    
    const mainImageRef = useRef(null);
    const zoomIconRef = useRef(null);
    const thumbnailRefs = useRef([]);
    const containerRef = useRef(null);

    if (!image || image.length === 0) {
        return (
            <div className={`flex items-center justify-center h-96 rounded-2xl ${isLightTheme ? 'bg-gray-100' : 'bg-white/5'}`}>
                <p className="text-gray-400">Нет изображений</p>
            </div>
        );
    }

    // Get the current image URL
    const getImageUrl = (img) => {
        if (!img) return null;
        // If img is already a URL string
        if (typeof img === 'string') return img;
        // If img is an asset object with url
        if (img.asset?.url) return img.asset.url;
        // If using urlFor helper
        try {
            return urlFor(img).url();
        } catch (e) {
            console.error('Error getting image URL:', e);
            return null;
        }
    };

    const mainImageUrl = getImageUrl(existingImg || image[selectedIndex]);
    const thumbnails = image.map(img => getImageUrl(img));

    // GSAP Animations
    useEffect(() => {
        if (!mainImageRef.current) return;

        const ctx = gsap.context(() => {
            // Main image entrance animation
            gsap.fromTo(mainImageRef.current,
                {
                    opacity: 0,
                    scale: 0.95
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out"
                }
            );

            // Thumbnail animations
            const validThumbnails = thumbnailRefs.current.filter(thumb => thumb);
            if (validThumbnails.length > 0) {
                gsap.fromTo(validThumbnails,
                    {
                        opacity: 0,
                        y: 20
                    },
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.05,
                        duration: 0.4,
                        ease: "power2.out",
                        delay: 0.2
                    }
                );
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Animate when selected index changes
    useEffect(() => {
        if (!mainImageRef.current) return;

        gsap.fromTo(mainImageRef.current,
            {
                opacity: 0.8,
                scale: 0.98
            },
            {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: "back.out(0.6)"
            }
        );

        // Highlight selected thumbnail
        const selectedThumb = thumbnailRefs.current[selectedIndex];
        if (selectedThumb) {
            gsap.to(selectedThumb, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out",
                yoyo: true,
                repeat: 1
            });
        }
    }, [selectedIndex]);

    // Handle main image hover
    const handleMouseEnter = () => {
        setIsHovering(true);
        if (zoomIconRef.current) {
            gsap.to(zoomIconRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        }
        if (mainImageRef.current) {
            gsap.to(mainImageRef.current, {
                scale: 1.02,
                duration: 0.4,
                ease: "power2.out"
            });
        }
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        if (zoomIconRef.current) {
            gsap.to(zoomIconRef.current, {
                opacity: 0,
                scale: 0.8,
                duration: 0.3,
                ease: "power2.out"
            });
        }
        if (mainImageRef.current) {
            gsap.to(mainImageRef.current, {
                scale: 1,
                duration: 0.4,
                ease: "power2.out"
            });
        }
    };

    // Handle thumbnail click with animation
    const handleThumbnailClick = (idx) => {
        // Animate out current thumbnail highlight
        const currentThumb = thumbnailRefs.current[selectedIndex];
        if (currentThumb) {
            gsap.to(currentThumb, {
                scale: 1,
                duration: 0.2,
                ease: "power2.out"
            });
        }
        
        setSelectedIndex(idx);
        
        // Animate new thumbnail
        const newThumb = thumbnailRefs.current[idx];
        if (newThumb) {
            gsap.to(newThumb, {
                scale: 1.05,
                duration: 0.2,
                ease: "power2.out",
                yoyo: true,
                repeat: 1
            });
        }
    };

    // Navigate previous
    const handlePrevious = () => {
        if (selectedIndex > 0) {
            handleThumbnailClick(selectedIndex - 1);
        } else {
            // Loop to last image
            handleThumbnailClick(thumbnails.length - 1);
        }
    };

    // Navigate next
    const handleNext = () => {
        if (selectedIndex < thumbnails.length - 1) {
            handleThumbnailClick(selectedIndex + 1);
        } else {
            // Loop to first image
            handleThumbnailClick(0);
        }
    };

    return (
        <div ref={containerRef} className="space-y-4">
            {/* Main Image */}
            <div 
                className={`relative overflow-hidden cursor-pointer group rounded-2xl ${isLightTheme ? 'bg-gray-100' : 'bg-white/5'}`}
                onClick={() => openImg(selectedIndex)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {mainImageUrl ? (
                    <div className="relative aspect-square">
                        <Image
                            ref={mainImageRef}
                            src={mainImageUrl}
                            alt="Product image"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                        />
                        
                        {/* Zoom overlay */}
                        <div 
                            ref={zoomIconRef}
                            className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black/50"
                            style={{ opacity: 0 }}
                        >
                            <ZoomIn className="w-8 h-8 text-white" />
                        </div>

                        {/* Navigation arrows - optional */}
                        {thumbnails.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePrevious();
                                    }}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                                >
                                    <ChevronLeft className="w-5 h-5 text-white" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNext();
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                                >
                                    <ChevronRight className="w-5 h-5 text-white" />
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center aspect-square">
                        <p className="text-gray-400">Изображение не загружено</p>
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {thumbnails.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {thumbnails.map((thumb, idx) => (
                        <button
                            key={idx}
                            ref={(el) => (thumbnailRefs.current[idx] = el)}
                            onClick={() => handleThumbnailClick(idx)}
                            className={`relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg transition-all duration-300 ${
                                selectedIndex === idx 
                                    ? 'ring-2 ring-yellow-main ring-offset-2 ring-offset-black' 
                                    : 'opacity-60 hover:opacity-100'
                            }`}
                        >
                            {thumb && (
                                <Image
                                    src={thumb}
                                    alt={`Thumbnail ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Image Counter */}
            {thumbnails.length > 1 && (
                <div className="text-center">
                    <span className="inline-block px-3 py-1 text-xs text-white/60 bg-white/10 rounded-full">
                        {selectedIndex + 1} / {thumbnails.length}
                    </span>
                </div>
            )}
        </div>
    );
}