// lib/sanity/fetch.js
import { client } from './client';

export async function sanityFetch(query, params = {}) {
  try {
    const data = await client.fetch(query, params);
    return data;
  } catch (error) {
    console.error('Error fetching from Sanity:', error);
    return null;
  }
}