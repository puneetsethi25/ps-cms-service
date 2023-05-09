/**
 * amnesty service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::amnesty.amnesty",
  ({ strapi }) => ({
    async createAmnesties(params) {
      const response = await strapi.db
        .query("api::amnesty.amnesty")
        .createMany({
          data: params.data,
        });
      return response;
    },
  })
);
