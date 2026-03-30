// app/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { client } from '../lib/sanity/client';
import Main from '../components/Main';
import AboutUs from '../components/AboutUs';
import ProductIcon from '../components/ProductIcon';
import LoadingSpinner from '../components/LoadingSpinner';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [bannerData, setBannerData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const productsRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [fetchedBanner, fetchedProducts] = await Promise.all([
          client.fetch(`
            *[_type == "banner"][0] {
              title,
              subtitle,
              maindetails,
              aboutsection,
              "imageUrl": image.asset->url,
              aboutArray[] {
                title,
                description
              }
            }
          `),
          client.fetch(`
            *[_type == "product"] | order(_createdAt desc)[0...8] {
              _id,
              name,
              description,
              details,
              category,
              "slug": slug.current,
              "coverImageUrl": coverImg.asset->url,
              "productImageUrl": image[0].asset->url,
              "allImages": image[].asset->url,
              coverImg,
              image
            }
          `)
        ]);
        
        setBannerData(fetchedBanner);
        setProducts(fetchedProducts || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // GSAP Animation
  useEffect(() => {
    if (!products.length || !productsRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        productsRef.current.children,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: { amount: 0.4, from: "start" },
          scrollTrigger: {
            trigger: productsRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, productsRef);

    return () => ctx.revert();
  }, [products]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <p className="mb-4 text-lg text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 font-medium text-black transition-all rounded-lg bg-yellow-main hover:bg-yellow-600"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="relative w-full min-h-screen overflow-hidden bg-black main-section">
        <Main mainBanner={bannerData} />
      </section>

      <div className="relative w-full about-section">
        <AboutUs aboutBanner={bannerData} />
      </div>

      <section className="relative w-full py-16 bg-black sm:py-20 md:py-24 lg:py-32">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="mb-12 text-center md:mb-16">
            <h2 className="mb-6 text-3xl font-light tracking-wide sm:text-4xl md:text-5xl text-yellow-main">
              Наша продукция
            </h2>
            <a
              href="/catalog"
              className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-yellow-main text-black rounded-lg font-medium text-sm sm:text-base hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Перейти в каталог
            </a>
          </div>

          {!products || products.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg text-white/60">Нет доступных товаров</p>
            </div>
          ) : (
            <div 
              ref={productsRef}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8"
            >
              {products.map((product) => (
                <ProductIcon key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}