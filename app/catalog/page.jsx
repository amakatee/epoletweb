// app/katalog/page.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react'; // Make sure React is imported
import { client } from '../../lib/sanity/client';
import ProductIcon from '../../components/ProductIcon';
import HeaderSection from '../../components/HeaderSection';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Grid3x3, List, ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Katalog() {
  const [products, setProducts] = useState([]);
  const [bannerData, setBannerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const productsContainerRef = useRef(null);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [fetchedProducts, fetchedBanner] = await Promise.all([
          client.fetch(`*[_type == "product"] | order(_createdAt desc) {
            _id,
            name,
            description,
            category,
            "slug": slug.current,
            "coverImageUrl": coverImg.asset->url,
            "productImageUrl": image[0].asset->url,
            "allImages": image[].asset->url,
            coverImg,
            image
          }`),
          client.fetch('*[_type == "banner"]')
        ]);

        setProducts(fetchedProducts || []);
        setBannerData(fetchedBanner || []);
      } catch (err) {
        console.error('Failed to fetch catalog data:', err);
        setError('Не удалось загрузить каталог');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Extract unique categories
  useEffect(() => {
    if (products.length) {
      const uniqueCategories = [...new Set(products.map(p => p.category || 'Другое'))];
      setCategories(['all', ...uniqueCategories]);
    }
  }, [products]);

  // Filter logic
  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        (product.category || 'Другое') === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  // GSAP Animation for products
  useEffect(() => {
    if (!filteredProducts.length || !productsContainerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        productsContainerRef.current.children,
        {
          opacity: 0,
          y: 60,
          scale: 0.96
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: {
            amount: 0.4,
            from: "start"
          },
          scrollTrigger: {
            trigger: productsContainerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, productsContainerRef);

    return () => ctx.revert();
  }, [filteredProducts, viewMode]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const katalogBanner = bannerData?.[0] || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">Загрузка каталога...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 bg-black">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Hero Section */}
      <HeaderSection 
        imageURL={katalogBanner?.imageKatalog} 
        mainText={katalogBanner?.titleKatalog || 'Каталог продукции'} 
        currentPage="Каталог"
      />

      <div className="py-12 container-custom md:py-16">
        {/* Search & Filter Bar */}
       

        {/* Products Section */}
        {filteredProducts.length > 0 ? (
          <div
            ref={productsContainerRef}
            className={viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3  gap-15 md:gap-8"
              : "space-y-6 "
            }
          >
            {filteredProducts.map((product, index) => (
              <ProductIcon
                key={product._id}
                product={product}
                viewMode={viewMode}
                priority={index < 4}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="mb-2 text-2xl font-medium text-white">Ничего не найдено</h3>
            <p className="mb-6 text-gray-400">
              Попробуйте изменить параметры поиска или сбросить фильтры
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 font-medium text-black transition-colors bg-primary-yellow rounded-xl hover:bg-yellow-400"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  );
}