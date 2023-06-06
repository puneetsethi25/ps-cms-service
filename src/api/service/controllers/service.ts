/**
 * service controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController(
    "api::service.service",
    ({ strapi }) => ({
      // Method 1: Creating an entirely custom action
      async createServices(ctx) {
        try {
          // const sanitizedQueryParams = await this.sanitizeQuery(ctx);
          const result = await strapi
            .service("api::service.service")
            .createServices(ctx.request.body);
          ctx.body = result;
        } catch (err) {
          ctx.body = err;
        }
      },
    })
  );
  