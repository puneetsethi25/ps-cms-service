/**
 * care-home controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::care-home.care-home",
  ({ strapi }) => ({
    // Method 1: Creating an entirely custom action
    async createCareHomes(ctx) {
      try {
        const sanitizedQueryParams = await this.sanitizeQuery(ctx);
        const result = await strapi
          .service("api::care-home.care-home")
          .createCareHomes(ctx.request.body);
        ctx.body = result;
      } catch (err) {
        ctx.body = err;
      }
    },
    async createCareManagers(ctx) {
      try {
        // const sanitizedDataParams = await this.sanitizeInput(ctx);
        const result = await strapi
          .service("api::care-home.care-home")
          .createCareManagers(ctx.request.body);
        ctx.body = result;
      } catch (err) {
        ctx.body = err;
      }
    },
    async createCareWorkers(ctx) {
      try {
        // const sanitizedDataParams = await this.sanitizeInput(ctx);
        const result = await strapi
          .service("api::care-home.care-home")
          .createCareWorkers(ctx.request.body);
        ctx.body = result;
      } catch (err) {
        ctx.body = err;
      }
    },
  })
);
