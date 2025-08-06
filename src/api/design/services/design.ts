// src/api/design/services/design.ts
import { factories } from '@strapi/strapi';
import { Design, Category, EntityServiceReturn } from '../../../../types';

export default factories.createCoreService('api::design.design', ({ strapi }) => ({

  // Get designs with complex filtering
  async findWithFilters(filters: any): Promise<EntityServiceReturn<Design>[]> {
    const results = await strapi.entityService.findMany('api::design.design', {
      filters,
      populate: {
        categories: {
          fields: ['name', 'slug', 'type'],
        },
        images: {
          fields: ['url', 'alternativeText', 'width', 'height'],
        },
        featured_image: {
          fields: ['url', 'alternativeText', 'width', 'height'],
        },
      },
    });

    return results as EntityServiceReturn<Design>[];
  },

  // Get related designs based on categories
  async findRelated(designId: number, limit: number = 4): Promise<EntityServiceReturn<Design>[]> {
    const design = await strapi.entityService.findOne('api::design.design', designId, {
      populate: {
        categories: {
          fields: ['id', 'name', 'slug', 'type'],
        },
      },
    }) as EntityServiceReturn<Design>;

    if (!design || !design.categories || design.categories.length === 0) {
      return [];
    }

    const categoryIds = design.categories.map((cat: Category) => cat.id);

    const results = await strapi.entityService.findMany('api::design.design', {
      filters: {
        $and: [
          {
            categories: {
              id: {
                $in: categoryIds,
              },
            },
          },
          {
            id: {
              $ne: designId,
            },
          },
        ],
      },
      populate: {
        categories: {
          fields: ['name', 'slug', 'type'],
        },
        images: {
          fields: ['url', 'alternativeText', 'width', 'height'],
        },
        featured_image: {
          fields: ['url', 'alternativeText', 'width', 'height'],
        },
      },
      pagination: {
        limit,
      },
    });

    return results as EntityServiceReturn<Design>[];
  },

  // Transform entity service result to clean Design type
  transformToDesign(entity: any): Design {
    return {
      id: entity.id,
      documentId: entity.documentId,
      title: entity.title,
      description: entity.description,
      images: entity.images || [],
      featured_image: entity.featured_image,
      price_range: entity.price_range,
      style: entity.style,
      area_size: entity.area_size,
      location: entity.location,
      completion_time: entity.completion_time,
      tags: entity.tags,
      is_featured: entity.is_featured || false,
      slug: entity.slug,
      categories: entity.categories || [],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      publishedAt: entity.publishedAt,
      locale: entity.locale,
    };
  },

  // Transform array of entities
  transformMultipleToDesigns(entities: any[]): Design[] {
    return entities.map(entity => this.transformToDesign(entity));
  },

  // Generate slug from title
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  },

  // Validate design data before create/update
  validateDesignData(data: Partial<Design>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.title || data.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!data.slug || data.slug.trim().length === 0) {
      errors.push('Slug is required');
    }

    if (data.area_size && (data.area_size < 0 || data.area_size > 10000)) {
      errors.push('Area size must be between 0 and 10000 sq ft');
    }

    if (data.style && !['modern', 'traditional', 'contemporary', 'minimalist', 'luxury'].includes(data.style)) {
      errors.push('Invalid style value');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

}));
