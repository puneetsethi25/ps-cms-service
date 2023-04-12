export default {
  routes: [
    {
      method: 'POST',
      path: '/care-homes/register',
      handler: 'api::care-home.care-home.exampleAction',
      config: {
        auth: false,
      },
      // config: {
      //   policies: [
      //     // point to a registered policy
      //     'policy-name',

      //     // point to a registered policy with some custom configuration
      //     { name: 'policy-name', config: {} }, 

      //     // pass a policy implementation directly
      //     (policyContext, config, { strapi }) => {
      //       return true;
      //     },
      //   ]
      // },
    },
  ],
}