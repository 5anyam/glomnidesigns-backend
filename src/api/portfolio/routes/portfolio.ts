// src/api/portfolio/routes/portfolio.ts
export default {
    routes: [
      {
        method: 'GET',
        path: '/portfolios',
        handler: 'portfolio.find',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'GET',
        path: '/portfolios/:id',
        handler: 'portfolio.findOne',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'GET',
        path: '/portfolios/slug/:slug',
        handler: 'portfolio.findBySlug',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'GET',
        path: '/portfolios/search',
        handler: 'portfolio.search',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/portfolios',
        handler: 'portfolio.create',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'PUT',
        path: '/portfolios/:id',
        handler: 'portfolio.update',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'DELETE',
        path: '/portfolios/:id',
        handler: 'portfolio.delete',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  