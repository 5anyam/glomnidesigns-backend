// src/api/portfolio/controllers/portfolio.ts
import { factories } from '@strapi/strapi';
import { Context } from 'koa';
import { Portfolio, ApiResponse, EntityServiceReturn } from '../../../../types';

export default factories.createCoreController('api::portfolio.portfolio', ({ strapi }) => ({

  // Get all portfolios
  async find(ctx: Context) {
    const { query } = ctx;
    
    try {
      const entity = await strapi.entityService.findMany('api::portfolio.portfolio', {
        ...query,
        populate: {
          images: {
            fields: ['url', 'alternativeText', 'width', 'height'],
          },
          featured_image: {
            fields: ['url', 'alternativeText', 'width', 'height'],
          },
        },
      });

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      strapi.log.error('Portfolio find error:', error);
      return ctx.internalServerError('Failed to fetch portfolios');
    }
  },

  // Get single portfolio by ID
  async findOne(ctx: Context) {
    const { id } = ctx.params;
    const { query } = ctx;

    if (!id) {
      return ctx.badRequest('Portfolio ID is required');
    }

    try {
      const entity = await strapi.entityService.findOne('api::portfolio.portfolio', id, {
        ...query,
        populate: {
          images: {
            fields: ['url', 'alternativeText', 'width', 'height'],
          },
          featured_image: {
            fields: ['url', 'alternativeText', 'width', 'height'],
          },
        },
      });

      if (!entity) {
        return ctx.notFound('Portfolio not found');
      }

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      strapi.log.error('Portfolio findOne error:', error);
      return ctx.internalServerError('Failed to fetch portfolio');
    }
  },

  // Get portfolio by slug
  async findBySlug(ctx: Context) {
    const { slug } = ctx.params;

    if (!slug) {
      return ctx.badRequest('Portfolio slug is required');
    }

    try {
      const portfolios = await strapi.entityService.findMany('api::portfolio.portfolio', {
        filters: {
          slug: slug,
        },
        populate: {
          images: {
            fields: ['url', 'alternativeText', 'width', 'height'],
          },
          featured_image: {
            fields: ['url', 'alternativeText', 'width', 'height'],
          },
        },
      });

      if (!portfolios || portfolios.length === 0) {
        return ctx.notFound('Portfolio not found');
      }

      const sanitizedEntity = await this.sanitizeOutput(portfolios[0], ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      strapi.log.error('Portfolio findBySlug error:', error);
      return ctx.internalServerError('Failed to fetch portfolio');
    }
  },

  // Search portfolios
  async search(ctx: Context) {
    const { q, area, location } = ctx.query;

    let filters: any = {};

    // Text search
    if (q) {
      filters.$or = [
        { name: { $containsi: q } },
        { description: { $containsi: q } },
        { location: { $containsi: q } },
        { area: { $containsi: q } },
      ];
    }

    // Area filter
    if (area) {
      filters.area = { $containsi: area };
    }

    // Location filter
    if (location) {
      filters.location = { $containsi: location };
    }

    try {
      const entity = await strapi.entityService.findMany('api::portfolio.portfolio', {
        filters,
        populate: {
          images: {
            fields: ['url', 'alternativeText', 'width', 'height'],
          },
          featured_image: {
            fields: ['url', 'alternativeText', 'width', 'height'],
          },
        },
      });

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      strapi.log.error('Portfolio search error:', error);
      return ctx.internalServerError('Failed to search portfolios');
    }
  },

  // Create new portfolio
  async create(ctx: Context) {
    const { data } = ctx.request.body;

    // Validate required fields
    if (!data.name || !data.slug) {
      return ctx.badRequest('Name and slug are required');
    }

    try {
      const entity = await strapi.entityService.create('api::portfolio.portfolio', {
        data,
        populate: {
          images: true,
          featured_image: true,
        },
      });

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      if (error.details?.errors) {
        const uniqueError = error.details.errors.find(
          (err: any) => err.message?.includes('unique')
        );
        if (uniqueError) {
          return ctx.badRequest('Portfolio with this slug already exists');
        }
      }
      strapi.log.error('Portfolio create error:', error);
      return ctx.internalServerError('Failed to create portfolio');
    }
  },

  // Update portfolio
  async update(ctx: Context) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;

    if (!id) {
      return ctx.badRequest('Portfolio ID is required');
    }

    try {
      const entity = await strapi.entityService.update('api::portfolio.portfolio', id, {
        data,
        populate: {
          images: true,
          featured_image: true,
        },
      });

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      strapi.log.error('Portfolio update error:', error);
      return ctx.internalServerError('Failed to update portfolio');
    }
  },

  // Delete portfolio
  async delete(ctx: Context) {
    const { id } = ctx.params;

    if (!id) {
      return ctx.badRequest('Portfolio ID is required');
    }

    try {
      const entity = await strapi.entityService.delete('api::portfolio.portfolio', id);
      if (!entity) {
        return ctx.notFound('Portfolio not found');
      }

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      strapi.log.error('Portfolio delete error:', error);
      return ctx.internalServerError('Failed to delete portfolio');
    }
  },

}));
