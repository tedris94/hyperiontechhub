/**
 * WordPress REST API Client
 * 
 * Handles all communication with WordPress headless CMS
 */

import axios from 'axios';

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || '';
const WP_SITE_URL = process.env.NEXT_PUBLIC_WP_SITE_URL || '';

// Create axios instance
export const wpApi = axios.create({
  baseURL: WP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface WPPost {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_image_url?: string;
  acf?: Record<string, any>;
}

export interface Service extends WPPost {
  acf?: {
    icon?: string;
    description?: string;
    color?: string;
  };
}

export interface TeamMember extends WPPost {
  acf?: {
    position?: string;
    email?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface PortfolioItem extends WPPost {
  acf?: {
    client?: string;
    project_url?: string;
    technologies?: string[];
    gallery?: string[];
  };
}

// Helper function to get featured image URL
function getFeaturedImageUrl(post: any): string | undefined {
  if (post.featured_image_url) {
    return post.featured_image_url;
  }
  if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  return undefined;
}

// Fetch services
export async function getServices(): Promise<Service[]> {
  try {
    const response = await wpApi.get('/services', {
      params: {
        per_page: 100,
        _embed: true,
      },
    });
    
    return response.data.map((post: any) => ({
      ...post,
      featured_image_url: getFeaturedImageUrl(post),
    }));
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

// Fetch single service
export async function getService(slug: string): Promise<Service | null> {
  try {
    const response = await wpApi.get(`/services?slug=${slug}&_embed=true`);
    if (response.data.length > 0) {
      const post = response.data[0];
      return {
        ...post,
        featured_image_url: getFeaturedImageUrl(post),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

// Fetch team members
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const response = await wpApi.get('/team', {
      params: {
        per_page: 100,
        _embed: true,
      },
    });
    
    return response.data.map((post: any) => ({
      ...post,
      featured_image_url: getFeaturedImageUrl(post),
    }));
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

// Fetch portfolio items
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const response = await wpApi.get('/portfolio', {
      params: {
        per_page: 100,
        _embed: true,
      },
    });
    
    return response.data.map((post: any) => ({
      ...post,
      featured_image_url: getFeaturedImageUrl(post),
    }));
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return [];
  }
}

// Fetch page by slug
export async function getPage(slug: string): Promise<WPPost | null> {
  try {
    const response = await wpApi.get(`/pages?slug=${slug}&_embed=true`);
    if (response.data.length > 0) {
      const post = response.data[0];
      return {
        ...post,
        featured_image_url: getFeaturedImageUrl(post),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

// Fetch posts
export async function getPosts(limit: number = 10): Promise<WPPost[]> {
  try {
    const response = await wpApi.get('/posts', {
      params: {
        per_page: limit,
        _embed: true,
      },
    });
    
    return response.data.map((post: any) => ({
      ...post,
      featured_image_url: getFeaturedImageUrl(post),
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// Get site URL helper
export function getSiteUrl(): string {
  return WP_SITE_URL;
}

// Get media URL
export function getMediaUrl(mediaId: number): string {
  return `${WP_API_URL.replace('/wp-json/wp/v2', '')}/wp-json/wp/v2/media/${mediaId}`;
}

