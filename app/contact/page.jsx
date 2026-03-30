// app/contact/page.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { client } from '../../lib/sanity/client';
import HeaderSection from '../../components/HeaderSection';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, XCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Contact() {
  const [bannerData, setBannerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formStatus, setFormStatus] = useState('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const formRef = useRef(null);
  const infoRef = useRef(null);
  const successRef = useRef(null);

  // Fetch banner data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const query = '*[_type == "banner"]';
        const fetchedBanner = await client.fetch(query);
        setBannerData(fetchedBanner || []);
      } catch (err) {
        console.error('Failed to fetch contact data:', err);
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // GSAP Animation for contact info
  useEffect(() => {
    if (!infoRef.current) return;

    const ctx = gsap.context(() => {
      if (infoRef.current?.children) {
        gsap.fromTo(
          Array.from(infoRef.current.children),
          {
            opacity: 0,
            y: 40,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: infoRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // GSAP Animation for form
  useEffect(() => {
    if (!formRef.current) return;

    const ctx = gsap.context(() => {
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          {
            opacity: 0,
            y: 50
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: formRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      // Simulate API call - replace with your actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });

      // Animate success message
      if (successRef.current) {
        gsap.fromTo(successRef.current,
          { opacity: 0, scale: 0.8, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out" }
        );
      }

      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    } catch (err) {
      setFormStatus('error');
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    }
  };

  const contactBanner = bannerData?.[0] || {};

  const contactInfo = [
    {
      icon: Phone,
      title: 'Телефон',
      details: ['+7 (999) 123-45-67', '+7 (999) 765-43-21'],
      color: 'bg-blue-500/10'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@company.ru', 'sales@company.ru'],
      color: 'bg-green-500/10'
    },
    {
      icon: MapPin,
      title: 'Адрес',
      details: ['г. Москва, ул. Примерная, д. 123'],
      color: 'bg-red-500/10'
    },
    {
      icon: Clock,
      title: 'Режим работы',
      details: ['Пн-Пт: 9:00 - 18:00', 'Сб-Вс: Выходной'],
      color: 'bg-purple-500/10'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">Загрузка...</div>
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
    <div className=" bg-gradient-to-b from-gray-900 to-black">
      {/* Hero Section */}
      <HeaderSection 
        imageURL={contactBanner?.imageContacts} 
        mainText={contactBanner?.titleContats || 'Контакты'} 
        currentPage="Контакты"
      />

      

      {/* Success Message */}
      <AnimatePresence>
        {formStatus === 'success' && (
          <motion.div
            ref={successRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="flex items-center gap-3 px-6 py-4 bg-green-500 rounded-xl shadow-2xl">
              <CheckCircle className="w-6 h-6 text-white" />
              <span className="text-white font-medium">Сообщение отправлено!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {formStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className="flex items-center gap-3 px-6 py-4 bg-red-500 rounded-xl shadow-2xl">
              <XCircle className="w-6 h-6 text-white" />
              <span className="text-white font-medium">Ошибка. Попробуйте позже.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}