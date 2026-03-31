// lib/sanity/client.js
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

// Don't create client immediately - use lazy initialization
let clientInstance = null;
let builderInstance = null;

function getClient() {
  if (!clientInstance) {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    
    // Only create client if we have the required config
    if (projectId && dataset) {
      clientInstance = createClient({
        projectId,
        dataset,
        apiVersion: '2024-01-01',
        useCdn: true,
      });
      builderInstance = createImageUrlBuilder(clientInstance);
    }
  }
  return clientInstance;
}

function getBuilder() {
  getClient(); // Ensure client is initialized
  return builderInstance;
}

// Create a proxy that handles missing configuration gracefully
export const client = new Proxy({}, {
  get: (target, prop) => {
    const actualClient = getClient();
    if (!actualClient) {
      // Return a dummy function that returns null when client isn't configured
      if (prop === 'fetch') {
        return async () => {
          console.warn('Sanity client not configured - returning empty result');
          return null;
        };
      }
      return () => null;
    }
    const value = actualClient[prop];
    return typeof value === 'function' ? value.bind(actualClient) : value;
  }
});

export function urlFor(source) {
  const builder = getBuilder();
  if (!source || !builder) return null;
  return builder.image(source);
}

export function getImageUrl(source, width, height) {
  const builder = getBuilder();
  if (!source || !builder) return null;
  
  let imageBuilder = builder.image(source);
  
  if (width) imageBuilder = imageBuilder.width(width);
  if (height) imageBuilder = imageBuilder.height(height);
  
  return imageBuilder.url();
}

export default client;