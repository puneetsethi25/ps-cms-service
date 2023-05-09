/**
 * country service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::country.country",
  ({ strapi }) => ({
    async createCountries(params) {
      const response = await strapi.db
        .query("api::country.country")
        .createMany({
          data: params.data,
        });
      return response;
    },
  })
);
