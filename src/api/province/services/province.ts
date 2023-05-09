/**
 * province service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::province.province",
  ({ strapi }) => ({
    async createProvinces(params) {
      const response = [];
      for (let i = 0; i < params.data?.length; i++) {
        const res = await strapi.db.query("api::province.province").create({
          data: params.data[i]
        });
        response.push(res);
      }
      return response;
    },
  })
);
