'use client';

import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Main({ mainBanner }) {
  const container = useRef(null);
  const bg = useRef(null);
  const title = useRef(null);
  const scrollDot = useRef(null);

  const imageUrl =
    mainBanner?.imageUrl ||
    mainBanner?.image?.asset?.url ||
    mainBanner?.image?.url;

  const heading =
    mainBanner?.title || 'Качественные изделия из ППУ';

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ===== INTRO (calm, premium) =====
      gsap.fromTo(
        title.current,
        { y: 80, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: 'power3.out',
        }
      );

      // ===== SCROLL PARALLAX (very subtle) =====
      gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
        .to(bg.current, { y: 90, scale: 1.06, ease: 'none' }, 0)
        .to(title.current, { y: 120, opacity: 0, ease: 'none' }, 0);

      // ===== Scroll indicator breathing =====
      gsap.to(scrollDot.current, {
        y: 8,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={container}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div
          ref={bg}
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: 'center 30%',
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-6 text-center">
        <h1
          ref={title}
          className="max-w-5xl font-light text-white leading-[1.1]
                     text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-[4.8rem]  2xl:text-[5.5rem]"
          style={{
            willChange: 'transform, opacity',
            textShadow: '0 12px 40px rgba(0,0,0,0.55)',
          }}
        >
          {heading}
        </h1>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[2px] text-white/50">
          Прокрутите вниз
        </span>
        <div className="w-5 h-9 border border-white/40 rounded-full flex justify-center pt-1.5">
          <div
            ref={scrollDot}
            className="w-0.5 h-2.5 bg-white/70 rounded-full"
          />
        </div>
      </div>
    </section>
  );
}