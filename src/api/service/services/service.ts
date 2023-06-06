/**
 * service service
 */

import { factories } from '@strapi/strapi';

//export default factories.createCoreService('api::service.service');


export default factories.createCoreService(
    "api::service.service",
    ({ strapi }) => ({
      async createServices(params) {
        const response = await strapi.db
          .query("api::service.service")
          .createMany({
            data: params.data,
          });
        return response;
      },
    })
  );