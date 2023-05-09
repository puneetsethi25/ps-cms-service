/**
 * amnesty controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::amnesty.amnesty",
  ({ strapi }) => ({
    // Method 1: Creating an entirely custom action
    async createAmnesties(ctx) {
      try {
        // const sanitizedQueryParams = await this.sanitizeQuery(ctx);
        const result = await strapi
          .service("api::amnesty.amnesty")
          .createAmnesties(ctx.request.body);
        ctx.body = result;
      } catch (err) {
        ctx.body = err;
      }
    },
  })
);
