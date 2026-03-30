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
        <div className="mb-12 space-y-6">
          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-4 top-1/2" />
            <input
              type="text"
              placeholder="Поиск продукции..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-4 pl-12 pr-4 text-white placeholder-gray-400 transition-all border border-gray-700 bg-white/5 rounded-2xl focus:outline-none focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/20"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute text-gray-400 transition-colors -translate-y-1/2 right-4 top-1/2 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 transition-colors border border-gray-700 md:hidden bg-white/5 rounded-xl hover:border-primary-yellow"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">Фильтры</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Desktop Categories */}
              <div className="flex-wrap hidden gap-3 md:flex">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-primary-yellow text-black shadow-lg shadow-primary-yellow/25'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {category === 'all' ? 'Все товары' : category}
                  </button>
                ))}
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 p-1 border border-gray-700 bg-white/5 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary-yellow text-black' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary-yellow text-black' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Filter Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border border-gray-700 md:hidden bg-white/5 rounded-xl"
              >
                <div className="p-4 space-y-3">
                  <h3 className="mb-2 text-sm font-medium text-gray-300">Категории</h3>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsFilterOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category ? 'bg-primary-yellow text-black' : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {category === 'all' ? 'Все товары' : category}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-sm text-center text-gray-400">
            Найдено товаров: {filteredProducts.length}
          </div>
        </div>

        {/* Products Section */}
        {filteredProducts.length > 0 ? (
          <div
            ref={productsContainerRef}
            className={viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              : "space-y-6"
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