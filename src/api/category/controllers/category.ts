// src/api/category/controllers/category.ts
import { factories } from '@strapi/strapi';
import { Context } from 'koa';
import { Category, ApiResponse, CategoryWithCount, EntityServiceReturn } from '../../../../types';

export default factories.createCoreController('api::category.category', ({ strapi }) => ({

  // Get all categories
  async find(ctx: Context) {
    const { query } = ctx;
    
    const entity = await strapi.entityService.findMany('api::category.category', {
      ...query,
      populate: {
        image: {
          fields: ['url', 'alternativeText', 'width', 'height'],
        },
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Get single category by ID
  async findOne(ctx: Context) {
    const { id } = ctx.params;
    const { query } = ctx;

    if (!id) {
      return ctx.badRequest('Category ID is required');
    }

    const entity = await strapi.entityService.findOne('api::category.category', id, {
      ...query,
      populate: {
        image: {
          fields: ['url', 'alternativeText', 'width', 'height'],
        },
      },
    });

    if (!entity) {
      return ctx.notFound('Category not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Get categories by type
  async findByType(ctx: Context) {
    const { type } = ctx.params;
    
    if (type !== 'home_interior' && type !== 'office_interior') {
      return ctx.badRequest('Invalid category type. Use "home_interior" or "office_interior"');
    }

    const entity = await strapi.entityService.findMany('api::category.category', {
      filters: {
        type: type as 'home_interior' | 'office_interior',
      },
      populate: {
        image: {
          fields: ['url', 'alternativeText', 'width', 'height'],
        },
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Get category with designs count
  async findWithDesignCount(ctx: Context) {
    try {
      const categories = await strapi.entityService.findMany('api::category.category', {
        populate: {
          image: {
            fields: ['url', 'alternativeText', 'width', 'height'],
          },
        },
      }) as EntityServiceReturn<Category>[];

      // Add design count to each category
      const categoriesWithCount: CategoryWithCount[] = await Promise.all(
        categories.map(async (category: EntityServiceReturn<Category>) => {
          const designCount = await strapi.entityService.count('api::design.design', {
            filters: {
              categories: {
                id: category.id,
              },
            },
          });

          return {
            ...category,
            design_count: designCount,
          } as CategoryWithCount;
        })
      );

      const sanitizedEntity = await this.sanitizeOutput(categoriesWithCount, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      strapi.log.error('Error in findWithDesignCount:', error);
      return ctx.internalServerError('Failed to fetch categories with design count');
    }
  },

  // Create new category
  async create(ctx: Context) {
    const { data } = ctx.request.body;

    // Validate required fields
    if (!data.name || !data.slug || !data.type) {
      return ctx.badRequest('Name, slug, and type are required fields');
    }

    // Validate type
    if (!['home_interior', 'office_interior'].includes(data.type)) {
      return ctx.badRequest('Invalid category type. Use "home_interior" or "office_interior"');
    }

    try {
      const entity = await strapi.entityService.create('api::category.category', {
        data,
        populate: {
          image: {
            fields: ['url', 'alternativeText', 'width', 'height'],
          },
        },
      });

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      if (error.details?.errors) {
        // Handle unique constraint errors
        const uniqueError = error.details.errors.find(
          (err: any) => err.message?.includes('unique')
        );
        if (uniqueError) {
          return ctx.badRequest('Category with this name or slug already exists');
        }
      }
      strapi.log.error('Error creating category:', error);
      return ctx.internalServerError('Failed to create category');
    }
  },

  // Update category
  async update(ctx: Context) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;

    if (!id) {
      return ctx.badRequest('Category ID is required');
    }

    // Check if category exists
    const existingCategory = await strapi.entityService.findOne('api::category.category', id);
    if (!existingCategory) {
      return ctx.notFound('Category not found');
    }

    // Validate type if provided
    if (data.type && !['home_interior', 'office_interior'].includes(data.type)) {
      return ctx.badRequest('Invalid category type. Use "home_interior" or "office_interior"');
    }

    try {
      const entity = await strapi.entityService.update('api::category.category', id, {
        data,
        populate: {
          image: {
            fields: ['url', 'alternativeText', 'width', 'height'],
          },
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
          return ctx.badRequest('Category with this name or slug already exists');
        }
      }
      strapi.log.error('Error updating category:', error);
      return ctx.internalServerError('Failed to update category');
    }
  },

  // Delete category
  async delete(ctx: Context) {
    const { id } = ctx.params;

    if (!id) {
      return ctx.badRequest('Category ID is required');
    }

    // Check if category has associated designs
    const designCount = await strapi.entityService.count('api::design.design', {
      filters: {
        categories: {
          id: id,
        },
      },
    });

    if (designCount > 0) {
      return ctx.badRequest(`Cannot delete category. It has ${designCount} associated designs.`);
    }

    try {
      const entity = await strapi.entityService.delete('api::category.category', id);
      if (!entity) {
        return ctx.notFound('Category not found');
      }

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      strapi.log.error('Error deleting category:', error);
      return ctx.internalServerError('Failed to delete category');
    }
  },

}));
