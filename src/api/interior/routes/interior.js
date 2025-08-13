'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/services',
      handler: 'service.find',
      config: {
        auth: false,
      }
    },
    {
      method: 'GET',
      path: '/services/:id',
      handler: 'service.findOne',
      config: {
        auth: false,
      }
    },
    {
      method: 'GET',
      path: '/services/featured/list',
      handler: 'service.findFeatured',
      config: {
        auth: false,
      }
    },
    {
      method: 'GET',
      path: '/services/popular/list',
      handler: 'service.findPopular',
      config: {
        auth: false,
      }
    },
    {
      method: 'GET',
      path: '/services/slug/:slug',
      handler: 'service.findBySlug',
      config: {
        auth: false,
      }
    },
    {
      method: 'GET',
      path: '/services/category/:categorySlug',
      handler: 'service.findByCategory',
      config: {
        auth: false,
      }
    }
  ]
};

