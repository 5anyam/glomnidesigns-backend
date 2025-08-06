// src/api/portfolio/services/portfolio.ts
import { factories } from '@strapi/strapi';
import { Portfolio, EntityServiceReturn } from '../../../../types';

export default factories.createCoreService('api::portfolio.portfolio', ({ strapi }) => ({
  // Get portfolios with filters
  async findWithFilters(filters: any): Promise<EntityServiceReturn<Portfolio>[]> {
    const results = await strapi.entityService.findMany('api::portfolio.portfolio', {
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

    return results as EntityServiceReturn<Portfolio>[];
  },
  // Generate unique slug
  async generateUniqueSlug(name: string, excludeId?: number): Promise<string> {
    let baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    let slug = baseSlug;
    let counter = 1; 

    while (true) {
      const existingPortfolio = await strapi.entityService.findMany('api::portfolio.portfolio', {
        filters: {
          slug: slug,
          ...(excludeId && { id: { $ne: excludeId } }),
        },
      });

      if (existingPortfolio.length === 0) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  },

  // Validate portfolio data
  validatePortfolioData(data: Partial<Portfolio>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (!data.slug || data.slug.trim().length === 0) {
      errors.push('Slug is required');
    }

    // Validate slug format
    if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
      errors.push('Slug can only contain lowercase letters, numbers, and hyphens');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Get portfolio statistics
  async getPortfolioStats(): Promise<any> {
    const totalPortfolios = await strapi.entityService.count('api::portfolio.portfolio');
    
    const portfoliosWithImages = await strapi.entityService.findMany('api::portfolio.portfolio', {
      populate: {
        images: true,
      },
    });

    const totalImages = portfoliosWithImages.reduce((acc: number, portfolio: any) => {
      return acc + (portfolio.images ? portfolio.images.length : 0);
    }, 0);

    return {
      total_portfolios: totalPortfolios,
      total_images: totalImages,
      average_images_per_portfolio: totalPortfolios > 0 ? Math.round(totalImages / totalPortfolios) : 0,
    };
  },

}));
