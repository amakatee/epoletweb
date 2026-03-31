// app/sitemap.js
import { client } from '@/lib/sanity/client';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://epolet.ru';
  
  // Fetch all products from Sanity
  const products = await client.fetch(`
    *[_type == "product"] {
      slug,
      _updatedAt
    }
  `);
  
  // Static routes
  const staticRoutes = [
    '',
    '/catalog',
    '/about',
    '/contact',
    '/confidential',
    '/sout',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));
  
  // Dynamic product routes
  const productRoutes = products.map(product => ({
    url: `${baseUrl}/product/${product.slug?.current}`,
    lastModified: new Date(product._updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  
  return [...staticRoutes, ...productRoutes];
}