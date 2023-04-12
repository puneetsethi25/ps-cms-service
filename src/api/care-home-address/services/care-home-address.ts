/**
 * care-home-address service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::care-home-address.care-home-address",
  ({ strapi }) => ({
    async createCareHomeAddress(params) {
      console.log("1234 createCareHomeAddress");
      try {
        await super.create({ data: params });
      } catch (error) {
        console.log("error==>", error);
      }
    },
  })
);
