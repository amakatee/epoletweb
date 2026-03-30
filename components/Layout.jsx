// components/Layout.jsx
import React from 'react';
import Head from 'next/head';
import { useViewportScroll } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

// Metadata configuration for better maintainability
const SITE_METADATA = {
  title: 'Изделия из ППУ - Эполет',
  description: 'Компания Эполет специализируется на производстве изделий из мягкого, жесткого и интегрального пенополиуретана.',
  ogTitle: 'Заливка эластичного, жесткого, интегрального пенополиуретана - Эполет',
  keywords: 'Интегральный ппу Жесткий ппу Пена для матраса купить Поролон с памятью Лист для фрезеровки Подлокотники для офисных кресел Подлокотники для игровых кресел Подлокотник из ппу Автокресло из ппу Эластичный ппу Форма для ппу Кресло из ппу',
  yandexVerification: '9ec83ae61756bb79',
  googleVerification: 'qOh-BE-b0Wza7g3_rzejubyBJcqZpwLJbxq2WOJAY0c',
  icon: '/ep.png',
};

const OFFSET_Y = [0, 300];

/**
 * Layout component that wraps all pages
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
const Layout = ({ children }) => {
  const { scrollY } = useViewportScroll();

  return (
    <div className="layout min-h-screen flex flex-col">
      <Head>
        <title>{SITE_METADATA.title}</title>
        <meta name="description" content={SITE_METADATA.description} />
        <meta property="og:title" content={SITE_METADATA.ogTitle} />
        <meta name="keywords" content={SITE_METADATA.keywords} />
        <meta name="yandex-verification" content={SITE_METADATA.yandexVerification} />
        <meta name="google-site-verification" content={SITE_METADATA.googleVerification} />
        <link rel="icon" href={SITE_METADATA.icon} type="image/x-icon" />
      </Head>

      <header className="navbar fixed top-0 left-0 w-full z-50">
        <Navbar offsetY={OFFSET_Y} scrollY={scrollY} /> 
      </header>

      <main className="mainn flex-grow pt-[8vh]">
        {children}
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

Layout.displayName = 'Layout';

export default Layout;