// src/api/category/routes/category.ts
export default {
    routes: [
      {
        method: 'GET',
        path: '/categories',
        handler: 'category.find',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'GET',
        path: '/categories/:id',
        handler: 'category.findOne',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'GET',
        path: '/categories/type/:type',
        handler: 'category.findByType',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'GET',
        path: '/categories/with-count',
        handler: 'category.findWithDesignCount',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  