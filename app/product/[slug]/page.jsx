// app/product/[slug]/page.jsx
'use client';

import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { client, urlFor } from '../../../lib/sanity/client';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useCartContext } from '../../../context/StateContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from '../../../components/Seo'
gsap.registerPlugin(ScrollTrigger);

// Lazy load the lightbox components that aren't needed immediately
const LightboxImage = lazy(() => import('next/image'));

const portableTextComponents = {
    block: {
        normal: ({ children }) => <p className="mb-4 leading-relaxed text-black">{children}</p>,
        h2: ({ children }) => <h2 className="mb-4 text-2xl font-semibold text-black">{children}</h2>,
        h3: ({ children }) => <h3 className="mb-3 text-xl font-semibold text-black">{children}</h3>,
    },
    list: {
        bullet: ({ children }) => <ul className="pl-6 mb-4 space-y-2 list-disc text-black">{children}</ul>,
        number: ({ children }) => <ol className="pl-6 mb-4 space-y-2 list-decimal text-black">{children}</ol>,
    },
    listItem: {
        bullet: ({ children }) => <li className="leading-relaxed text-black">{children}</li>,
        number: ({ children }) => <li className="leading-relaxed text-black">{children}</li>,
    },
    marks: {
        strong: ({ children }) => <strong className="font-semibold text-black">{children}</strong>,
    },
};

// Image component with lazy loading
const LazyImage = ({ src, alt, className, sizes, onClick }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsLoaded(true);
                        observer.disconnect();
                    }
                });
            },
            { rootMargin: '50px' }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={imgRef} className={`relative w-full h-full ${className || ''}`}>
            {isLoaded ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-300"
                    sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                    loading="lazy"
                    onClick={onClick}
                />
            ) : (
                <div className="absolute inset-0 bg-gray-800/50 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-yellow-500 rounded-full border-t-transparent animate-spin" />
                </div>
            )}
        </div>
    );
};

