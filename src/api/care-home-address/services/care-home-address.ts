/**
 * care-home-address service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::care-home-address.care-home-address",
  ({ strapi }) => ({
    async createCareHomesAddress(params) {
      try {
        const response = [];
        for (let i = 0; i < params.data?.length; i++) {
          const res = await strapi.db
            .query("api::care-home-address.care-home-address")
            .create({ data: params.data[i] });
          response.push(res);
        }
        return response
      } catch (error) {
        console.log("error==>", error);
      }
    },
  })
);
