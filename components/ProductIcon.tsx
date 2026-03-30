// components/ProductIcon.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

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
  
  // Handle image loading error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', imageUrl);
    // Hide the image on error
    e.currentTarget.style.display = 'none';
    // You could also show a fallback
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
      <Link href={`/product/${slug}`}>
        <div className="flex gap-6 p-4 transition-all border border-gray-700 rounded-2xl bg-white/5 hover:bg-white/10 hover:border-primary-yellow group">
          <div className="relative flex-shrink-0 w-32 h-32 overflow-hidden rounded-xl">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name || 'Product'}
                fill
                className="object-cover"
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
          </div>
        </div>
      </Link>
    );
  }
  
  // Grid view (default)
  return (
    <Link href={`/product/${slug}`}>
      <div className="group">
        <div className="relative overflow-hidden rounded-2xl bg-white/5 aspect-square">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name || 'Product'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
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
          <h3 className="text-lg font-medium text-white transition-colors group-hover:text-primary-yellow">
            {product.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}