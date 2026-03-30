// components/ProductSection.jsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

/**
 * Helper function to extract plain text from Portable Text
 * @param {any} portableText - Portable Text from Sanity
 * @returns {string} Plain text
 */
const getPlainText = (portableText) => {
  if (!portableText) return '';
  if (typeof portableText === 'string') return portableText;
  if (Array.isArray(portableText)) {
    return portableText
      .map(block => {
        if (block._type !== 'block' || !block.children) return '';
        return block.children.map(child => child.text).join('');
      })
      .join(' ');
  }
  return '';
};

/**
 * Product Section Component
 * @param {Object} props
 * @param {Object} props.product - Product data from Sanity
 */
export default function ProductSection({ product }) {
  const { name, details, slug, imageUrl, altImage } = product;

  if (!slug) return null;

  const productUrl = `/product/${slug}`;
  const plainDetails = getPlainText(details);
  const truncatedDetails = plainDetails.length > 60 
    ? `${plainDetails.substring(0, 60)}...` 
    : plainDetails;

  return (
    <Link href={productUrl} passHref legacyBehavior>
      <motion.a
        className="group flex flex-col items-center text-center cursor-pointer bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Image Container */}
        <div className="w-full aspect-square overflow-hidden rounded-lg mb-4 bg-gray-800">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={altImage || name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500 text-sm">Нет фото</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <h3 className="text-white text-lg font-medium mb-2 group-hover:text-yellow-main transition-colors">
          {name}
        </h3>
        
        {truncatedDetails && (
          <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
            {truncatedDetails}
          </p>
        )}

        {/* Button */}
        <span className="mt-4 inline-block px-4 py-2 border border-yellow-main text-yellow-main rounded-lg text-sm hover:bg-yellow-main hover:text-black transition-all duration-300">
          Подробнее
        </span>
      </motion.a>
    </Link>
  );
}