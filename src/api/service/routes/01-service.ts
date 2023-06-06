export default {
  routes: [
    {
      method: "POST",
      path: "/services/register",
      handler: "api::service.service.createServices",
      config: {
        policies: ['plugin::content-manager.hasPermissions']
      }
    },
  ],
};