export default function ProductDetails() {
    const params = useParams();
    const slug = params?.slug;

    const { 
        show: isModalOpen, 
        index: currentIndex, 
        openImg: openModal, 
        closeImg: closeModal 
    } = useCartContext();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [loadedImages, setLoadedImages] = useState({});

    const infoRef = useRef(null);
    const imagesRef = useRef(null);
    const featureItemsRef = useRef([]);

    // Navigation functions for lightbox
    const handlePrevImage = (totalImages) => {
        if (totalImages && totalImages > 0) {
            const newIndex = (currentIndex - 1 + totalImages) % totalImages;
            openModal(newIndex);
        }
    };

    const handleNextImage = (totalImages) => {
        if (totalImages && totalImages > 0) {
            const newIndex = (currentIndex + 1) % totalImages;
            openModal(newIndex);
        }
    };

    // Mark image as loaded
    const handleImageLoad = (index) => {
        setLoadedImages(prev => ({ ...prev, [index]: true }));
    };

    // Fetch product
    useEffect(() => {
        if (!slug) {
            setError('Товар не найден');
            setLoading(false);
            return;
        }

        async function fetchProduct() {
            try {
                setLoading(true);
                const data = await client.fetch(
                    `*[_type == "product" && slug.current == $slug][0] {
                        name,
                        description,
                        details,
                        specifications,
                        features,
                        "images": image[].asset->url,
                        slug
                    }`,
                    { slug }
                );

                if (!data) {
                    setError('Товар не найден');
                } else {
                    setProduct(data);
                    document.title = `${data.name} — Эполет`;
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [slug]);

    // GSAP Animations
    useEffect(() => {
        if (loading || !product) return;

        const timer = setTimeout(() => {
            const ctx = gsap.context(() => {
                if (infoRef.current) {
                    gsap.fromTo(infoRef.current, 
                        { opacity: 0, y: 30 }, 
                        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
                    );
                }

                if (imagesRef.current) {
                    gsap.fromTo(imagesRef.current, 
                        { opacity: 0, x: -30 }, 
                        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.2 }
                    );
                }

                const validFeatureItems = featureItemsRef.current.filter(item => item);
                if (validFeatureItems.length > 0) {
                    gsap.fromTo(validFeatureItems,
                        { opacity: 0, x: -20 },
                        { 
                            opacity: 1, 
                            x: 0, 
                            stagger: 0.08, 
                            duration: 0.6, 
                            ease: "power2.out", 
                            delay: 0.4 
                        }
                    );
                }
            });

            return () => ctx.revert();
        }, 100);

        return () => clearTimeout(timer);
    }, [product, loading]);

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border-4 rounded-full border-t-transparent border-yellow-500 animate-spin" />
                    {/* <p className="text-xl text-white">Загрузка товара...</p> */}
                </div>
            </div>
        );
    }

    // Error state
    if (error || !product) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="max-w-md px-6 text-center">
                    <p className="mb-4 text-2xl text-red-500">{error || 'Товар не найден'}</p>
                    <a href="/catalog" className="inline-block px-8 py-3 font-medium text-black bg-yellow-500 rounded-xl hover:bg-yellow-400 transition-colors">
                        Вернуться в каталог
                    </a>
                </div>
            </div>
        );
    }

    const { name, description, details, specifications, features, images = [] } = product;
    const hasImages = images && images.length > 0;

    return (
        <div className="min-h-screen bg-black pt-20">
             <SEO 
        title={product.name}
        description={product.description || `Купить ${product.name} от производителя Эполет. Высокое качество, доступные цены.`}
        image={product.images?.[0]}
        type="product"
      />
            <div className="px-4 mx-auto sm:px-6 lg:px-8">
                {/* Back Link */}
                <a 
                    href="/catalog" 
                    className="inline-flex items-center gap-2 mb-6 text-sm text-white/70 transition-colors hover:text-yellow-500 group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> 
                    Назад в каталог
                </a>

                {/* Desktop Layout - 50/50 Split */}
                <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16">
                    {/* Left Side - Image Thumbnails Grid */}
                    <div ref={imagesRef} className="space-y-4">
                        {hasImages ? (
                            <div className="grid grid-cols-4 gap-3">
                                {images.map((imgUrl, i) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            setSelectedImage(i);
                                            openModal(i);
                                        }}
                                        className="relative overflow-hidden cursor-pointer group aspect-square rounded-xl bg-gray-800/50 border border-gray-700 hover:border-yellow-500/50 transition-all"
                                    >
                                        {!loadedImages[i] && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
                                                <div className="w-6 h-6 border-2 border-yellow-500 rounded-full border-t-transparent animate-spin" />
                                            </div>
                                        )}
                                        <Image
                                            src={imgUrl}
                                            alt={`${name} - фото ${i + 1}`}
                                            fill
                                            className={`object-cover transition-transform duration-300 group-hover:scale-110 ${
                                                loadedImages[i] ? 'opacity-100' : 'opacity-0'
                                            }`}
                                            sizes="(max-width: 1024px) 20vw, 10vw"
                                            loading="lazy"
                                            onLoad={() => handleImageLoad(i)}
                                            onError={() => handleImageLoad(i)}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 bg-black/50 group-hover:opacity-100">
                                            <ZoomIn className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center aspect-square rounded-2xl bg-gray-800/50">
                                <p className="text-gray-400">Нет изображений</p>
                            </div>
                        )}
                    </div>

                    {/* Right Side - Text Content with Yellow Gradient */}
                    <div 
                        ref={infoRef}
                        className="p-8 rounded-2xl"
                        style={{
                            background: 'linear-gradient(135deg, #FDB813 0%, #F59E0B 50%, #FBBF24 100%)'
                        }}
                    >
                        <div className="space-y-6">
                            <h1 className="text-3xl font-bold text-black md:text-4xl lg:text-5xl">
                                {name}
                            </h1>
                            
                            {description && (
                                <p className="text-lg text-black">
                                    {description}
                                </p>
                            )}

                            {/* Details with PortableText */}
                            {details && (
                                <div className="prose prose-lg max-w-none text-black">
                                    <PortableText value={details} components={portableTextComponents} />
                                </div>
                            )}

                            {/* Features */}
                            {features?.length > 0 && (
                                <div className="pt-4">
                                    <h3 className="mb-4 text-xl font-semibold text-black">Ключевые особенности</h3>
                                    <ul className="space-y-3">
                                        {features.map((feature, idx) => (
                                            <li 
                                                key={idx} 
                                                ref={el => featureItemsRef.current[idx] = el}
                                                className="feature-item flex gap-3 text-black"
                                            >
                                                <span className="text-black text-lg">•</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Specifications Table */}
                            {specifications && Object.keys(specifications).length > 0 && (
                                <div className="pt-4">
                                    <h3 className="mb-4 text-xl font-semibold text-black">Технические характеристики</h3>
                                    <div className="overflow-hidden rounded-xl bg-black/10">
                                        <div className="divide-y divide-black/20">
                                            {Object.entries(specifications).map(([key, value]) => (
                                                <div key={key} className="flex justify-between p-4 text-sm">
                                                    <span className="font-medium text-black">{key}</span>
                                                    <span className="text-black text-right">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Layout - Text First, Then Images in Column */}
                <div className="lg:hidden space-y-6">
                    {/* Text Section with Yellow Gradient */}
                    <div 
                        className="p-6 rounded-2xl"
                        style={{
                            background: 'linear-gradient(135deg, #FDB813 0%, #F59E0B 50%, #FBBF24 100%)'
                        }}
                    >
                        <div className="space-y-4">
                            <h1 className="text-2xl font-bold text-black sm:text-3xl">
                                {name}
                            </h1>
                            
                            {description && (
                                <p className="text-base text-black">
                                    {description}
                                </p>
                            )}

                            {/* Details */}
                            {details && (
                                <div className="text-black text-sm">
                                    <PortableText value={details} components={portableTextComponents} />
                                </div>
                            )}

                            {/* Features */}
                            {features?.length > 0 && (
                                <div className="pt-2">
                                    <h3 className="mb-3 text-lg font-semibold text-black">Ключевые особенности</h3>
                                    <ul className="space-y-2">
                                        {features.map((feature, idx) => (
                                            <li key={idx} className="flex gap-2 text-black text-sm">
                                                <span className="text-black">•</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Specifications */}
                            {specifications && Object.keys(specifications).length > 0 && (
                                <div className="pt-2">
                                    <h3 className="mb-3 text-lg font-semibold text-black">Технические характеристики</h3>
                                    <div className="overflow-hidden rounded-xl bg-black/10">
                                        <div className="divide-y divide-black/20">
                                            {Object.entries(specifications).map(([key, value]) => (
                                                <div key={key} className="flex justify-between p-3 text-xs">
                                                    <span className="font-medium text-black">{key}</span>
                                                    <span className="text-black text-right">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Images Section - One per row, full width with lazy loading */}
                    <div ref={imagesRef} className="space-y-4">
                        {hasImages ? (
                            images.map((imgUrl, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setSelectedImage(i);
                                        openModal(i);
                                    }}
                                    className="relative overflow-hidden cursor-pointer group aspect-square rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-yellow-500/50 transition-all w-full"
                                >
                                    {!loadedImages[i] && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
                                            <div className="w-8 h-8 border-2 border-yellow-500 rounded-full border-t-transparent animate-spin" />
                                        </div>
                                    )}
                                    <Image
                                        src={imgUrl}
                                        alt={`${name} - фото ${i + 1}`}
                                        fill
                                        className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                                            loadedImages[i] ? 'opacity-100' : 'opacity-0'
                                        }`}
                                        sizes="100vw"
                                        loading="lazy"
                                        onLoad={() => handleImageLoad(i)}
                                        onError={() => handleImageLoad(i)}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 bg-black/50 group-hover:opacity-100">
                                        <ZoomIn className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center aspect-square rounded-2xl bg-gray-800/50">
                                <p className="text-gray-400">Нет изображений</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Image Lightbox with Lazy Loading */}
            <AnimatePresence>
                {isModalOpen && hasImages && images[currentIndex] && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg"
                        onClick={closeModal}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute z-10 p-3 transition-colors rounded-full top-6 right-6 bg-white/10 hover:bg-white/20"
                            aria-label="Закрыть"
                        >
                            <X className="text-white w-7 h-7" />
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); handlePrevImage(images.length); }}
                            className="absolute p-4 transition-colors -translate-y-1/2 rounded-full left-6 top-1/2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Предыдущее фото"
                            disabled={images.length <= 1}
                        >
                            <ChevronLeft className="w-8 h-8 text-white" />
                        </button>

                        <div className="relative w-full max-w-5xl px-4" onClick={(e) => e.stopPropagation()}>
                            <div className="relative w-full aspect-video max-h-[85vh]">
                                <Image
                                    src={images[currentIndex]}
                                    alt={`${name} - фото ${currentIndex + 1}`}
                                    fill
                                    className="object-contain"
                                    priority={false}
                                    sizes="100vw"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); handleNextImage(images.length); }}
                            className="absolute p-4 transition-colors -translate-y-1/2 rounded-full right-6 top-1/2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Следующее фото"
                            disabled={images.length <= 1}
                        >
                            <ChevronRight className="w-8 h-8 text-white" />
                        </button>

                        <div className="absolute text-sm -translate-x-1/2 bottom-8 left-1/2 text-white/70">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}