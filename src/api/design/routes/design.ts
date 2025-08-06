// src/api/design/routes/design.ts
export default {
    routes: [
      {
        method: 'GET',
        path: '/designs',
        handler: 'design.find',
        config: {
          policies: [],
          middlewares: ['api::design.design-populate'],
        },
      },
      {
        method: 'GET',
        path: '/designs/:id',
        handler: 'design.findOne',
        config: {
          policies: [],
          middlewares: ['api::design.design-populate'],
        },
      },
      {
        method: 'GET',
        path: '/designs/category/:categorySlug',
        handler: 'design.findByCategory',
        config: {
          policies: [],
          middlewares: ['api::design.design-populate'],
        },
      },
      {
        method: 'GET',
        path: '/designs/featured',
        handler: 'design.findFeatured',
        config: {
          policies: [],
          middlewares: ['api::design.design-populate'],
        },
      },
      {
        method: "GET",
        path: "/designs/slug/:slug",
        handler: "design.findBySlug", // IMPORTANT: Handler name sahi likho
        config: {
          policies: [],
          middlewares: [],
        }
      },
      {
        method: 'GET',
        path: '/designs/search',
        handler: 'design.search',
        config: {
          policies: [],
          middlewares: ['api::design.design-populate'],
        },
      },
      {
        method: 'POST',
        path: '/designs',
        handler: 'design.create',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'PUT',
        path: '/designs/:id',
        handler: 'design.update',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'DELETE',
        path: '/designs/:id',
        handler: 'design.delete',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  