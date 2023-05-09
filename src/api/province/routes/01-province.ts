export default {
  routes: [
    {
      method: "POST",
      path: "/provinces/register",
      handler: "api::province.province.createProvinces",
      config: {
        policies: ['plugin::content-manager.hasPermissions']
      }
    },
  ],
};
