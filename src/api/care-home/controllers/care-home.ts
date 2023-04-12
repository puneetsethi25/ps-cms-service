/**
 * care-home controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::care-home.care-home",
  ({ strapi }) => ({
    // Method 1: Creating an entirely custom action
    async exampleAction(ctx) {
      try {
        const sanitizedQueryParams = await this.sanitizeQuery(ctx);
        const sanitizedDataParams = await this.sanitizeInput(ctx);
        const result = await strapi.service('api::care-home.care-home').createCareHome(ctx.request.body);
        console.log('ctx===>', sanitizedQueryParams);
        console.log('sanitizedDataParams===>', ctx.request.body);
        console.log('result===>', result);
        ctx.body = result;
      } catch (err) {
        ctx.body = err;
      }
    },
  })
);
