// components/Footer.jsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PhoneIcon, MapPinIcon, EnvelopeIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import Form from './Form';


// Constants
const CONTACT_INFO = {
  phone: '+7(916)003-28-81',
  phoneLink: '+79160032881',
  email: 'partner@epolet5.ru',
  address: 'Московская Область, пгт. Шаховская, Волочановское шоссе дом 6А',
  mapUrl: 'https://yandex.ru/map-widget/v1/-/CCUFFKVwxC',
  // workHours: 'Ежедневно с 9:00 до 21:00',
};

const SOCIAL_LINKS = [
  // Add your social media links here if needed
  // { name: 'WhatsApp', url: 'https://wa.me/79160032881', icon: 'whatsapp' },
  // { name: 'Telegram', url: 'https://t.me/epolet', icon: 'telegram' },
];

const Footer = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <footer className="text-white bg-gradient-to-b from-gray-800 to-black">
      {/* Main Footer Content */}
      <div className="px-4 py-8 mx-auto footer-container max-w-7xl sm:px-6 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          
          {/* Map Section */}
          <div className="space-y-4 footer-map">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <iframe
                src={CONTACT_INFO.mapUrl}
                title="Карта расположения компании Эполет"
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                loading="lazy"
                aria-label="Карта с местоположением компании"
              />
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-300">
              <span className="text-sm leading-relaxed footer-map-address">
                {CONTACT_INFO.address}
              </span>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-6 footer-contact">
            <h2 className="text-2xl font-light tracking-wide lg:text-3xl text-yellow-main">
              Контакты
            </h2>
            
            <div className="space-y-4">
              {/* Phone */}
              <a
                href={`tel:${CONTACT_INFO.phoneLink}`}
                className="flex items-center gap-3 transition-colors duration-300 group hover:text-yellow-main"
                aria-label="Позвонить нам"
              >
                <PhoneIcon className="w-5 h-5 transition-transform text-yellow-main group-hover:scale-110" />
                <span className="text-base lg:text-lg">{CONTACT_INFO.phone}</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-3 transition-colors duration-300 group hover:text-yellow-main"
                aria-label="Отправить email"
              >
                <EnvelopeIcon className="w-5 h-5 transition-transform text-yellow-main group-hover:scale-110" />
                <span className="text-base break-all lg:text-lg">{CONTACT_INFO.email}</span>
              </a>

              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPinIcon className="flex-shrink-0 w-5 h-5 mt-1 text-yellow-main" />
                <span className="text-sm leading-relaxed text-gray-300 lg:text-base">
                  {CONTACT_INFO.address}
                </span>
              </div>

              {/* Work Hours */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400">
                  <span className="text-yellow-main">Часы работы:</span> {CONTACT_INFO.workHours}
                </p>
              </div>
            </div>

            {/* Optional: Social Links */}
            {SOCIAL_LINKS.length > 0 && (
              <div className="flex gap-4 pt-4">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full bg-white/10 hover:bg-yellow-main hover:text-black"
                    aria-label={social.name}
                  >
                    {/* Add your social icon here */}
                    <span className="sr-only">{social.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="mt-8 form-cont bg-gradient-to-r from-yellow-500 to-yellow-600">
        <Form />
      </div>

      {/* Copyright Bar */}
      <div className="py-6 border-t border-white/10">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Эполет. Все права защищены.
            </p>
            {/* <div className="flex gap-6 text-xs text-gray-400">
              <Link href="/privacy" className="transition-colors hover:text-yellow-main">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="transition-colors hover:text-yellow-main">
                Условия использования
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;