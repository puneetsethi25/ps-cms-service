export default {
    routes: [
      {
        method: "POST",
        path: "/care-home-addresses/register",
        handler: "api::care-home-address.care-home-address.createCareHomesAddress",
        config: {
          policies: ['plugin::content-manager.hasPermissions']
        }
      },
    ],
  };
  