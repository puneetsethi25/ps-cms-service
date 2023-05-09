export default {
  routes: [
    {
      method: "POST",
      path: "/amnesties/register",
      handler: "api::city.city.createCities",
      config: {
        policies: ['plugin::content-manager.hasPermissions']
      }
    },
  ],
};
