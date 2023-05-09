export default {
  routes: [
    {
      method: 'POST',
      path: '/care-homes/register',
      handler: 'api::care-home.care-home.createCareHomes',
      config: {
        policies: ['plugin::content-manager.hasPermissions']
      }
    },
    {
      method: 'POST',
      path: '/care-homes/register/care-manager',
      handler: 'api::care-home.care-home.createCareManagers',
      config: {
        policies: ['plugin::content-manager.hasPermissions']
      }
    },
    {
      method: 'POST',
      path: '/care-homes/register/care-worker',
      handler: 'api::care-home.care-home.createCareWorkers',
      config: {
        policies: ['plugin::content-manager.hasPermissions']
      }
    }
  ],
}