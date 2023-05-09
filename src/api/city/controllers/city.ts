/**
 * city controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::city.city",
  ({ strapi }) => ({
    // Method 1: Creating an entirely custom action
    async createCities(ctx) {
      try {
        // const sanitizedQueryParams = await this.sanitizeQuery(ctx);
        const result = await strapi
          .service("api::city.city")
          .createCities(ctx.request.body);
        ctx.body = result;
      } catch (err) {
        ctx.body = err;
      }
    },
  })
);
