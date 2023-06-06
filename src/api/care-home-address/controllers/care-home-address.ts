/**
 * care-home-address controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController(
    'api::care-home-address.care-home-address', 
    ({ strapi }) => ({
        async createCareHomesAddress(ctx) {
            try {
              // const sanitizedQueryParams = await this.sanitizeQuery(ctx);
              const result = await strapi
                .service("api::care-home-address.care-home-address")
                .createCareHomesAddress(ctx.request.body);
              ctx.body = result;
            } catch (err) {
              ctx.body = err;
            }
          },
    }));
