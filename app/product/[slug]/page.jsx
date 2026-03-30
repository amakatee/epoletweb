// app/product/[slug]/page.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { client, urlFor } from '../../../lib/sanity/client';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { useCartContext } from '../../../context/StateContext'; // Changed to useCartContext
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const portableTextComponents = {
    block: {
        normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
        h2: ({ children }) => <h2 className="mb-4 text-2xl font-semibold">{children}</h2>,
        h3: ({ children }) => <h3 className="mb-3 text-xl font-semibold">{children}</h3>,
    },
    list: {
        bullet: ({ children }) => <ul className="pl-6 mb-4 space-y-2 list-disc">{children}</ul>,
        number: ({ children }) => <ol className="pl-6 mb-4 space-y-2 list-decimal">{children}</ol>,
    },
    listItem: {
        bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
        number: ({ children }) => <li className="leading-relaxed">{children}</li>,
    },
    marks: {
        strong: ({ children }) => <strong className="font-semibold text-primary-yellow">{children}</strong>,
    },
};

export default function ProductDetails() {
    const params = useParams();
    const slug = params?.slug;

    // Use the existing context values
    const { 
        show: isModalOpen, 
        index: currentIndex, 
        openImg: openModal, 
        closeImg: closeModal 
    } = useCartContext();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const infoRef = useRef(null);
    const isLightTheme = slug === 'integralnyi-ppu-light';

    // Navigation functions
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
        if (loading || !product || !infoRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(infoRef.current, 
                { opacity: 0, y: 50 }, 
                { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" }
            );

            gsap.fromTo(".feature-item", 
                { opacity: 0, x: -30 }, 
                { opacity: 1, x: 0, stagger: 0.08, duration: 0.7, ease: "power2.out", delay: 0.3 }
            );
        }, infoRef);

        return () => ctx.revert();
    }, [product, loading]);

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border-4 rounded-full border-t-transparent border-primary-yellow animate-spin" />
                    <p className="text-xl text-white">Загрузка товара...</p>
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
                    <a href="/catalog" className="inline-block px-8 py-3 font-medium text-black bg-primary-yellow rounded-xl hover:bg-yellow-400 transition-colors">
                        Вернуться в каталог
                    </a>
                </div>
            </div>
        );
    }

    const { name, description, details, specifications, features, images = [] } = product;
    const hasImages = images && images.length > 0;
    const currentImage = hasImages ? images[currentIndex] : null;

    return (
        <div className={`min-h-screen pt-20 ${isLightTheme ? 'bg-gray-50' : 'bg-gradient-to-b from-gray-900 to-black'}`}>
            <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:py-16">
                {/* Back Link */}
                <a 
                    href="/catalog" 
                    className="inline-flex items-center gap-2 mb-8 text-sm transition-colors hover:text-primary-yellow group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> 
                    Назад в каталог
                </a>

                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* ==================== IMAGE GALLERY ==================== */}
                    <div>
                        <div className="mb-4">
                            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium ${isLightTheme ? 'bg-gray-200 text-gray-700' : 'bg-white/10 text-gray-300'}`}>
                                <CheckCircle className="w-3 h-3" />
                                {isLightTheme ? 'Светлая серия' : 'Основная серия'}
                            </span>
                        </div>

                        {/* Image Grid */}
                        {hasImages ? (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                                {images.slice(0, 4).map((imgUrl, i) => (
                                    <motion.div
                                        key={i}
                                        onClick={() => openModal(i)}
                                        className="relative overflow-hidden transition-all duration-300 cursor-pointer group aspect-square rounded-2xl bg-gray-800/50 border border-white/10 hover:border-primary-yellow/50"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Image
                                            src={imgUrl}
                                            alt={`${name} - фото ${i + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        />
                                        <div className="absolute inset-0 transition-colors bg-black/30 group-hover:bg-black/20" />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <p className="py-12 text-center text-gray-500">Нет изображений для этого товара</p>
                        )}
                        
                        {hasImages && images.length > 4 && (
                            <p className="mt-4 text-sm text-center text-gray-400">
                                + еще {images.length - 4} фото
                            </p>
                        )}
                    </div>

                    {/* ==================== PRODUCT INFORMATION ==================== */}
                    <div ref={infoRef} className={`space-y-8 ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
                        <div>
                            <h1 className="mb-4 text-4xl font-light tracking-tight md:text-5xl">{name}</h1>
                            
                            {description && (
                                <p className="text-lg text-gray-400">{description}</p>
                            )}
                        </div>

                        {/* Details with PortableText */}
                        {details && (
                            <div className={`prose prose-invert max-w-none text-[15px] leading-relaxed ${isLightTheme ? 'prose-gray' : ''}`}>
                                <PortableText value={details} components={portableTextComponents} />
                            </div>
                        )}

                        {/* Features */}
                        {features?.length > 0 && (
                            <div className={`p-7 rounded-3xl ${isLightTheme ? 'bg-gray-100' : 'bg-white/5'} border ${isLightTheme ? 'border-gray-200' : 'border-gray-700'}`}>
                                <h3 className="mb-5 text-xl font-semibold">Ключевые особенности</h3>
                                <ul className="space-y-4">
                                    {features.map((feature, idx) => (
                                        <li key={idx} className="feature-item flex gap-4 text-[15px]">
                                            <CheckCircle className="w-5 h-5 text-primary-yellow mt-0.5 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Specifications Table */}
                        {specifications && Object.keys(specifications).length > 0 && (
                            <div className={`rounded-3xl overflow-hidden border ${isLightTheme ? 'border-gray-200' : 'border-gray-700'}`}>
                                <div className={`p-6 ${isLightTheme ? 'bg-gray-100' : 'bg-white/5'}`}>
                                    <h3 className="text-xl font-semibold">Технические характеристики</h3>
                                </div>
                                <div className={`divide-y ${isLightTheme ? 'divide-gray-200' : 'divide-gray-700'}`}>
                                    {Object.entries(specifications).map(([key, value]) => (
                                        <div key={key} className="flex justify-between p-6 text-sm">
                                            <span className={isLightTheme ? 'text-gray-600' : 'text-gray-400'}>{key}</span>
                                            <span className="font-medium text-right">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact CTA */}
                        <a
                            href="#contact"
                            className="block w-full py-4 text-center font-semibold text-black bg-primary-yellow rounded-2xl hover:bg-yellow-400 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Получить консультацию
                        </a>
                    </div>
                </div>
            </div>

            {/* ==================== IMAGE LIGHTBOX ==================== */}
            <AnimatePresence>
                {isModalOpen && hasImages && currentImage && (
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
                                    src={currentImage}
                                    alt={`${name} - фото ${currentIndex + 1}`}
                                    fill
                                    className="object-contain"
                                    priority
                                    sizes="100vw"
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