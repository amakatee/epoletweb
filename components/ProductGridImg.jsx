// components/ProductGridImg.jsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity/client';
import { ZoomIn } from 'lucide-react';

export default function ProductGridImg({ 
    tapBack, 
    tapForward, 
    image, 
    existingImg, 
    openImg, 
    isLightTheme 
}) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    
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

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div 
                className={`relative overflow-hidden cursor-pointer group rounded-2xl ${isLightTheme ? 'bg-gray-100' : 'bg-white/5'}`}
                onClick={() => openImg(selectedIndex)}
            >
                {mainImageUrl ? (
                    <div className="relative aspect-square">
                        <Image
                            src={mainImageUrl}
                            alt="Product image"
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                        />
                        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 bg-black/50 group-hover:opacity-100">
                            <ZoomIn className="w-8 h-8 text-white" />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center aspect-square">
                        <p className="text-gray-400">Изображение не загружено</p>
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {thumbnails.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                    {thumbnails.map((thumb, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={`relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg transition-all ${
                                selectedIndex === idx 
                                    ? 'ring-2 ring-primary-yellow ring-offset-2 ring-offset-black' 
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
        </div>
    );
}