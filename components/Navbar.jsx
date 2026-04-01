'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  PhoneIcon,
  MapPinIcon,
  EnvelopeIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation';

gsap.registerPlugin(useGSAP);

/* ----------------------------- CONSTANTS ----------------------------- */

const CONTACT_INFO = {
  phone: '+7(916)003-28-81',
  phoneLink: '+79160032881',
  address: 'Московская Область, пгт. Шаховская, Волочановское шоссе дом 6А',
  addressShort: 'Шаховская',
  email: 'partner@epolet5.ru',
};

const NAVIGATION_ITEMS = [
  { name: 'Каталог', path: '/catalog' },
  { name: 'О Компании', path: '/about' },
  { name: 'Контакты', path: '/contact' },
];

/* ----------------------------- CUSTOM HOOKS ----------------------------- */

const useLockBodyScroll = (locked) => {
  useEffect(() => {
    if (locked) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [locked]);
};

/* ----------------------------- COMPONENT ----------------------------- */

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isContactVisible, setIsContactVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useLockBodyScroll(isMenuOpen);

  // Refs for GSAP
  const containerRef = useRef(null);
  const contactBarRef = useRef(null);
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const navItemsRef = useRef([]);
  const mobileMenuRef = useRef(null);
  const menuItemsRef = useRef([]);
  const contactMobileRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setIsContactVisible(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    if (isMenuOpen) {
      closeMenu();
    }
  }, [pathname]);

  // Close menu on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isMenuOpen]);

  /* -------------------- GSAP ANIMATIONS -------------------- */

  // Initial load animation
  useGSAP(
    () => {
      if (!navRef.current || !logoRef.current || !isMounted) return;

      const tl = gsap.timeline();

      tl.fromTo(
        navRef.current,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );

      tl.fromTo(
        logoRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'elastic.out(1, 0.6)' },
        '-=0.4'
      );

      const validNavItems = navItemsRef.current.filter((item) => item);
      if (validNavItems.length > 0) {
        tl.fromTo(
          validNavItems,
          { opacity: 0, y: -15 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: 'back.out(0.8)',
          },
          '-=0.2'
        );
      }
    },
    { scope: containerRef, dependencies: [isMounted] }
  );

  // Contact bar animation on scroll
  useGSAP(
    () => {
      if (!contactBarRef.current) return;

      if (!isContactVisible) {
        gsap.to(contactBarRef.current, {
          y: -60,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
        });
      } else {
        gsap.to(contactBarRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        });
      }
    },
    { dependencies: [isContactVisible] }
  );

  // Mobile menu animation
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (isMenuOpen) {
      // Reset position before animating in
      gsap.set(mobileMenuRef.current, { x: '100%', display: 'flex' });
      
      const validMenuItems = menuItemsRef.current.filter((item) => item);
      const tl = gsap.timeline();

      // Slide in menu
      tl.to(mobileMenuRef.current, {
        x: 0,
        duration: 0.6,
        ease: 'power3.out',
      });

      // Stagger menu items
      if (validMenuItems.length > 0) {
        tl.fromTo(
          validMenuItems,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: 'back.out(0.8)',
          },
          '-=0.3'
        );
      }

      // Contact section animation
      if (contactMobileRef.current) {
        tl.fromTo(
          contactMobileRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.2'
        );
      }
    } else {
      // Slide out menu
      gsap.to(mobileMenuRef.current, {
        x: '100%',
        duration: 0.5,
        ease: 'power3.in',
      });
    }
  }, [isMenuOpen]);

  // Toggle menu
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  // Close menu
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Handle navigation
  const handleNavigation = useCallback(
    (path) => {
      closeMenu();
      router.push(path);
    },
    [router, closeMenu]
  );

  // Logo hover animation
  const handleLogoHover = useCallback((isHovering) => {
    if (!logoRef.current) return;

    if (isHovering) {
      gsap.to(logoRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
      });
    } else {
      gsap.to(logoRef.current, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, []);

  // Nav item hover animation
  const handleNavItemHover = useCallback((element, isHovering) => {
    if (!element) return;

    if (isHovering) {
      gsap.to(element, {
        y: -2,
        color: '#FFD700',
        duration: 0.2,
        ease: 'power2.out',
      });
    } else {
      gsap.to(element, {
        y: 0,
        color: '#FFFFFF',
        duration: 0.2,
        ease: 'power2.out',
      });
    }
  }, []);

  // Button tap animation
  const handleTap = useCallback((element) => {
    if (!element) return;

    gsap.to(element, {
      scale: 0.95,
      duration: 0.1,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
    });
  }, []);

  const isActiveRoute = useCallback((path) => pathname === path, [pathname]);

  /* ----------------------------- RENDER ----------------------------- */

  return (
    <>
      <nav
        ref={containerRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/95 backdrop-blur-md shadow-lg'
            : 'bg-black/80 backdrop-blur-sm'
        }`}
        aria-label="Главная навигация"
      >
        {/* Top Contact Bar */}
        <div
          ref={contactBarRef}
          className="hidden lg:flex items-center justify-between px-6 py-2 text-xs font-light tracking-wide border-b lg:px-12 xl:px-20 border-white/10 bg-black/50"
        >
          <div className="flex items-center gap-4 xl:gap-6">
            <a
              href={`tel:${CONTACT_INFO.phoneLink}`}
              className="flex items-center gap-2 transition-colors hover:text-yellow-main group"
              aria-label="Позвонить нам"
            >
              <PhoneIcon className="w-4 h-4 text-yellow-main group-hover:scale-110 transition-transform" />
              <span>{CONTACT_INFO.phone}</span>
            </a>

            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-yellow-main" />
              <span className="hidden xl:inline">{CONTACT_INFO.address}</span>
              <span className="text-xs xl:hidden">{CONTACT_INFO.addressShort}</span>
            </div>

            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="flex items-center gap-2 transition-colors hover:text-yellow-main group"
              aria-label="Отправить email"
            >
              <EnvelopeIcon className="w-4 h-4 text-yellow-main group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">{CONTACT_INFO.email}</span>
            </a>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div
          ref={navRef}
          className="flex items-center justify-between h-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 lg:h-20"
        >
          {/* Logo */}
          <div
            ref={logoRef}
            onClick={() => handleNavigation('/')}
            onMouseEnter={() => handleLogoHover(true)}
            onMouseLeave={() => handleLogoHover(false)}
            onTouchStart={(e) => {
              e.preventDefault();
              handleTap(e.currentTarget);
              handleNavigation('/');
            }}
            className="flex items-center gap-2 cursor-pointer sm:gap-3 group"
            role="button"
            tabIndex={0}
            aria-label="На главную"
            onKeyPress={(e) => e.key === 'Enter' && handleNavigation('/')}
          >
            <img
              className="w-8 transition-all duration-300 sm:w-10 lg:w-12"
              src="/ep.png"
              alt="Эполет логотип"
            />
            <span className="text-lg font-light tracking-wide uppercase text-white sm:text-xl lg:text-2xl">
              Эполет
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="items-center hidden gap-4 md:flex lg:gap-6 xl:gap-8">
            {NAVIGATION_ITEMS.map((item, index) => (
              <button
                key={item.path}
                ref={(el) => (navItemsRef.current[index] = el)}
                onClick={() => handleNavigation(item.path)}
                onMouseEnter={(e) => handleNavItemHover(e.currentTarget, true)}
                onMouseLeave={(e) => handleNavItemHover(e.currentTarget, false)}
                className={`relative text-sm lg:text-base font-light tracking-wider uppercase px-2 py-1 transition-colors ${
                  isActiveRoute(item.path) ? 'text-yellow-main' : 'text-white'
                }`}
                aria-current={isActiveRoute(item.path) ? 'page' : undefined}
              >
                {item.name}
                {isActiveRoute(item.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-main" />
                )}
              </button>
            ))}
          </div>

          {/* Quick Contact - Tablet */}
          <div className="items-center hidden gap-3 sm:flex md:hidden">
            <a
              href={`tel:${CONTACT_INFO.phoneLink}`}
              className="flex items-center gap-1 text-xs transition-colors hover:text-yellow-main"
              aria-label="Позвонить"
            >
              <PhoneIcon className="w-4 h-4 text-yellow-main" />
              <span className="text-white">{CONTACT_INFO.phone}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            onClick={() => {
              handleTap(menuButtonRef.current);
              toggleMenu();
            }}
            className="relative z-50 flex items-center justify-center w-11 h-11 transition-all rounded-full md:hidden hover:bg-white/10 active:scale-95"
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6 text-white" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Separate from main nav for better control */}
      <div
        ref={mobileMenuRef}
        className="fixed top-0 right-0 bottom-0 w-full md:hidden z-40 bg-black"
        style={{
          transform: 'translateX(100%)',
          display: isMenuOpen ? 'flex' : 'none',
        }}
      >
        <div className="flex flex-col w-full h-full overflow-y-auto">
          {/* Close button inside menu */}
          <button
            onClick={toggleMenu}
            className="absolute top-5 right-5 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            aria-label="Закрыть меню"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>

          {/* Menu Content */}
          <div className="flex flex-col h-full px-6 pt-24 pb-10">
            {/* Navigation Links */}
            <div className="flex-1 space-y-1">
              {NAVIGATION_ITEMS.map((item, index) => (
                <button
                  key={item.path}
                  ref={(el) => (menuItemsRef.current[index] = el)}
                  onClick={() => handleNavigation(item.path)}
                  className={`block w-full text-left py-5 text-3xl font-light tracking-[0.5px] uppercase border-b border-white/10 transition-colors ${
                    isActiveRoute(item.path) ? 'text-yellow-main' : 'text-white'
                  } hover:text-yellow-main`}
                  aria-current={isActiveRoute(item.path) ? 'page' : undefined}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Contact Information */}
            <div
              ref={contactMobileRef}
              className="pt-10 space-y-6 border-t border-white/20"
            >
              <a
                href={`tel:${CONTACT_INFO.phoneLink}`}
                className="flex items-center gap-4 transition-colors hover:text-yellow-main group"
              >
                <PhoneIcon className="w-6 h-6 text-yellow-main flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-xs text-white/60">Телефон</p>
                  <p className="text-lg font-medium text-white">{CONTACT_INFO.phone}</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <MapPinIcon className="w-6 h-6 text-yellow-main flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-white/60">Адрес</p>
                  <p className="text-base leading-tight text-white">{CONTACT_INFO.address}</p>
                </div>
              </div>

              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-4 transition-colors hover:text-yellow-main group"
              >
                <EnvelopeIcon className="w-6 h-6 text-yellow-main flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-xs text-white/60">Email</p>
                  <p className="text-base text-white break-all">{CONTACT_INFO.email}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;