// components/Seo.jsx
'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

export default function SEO({ title, description, image, type = 'website' }) {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://epolet5.ru';
  const currentUrl = `${baseUrl}${pathname}`;
  const defaultTitle = 'Эполет - Производство изделий из ППУ';
  const defaultDescription = 'Профессиональное производство изделий из мягкого, жесткого и интегрального пенополиуретана. Гарантия качества 20 лет.';
  const defaultImage = '/ep.png';

  return (
    <Head>
      <title>{title ? `${title} | Эполет` : defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:site_name" content="Эполет" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="yandex-verification" content="9ec83ae61756bb79" />
    </Head>
  );
}