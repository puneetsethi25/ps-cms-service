export default {
  routes: [
    {
      method: "POST",
      path: "/countries/register",
      handler: "api::country.country.createCountries",
      config: {
        policies: ['plugin::content-manager.hasPermissions']
      }
    },
  ],
};
