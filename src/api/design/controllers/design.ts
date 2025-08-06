import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController('api::design.design', ({ strapi }) => ({

  // Get all designs
  async find(ctx: Context) {
    const { query } = ctx;
    const entity = await strapi.entityService.findMany('api::design.design', {
      ...query,
      populate: {
        categories: { fields: ['name', 'slug', 'type'] },
        images: { fields: ['url', 'alternativeText', 'width', 'height'] },
        featured_image: { fields: ['url', 'alternativeText', 'width', 'height'] },
      },
    });
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Get single design by ID
  async findOne(ctx: Context) {
    const { id } = ctx.params;
    const { query } = ctx;
    if (!id) return ctx.badRequest('Design ID is required');
    const entity = await strapi.entityService.findOne('api::design.design', id, {
      ...query,
      populate: {
        categories: { fields: ['name', 'slug', 'type'] },
        images: { fields: ['url', 'alternativeText', 'width', 'height'] },
        featured_image: { fields: ['url', 'alternativeText', 'width', 'height'] },
      },
    });
    if (!entity) return ctx.notFound('Design not found');
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Get by category
  async findByCategory(ctx: Context) {
    const { categorySlug } = ctx.params;
    const { query } = ctx;
    if (!categorySlug) return ctx.badRequest('Category slug is required');
    const categories = await strapi.entityService.findMany('api::category.category', {
      filters: { slug: categorySlug },
    });
    if (!categories || categories.length === 0) return ctx.notFound('Category not found');
    const category = categories[0];
    const entity = await strapi.entityService.findMany('api::design.design', {
      ...query,
      filters: { categories: { id: category.id } },
      populate: {
        categories: { fields: ['name', 'slug', 'type'] },
        images: { fields: ['url', 'alternativeText', 'width', 'height'] },
        featured_image: { fields: ['url', 'alternativeText', 'width', 'height'] },
      },
    });
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Get featured designs
  async findFeatured(ctx: Context) {
    const { query } = ctx;
    const entity = await strapi.entityService.findMany('api::design.design', {
      ...query,
      filters: { is_featured: true },
      populate: {
        categories: { fields: ['name', 'slug', 'type'] },
        images: { fields: ['url', 'alternativeText', 'width', 'height'] },
        featured_image: { fields: ['url', 'alternativeText', 'width', 'height'] },
      },
    });
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Search designs
  async search(ctx: Context) {
    const query = ctx.query as any;
    const { q, style, areaSize, type, page = '1', pageSize = '10' } = query;
    let filters: any = {};
    if (q) filters.$or = [
      { title: { $containsi: q } },
      { description: { $containsi: q } },
      { location: { $containsi: q } },
    ];
    if (style && ['modern', 'traditional', 'contemporary', 'minimalist', 'luxury'].includes(style))
      filters.style = style;
    if (areaSize) {
      const sizeNum = parseInt(areaSize);
      if (!isNaN(sizeNum))
        filters.area_size = { $gte: sizeNum };
    }
    if (type && (type === 'home_interior' || type === 'office_interior'))
      filters.categories = { type };
    const entity = await strapi.entityService.findMany('api::design.design', {
      filters,
      populate: {
        categories: { fields: ['name', 'slug', 'type'] },
        images: { fields: ['url', 'alternativeText', 'width', 'height'] },
        featured_image: { fields: ['url', 'alternativeText', 'width', 'height'] },
      },
      pagination: {
        page: parseInt(page),
        pageSize: Math.min(parseInt(pageSize), 100),
      },
    });
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // --- The important one: Find by slug ---
  async findBySlug(ctx: Context) {
    const { slug } = ctx.params;
    if (!slug) return ctx.badRequest('Slug is required');
    const designs = await strapi.entityService.findMany('api::design.design', {
      filters: { slug },
      populate: {
        categories: { fields: ['name', 'slug', 'type'] },
        images: { fields: ['url', 'alternativeText', 'width', 'height'] },
        featured_image: { fields: ['url', 'alternativeText', 'width', 'height'] },
      },
    });
    if (!designs || designs.length === 0)
      return ctx.notFound('Design not found');
    const sanitizedEntity = await this.sanitizeOutput(designs[0], ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Create, update, delete as per your needs...
}));
