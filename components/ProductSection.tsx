// components/ProductSection.jsx
'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Helper function to extract plain text from Portable Text
 * @param {any} portableText - Portable Text from Sanity
 * @returns {string} Plain text
 */
const getPlainText = (portableText) => {
  if (!portableText) return '';
  if (typeof portableText === 'string') return portableText;
  if (Array.isArray(portableText)) {
    return portableText
      .map(block => {
        if (block._type !== 'block' || !block.children) return '';
        return block.children.map(child => child.text).join('');
      })
      .join(' ');
  }
  return '';
};

/**
 * Product Section Component
 * @param {Object} props
 * @param {Object} props.product - Product data from Sanity
 */
export default function ProductSection({ product }) {
  const { name, details, slug, imageUrl, altImage } = product;
  const cardRef = useRef(null);
  const buttonRef = useRef(null);
  const imageRef = useRef(null);

  if (!slug) return null;

  const productUrl = `/product/${slug}`;
  const plainDetails = getPlainText(details);
  const truncatedDetails = plainDetails.length > 60 
    ? `${plainDetails.substring(0, 60)}...` 
    : plainDetails;

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      // Card entrance animation
      gsap.fromTo(cardRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Image hover animation
      if (imageRef.current) {
        const handleMouseEnter = () => {
          gsap.to(imageRef.current, {
            scale: 1.1,
            duration: 0.4,
            ease: "power2.out"
          });
        };

        const handleMouseLeave = () => {
          gsap.to(imageRef.current, {
            scale: 1,
            duration: 0.4,
            ease: "power2.out"
          });
        };

        const imageElement = imageRef.current;
        imageElement.addEventListener('mouseenter', handleMouseEnter);
        imageElement.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          imageElement.removeEventListener('mouseenter', handleMouseEnter);
          imageElement.removeEventListener('mouseleave', handleMouseLeave);
        };
      }

      // Button hover animation - only scale, keep yellow background
      if (buttonRef.current) {
        const button = buttonRef.current;
        const handleMouseEnter = () => {
          gsap.to(button, {
            scale: 1.05,
            boxShadow: "0 10px 20px rgba(250, 200, 0, 0.4)",
            duration: 0.3,
            ease: "power2.out"
          });
        };

        const handleMouseLeave = () => {
          gsap.to(button, {
            scale: 1,
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
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
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <Link href={productUrl} passHref legacyBehavior>
      <a
        ref={cardRef}
        className="group flex flex-col items-center text-center cursor-pointer bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 w-full"
        style={{ textDecoration: 'none' }}
      >
        {/* Image Container */}
        <div className="w-full aspect-square overflow-hidden rounded-xl mb-5 bg-gray-800">
          {imageUrl ? (
            <img
              ref={imageRef}
              src={imageUrl}
              alt={altImage || name}
              className="w-full h-full object-cover transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500 text-sm">Нет фото</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <h3 className="text-white text-lg font-medium mb-2 group-hover:text-yellow-main transition-colors">
          {name}
        </h3>
        
        {truncatedDetails && (
          <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-4">
            {truncatedDetails}
          </p>
        )}

        {/* Button - Always Yellow with Black Text */}
        <span
          ref={buttonRef}
          className="inline-block px-5 py-2.5 bg-yellow-main text-gray-900 rounded-lg text-sm font-medium shadow-md"
          style={{ backgroundColor: '#FDB813', color: '#1a1a1a' }}
        >
          Подробнее
        </span>
      </a>
    </Link>
  );
}