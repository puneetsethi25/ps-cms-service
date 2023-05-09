/**
 * province controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::province.province",
  ({ strapi }) => ({
    // Method 1: Creating an entirely custom action
    async createProvinces(ctx) {
      try {
        // const sanitizedQueryParams = await this.sanitizeQuery(ctx);
        const result = await strapi
          .service("api::province.province")
          .createProvinces(ctx.request.body);
        ctx.body = result;
      } catch (err) {
        ctx.body = err;
      }
    },
  })
);
