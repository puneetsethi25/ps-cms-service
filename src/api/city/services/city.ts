/**
 * city service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::city.city", ({ strapi }) => ({
  async createCities(params) {
    const response = [];
    for (let i = 0; i < params.data?.length; i++) {
      const res = await strapi.db.query("api::city.city").create({
        data: params.data[i]
      });
      response.push(res);
    }
    return response;
  },
}));
