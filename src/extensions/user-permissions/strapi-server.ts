// src/extensions/users-permissions/strapi-server.ts
export default (plugin: any) => {
    // Add custom routes to user permissions
    plugin.routes['content-api'].routes.push({
      method: 'GET',
      path: '/designs/user/:userId',
      handler: 'design.findByUser',
      config: {
        policies: ['plugins::users-permissions.isOwner'],
      },
    });
  
    return plugin;
  };
  