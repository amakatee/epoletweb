// app/confidential/page.jsx
'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import HeaderSection from '../../components/HeaderSection';
import { client } from '../../lib/sanity/client';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Confidential() {
  const [bannerData, setBannerData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const contentRef = useRef(null);

  // Fetch banner data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const query = '*[_type == "banner"]';
        const fetchedBanner = await client.fetch(query);
        setBannerData(fetchedBanner || []);
      } catch (err) {
        console.error('Failed to fetch banner data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // GSAP Animation
  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        {
          opacity: 0,
          y: 50
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const confidentialBanner = bannerData?.[0] || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="text-white">Загрузка...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Политика конфиденциальности - Эполет</title>
        <meta name="description" content="Политика конфиденциальности компании Эполет. Условия обработки персональных данных пользователей сайта." />
        <link rel="icon" href="/ep.png" type="image/x-icon" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        {/* Hero Section */}
        <HeaderSection 
          imageURL={confidentialBanner?.imageConfidential} 
          mainText={confidentialBanner?.titleConfidential || 'Политика конфиденциальности'} 
          currentPage="Конфиденциальность"
        />

        {/* Content Section */}
        <div className="py-12 md:py-16">
          <div className="container-custom max-w-4xl mx-auto px-4">
            <motion.div 
              ref={contentRef}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-8 border border-gray-700 bg-white/5 rounded-2xl backdrop-blur-sm md:p-12"
            >
              <h1 className="mb-8 text-3xl font-semibold text-center text-white md:text-4xl">
                Политика конфиденциальности
              </h1>
              
              <div className="space-y-6 text-gray-300">
                <p>
                  Соглашаясь с Условиями работы сайта (далее – Условия) и оставляя свои данные на сайте 
                  <a href="https://epolet5.ru" className="mx-1 text-primary-yellow hover:underline">https://epolet5.ru</a> 
                  (далее – Сайт), путем заполнения полей онлайн-заявки.
                </p>

                <div>
                  <h3 className="mb-3 text-xl font-semibold text-white">Пользователь:</h3>
                  <ul className="pl-5 space-y-2 list-disc">
                    <li>подтверждает, что указанные им данные принадлежат лично ему;</li>
                    <li>признает и подтверждает, что он внимательно и в полном объеме ознакомился с настоящими Условиями;</li>
                    <li>признает и подтверждает, что все положения настоящего Условий ему понятны;</li>
                    <li>дает согласие на обработку Сайтом предоставляемых данных в целях для идентификации Пользователя, как клиента и связи с Пользователем для оказания услуг;</li>
                    <li>выражает согласие с данными Условиями без каких-либо оговорок и ограничений.</li>
                  </ul>
                </div>

                <p>
                  дает согласие на обработку Сайтом предоставляемых данных в целях для идентификации Пользователя, 
                  как клиента и связи с Пользователем для оказания услуг; выражает согласие с данными Условиями 
                  без каких-либо оговорок и ограничений.
                </p>

                <div>
                  <h3 className="mb-3 text-xl font-semibold text-white">Настоящее Условия применяются в отношении обработки следующих данных:</h3>
                  <ul className="pl-5 space-y-2 list-disc">
                    <li>номера телефонов;</li>
                    <li>адресах электронной почты.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 text-xl font-semibold text-white">Пользователь, предоставляет Сайту https://epolet5.ru/ право осуществлять следующие действия (операции) с пользовательскими данными:</h3>
                  <ul className="pl-5 space-y-2 list-disc">
                    <li>сбор и накопление;</li>
                    <li>уточнение (обновление, изменение);</li>
                    <li>использование в целях связи с Пользователем для указания услуг;</li>
                    <li>уничтожение.</li>
                  </ul>
                </div>

                <p>
                  Данные, собираемые на сайте, используются только для исполнения конкретного договора.
                </p>

                <p>
                  Отзыв согласия с Условиями работы сайта может быть осуществлен путем направления Пользователем 
                  соответствующего распоряжения в простой письменной форме на адрес электронной почты:  
                  <a href="mailto:epolet5@mail.ru" className="ml-1 text-primary-yellow hover:underline">epolet5@mail.ru</a>.
                </p>

                <p>
                  Сайт не несет ответственности за использование (как правомерное, так и неправомерное) третьими лицами 
                  информации, размещенной Пользователем на Сайте, включая её воспроизведение и распространение, 
                  осуществленные всеми возможными способами.
                </p>

                <p>
                  Сайт имеет право вносить изменения в настоящие Условия. При внесении изменений в актуальной редакции 
                  указывается дата последнего обновления. Новая редакция Условий вступает в силу с момента ее размещения, 
                  если иное не предусмотрено новой редакцией Условий.
                </p>

                <p>
                  Действующая редакция всегда находится на странице по адресу: 
                  <a href="https://epolet5.ru/confidential" className="ml-1 text-primary-yellow hover:underline">
                    https://epolet5.ru/confidential
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}