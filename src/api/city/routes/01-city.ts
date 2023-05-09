export default {
  routes: [
    {
      method: "POST",
      path: "/cities/register",
      handler: "api::city.city.createCities",
      config: {
        policies: ['plugin::content-manager.hasPermissions']
      }
    },
  ],
};
