// src/types/index.ts
export interface StrapiMedia {
    id: number;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  }
  
  export interface Category {
    id: number;
    documentId?: string;
    name: string;
    description?: string;
    slug: string;
    type: 'home_interior' | 'office_interior';
    image?: StrapiMedia;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  }
  
  export interface Design {
    id: number;
    documentId?: string;
    title: string;
    description?: string;
    images?: StrapiMedia[];
    featured_image?: StrapiMedia;
    price_range?: string;
    style?: 'modern' | 'traditional' | 'contemporary' | 'minimalist' | 'luxury';
    area_size?: number;
    location?: string;
    completion_time?: string;
    tags?: any;
    is_featured?: boolean;
    slug: string;
    categories?: Category[];
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    locale?: string;
  }
  
  // New Portfolio interface
export interface Portfolio {
    id: number;
    documentId?: string;
    name: string;
    slug: string;
    images?: StrapiMedia[];
    featured_image?: StrapiMedia;
    description?: string;
    area?: string;
    location?: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    locale?: string;
  }
  
  // Generic API Response type
  export interface ApiResponse<T> {
    data: T;
    meta?: {
      pagination?: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  }
  
  // Strapi v5 response structure (same as ApiResponse but kept for clarity)
  export interface StrapiResponse<T> {
    data: T;
    meta?: {
      pagination?: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  }
  
  // For entity service direct returns
  export type EntityServiceReturn<T> = T & {
    documentId?: string;
    locale?: string;
    publishedAt?: string;
  };
  
  // Category with design count interface
  export interface CategoryWithCount extends Category {
    design_count: number;
  }
  