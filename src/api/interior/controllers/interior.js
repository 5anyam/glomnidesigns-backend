'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::interior.interior', ({ strapi }) => ({
  // Get all interiors with enhanced data
  async find(ctx) {
    try {
      const { query } = ctx;
      
      const filters = {};
      
      // Search functionality
      if (query.search) {
        filters.$or = [
          { title: { $containsi: query.search } },
          { short_description: { $containsi: query.search } },
          { full_description: { $containsi: query.search } }
        ];
      }
      
      // Filter by category
      if (query.category) {
        filters.interior_category = { slug: query.category };
      }
      
      // Filter by featured
      if (query.featured) {
        filters.is_featured = query.featured === 'true';
      }
      
      // Filter by popular
      if (query.popular) {
        filters.is_popular = query.popular === 'true';
      }

      const entries = await strapi.entityInterior.findMany('api::interior.interior', {
        filters,
        populate: {
          sinterior_category: true,
          featured_image: true,
          gallery_images: true,
          seo: true
        },
        sort: { order_position: 'asc', createdAt: 'desc' },
        pagination: {
          page: query.page || 1,
          pageSize: query.pageSize || 20
        }
      });

      const total = await strapi.entityInterior.count('api::interior.interior', {
        filters
      });

      return {
        data: entries,
        meta: {
          pagination: {
            page: parseInt(query.page) || 1,
            pageSize: parseInt(query.pageSize) || 20,
            total: total,
            pageCount: Math.ceil(total / (parseInt(query.pageSize) || 20))
          }
        }
      };
    } catch (error) {
      console.error('Error in interiors find:', error);
      ctx.throw(500, 'Error fetching interiors');
    }
  },

  // Get featured interiors
  async findFeatured(ctx) {
    try {
      const entries = await strapi.entityInterior.findMany('api::interior.interior', {
        filters: { is_featured: true },
        populate: {
            interior_category: true,
          featured_image: true
        },
        sort: { order_position: 'asc' },
        limit: 6
      });

      return { data: entries };
    } catch (error) {
      console.error('Error in featured interior:', error);
      ctx.throw(500, 'Error fetching featured interiors');
    }
  },

  // Get popular interiors
  async findPopular(ctx) {
    try {
      const entries = await strapi.entityInterior.findMany('api::interior.interior', {
        filters: { is_popular: true },
        populate: {
            interior_category: true,
          featured_image: true
        },
        sort: { order_position: 'asc' },
        limit: 8
      });

      return { data: entries };
    } catch (error) {
      console.error('Error in popular interiors:', error);
      ctx.throw(500, 'Error fetching popular interiors');
    }
  },

  // Get interior by slug
  async findBySlug(ctx) {
    try {
      const { slug } = ctx.params;
      
      const entry = await strapi.entityInterior.findMany('api::interior.interior', {
        filters: { slug },
        populate: {
            interior_category: true,
          featured_image: true,
          gallery_images: true,
          seo: true
        }
      });

      if (!entry || entry.length === 0) {
        return ctx.notFound('Interior not found');
      }

      return { data: entry[0] };
    } catch (error) {
      console.error('Error in interior by slug:', error);
      ctx.throw(500, 'Error fetching interior');
    }
  },

  // Get interiors by category
  async findByCategory(ctx) {
    try {
      const { categorySlug } = ctx.params;
      
      const entries = await strapi.entityInterior.findMany('api::interior.interior', {
        filters: {
            interior_category: { slug: categorySlug }
        },
        populate: {
            interior_category: true,
          featured_image: true,
          gallery_images: true
        },
        sort: { order_position: 'asc', createdAt: 'desc' }
      });

      return { data: entries };
    } catch (error) {
      console.error('Error in interiors by category:', error);
      ctx.throw(500, 'Error fetching interiors by category');
    }
  }
}));
