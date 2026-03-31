// components/ProductIcon.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  slug?: string | { current: string };
  coverImageUrl?: string;
  productImageUrl?: string;
  imageUrl?: string;
  image?: string | any[];
  images?: string[];
  coverImg?: { asset?: { url?: string } };
  mainImage?: { asset?: { url?: string } };
  allImages?: string[];
}

interface ProductIconProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  priority?: boolean;
}

export default function ProductIcon({ product, viewMode = 'grid', priority = false }: ProductIconProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLSpanElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Universal image URL getter - handles ALL possible structures
  const getImageUrl = (): string | null => {
    if (!product) return null;
    
    // Check all possible image fields from both queries
    const possibleImageFields = [
      product.coverImageUrl,
      product.productImageUrl,
      product.imageUrl,
      typeof product.image === 'string' ? product.image : null,
      product.coverImg?.asset?.url,
      Array.isArray(product.allImages) && product.allImages[0],
      Array.isArray(product.images) && product.images[0],
      Array.isArray(product.image) && product.image[0]?.asset?.url,
      Array.isArray(product.image) && product.image[0]?.url,
      product.mainImage?.asset?.url,
    ];
    
    // Return the first valid URL
    for (const field of possibleImageFields) {
      if (field && typeof field === 'string' && field.startsWith('http')) {
        return field;
      }
    }
    
    return null;
  };
  
  const imageUrl = getImageUrl();
  const slug = typeof product.slug === 'string' ? product.slug : product.slug?.current;

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      // Card entrance animation
      gsap.fromTo(cardRef.current,
        {
          opacity: 0,
          y: 40,
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
            scale: 1.08,
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
  
  // Handle image loading error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', imageUrl);
    e.currentTarget.style.display = 'none';
    const parent = e.currentTarget.parentElement;
    if (parent) {
      const fallback = document.createElement('div');
      fallback.className = 'flex items-center justify-center w-full h-full bg-gray-800';
      fallback.innerHTML = '<span class="text-gray-400">Нет фото</span>';
      parent.appendChild(fallback);
    }
  };
  
  if (!slug) return null;
  
  if (viewMode === 'list') {
    return (
      <Link href={`/product/${slug}`} className="block w-full">
        <div className="flex gap-6 p-4 transition-all border border-gray-700 rounded-2xl bg-white/5 hover:bg-white/10 hover:border-primary-yellow group w-full">
          <div className="relative flex-shrink-0 w-32 h-32 overflow-hidden rounded-xl">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name || 'Product'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="128px"
                onError={handleImageError}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-800">
                <span className="text-gray-400">Нет фото</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="mb-2 text-xl font-semibold text-white group-hover:text-primary-yellow">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
            )}
            {/* Button for list view - Always Yellow */}
            <span className="inline-block mt-3 px-4 py-1.5 bg-yellow-main text-gray-900 rounded-lg text-xs font-medium shadow-md">
              Подробнее
            </span>
          </div>
        </div>
      </Link>
    );
  }
  
  // Grid view (default) - Full width cards
  return (
    <Link href={`/product/${slug}`} className="block w-full">
      <div
        ref={cardRef}
        className="group cursor-pointer w-full"
      >
        <div className="relative overflow-hidden rounded-2xl bg-white/5 aspect-square w-full">
          {imageUrl ? (
            <Image
              ref={imageRef as any}
              src={imageUrl}
              alt={product.name || 'Product'}
              fill
              className="object-cover transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              priority={priority}
              onError={handleImageError}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <span className="text-gray-400">Нет фото</span>
            </div>
          )}
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-lg font-medium text-white transition-colors group-hover:text-yellow-main">
            {product.name}
          </h3>
          {/* Button under each card - Always Yellow */}
          <span
            ref={buttonRef}
            className="inline-block mt-3 px-5 py-2 bg-yellow-main text-gray-900 rounded-lg text-sm font-medium shadow-md"
            style={{ backgroundColor: '#FDB813', color: '#1a1a1a' }}
          >
            Подробнее
          </span>
        </div>
      </div>
    </Link>
  );
}