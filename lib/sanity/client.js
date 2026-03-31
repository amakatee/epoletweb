// lib/sanity/client.js
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    useCdn: true,
});

// Using the named export instead of default export
const builder = createImageUrlBuilder(client);

export function urlFor(source) {
    if (!source) return null;
    return builder.image(source);
}

// Optional: Helper function to get direct URL string
export function getImageUrl(source, width, height) {
    if (!source) return null;
    
    let imageBuilder = builder.image(source);
    
    if (width) imageBuilder = imageBuilder.width(width);
    if (height) imageBuilder = imageBuilder.height(height);
    
    return imageBuilder.url();
}

// Optional: Export a default for backward compatibility if needed
export default client;