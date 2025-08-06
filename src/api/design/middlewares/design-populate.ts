// src/api/design/middlewares/design-populate.ts
import { Context, Next } from 'koa';

export default (config: any, { strapi }: { strapi: any }) => {
  return async (ctx: Context, next: Next) => {
    ctx.query = {
      ...ctx.query,
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
    };

    await next();
  };
};
