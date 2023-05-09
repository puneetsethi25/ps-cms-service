import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::country.country",
  ({ strapi }) => ({
    // Method 1: Creating an entirely custom action
    async createCountries(ctx) {
      try {
        // const sanitizedQueryParams = await this.sanitizeQuery(ctx);
        const result = await strapi
          .service("api::country.country")
          .createCountries(ctx.request.body);
        ctx.body = result;
      } catch (err) {
        ctx.body = err;
      }
    },
  })
);
