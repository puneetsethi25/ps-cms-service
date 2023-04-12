/**
 * care-home service
 */
import { factories } from "@strapi/strapi";

interface BulkCreateRes {
  count: number;
  ids?: number[];
}

export default factories.createCoreService(
  "api::care-home.care-home",
  ({ strapi }) => ({
    async createCareHome(params) {
      const successCareHomes = [];
      return new Promise((resolve, reject) => {
        try {
          params?.map(async (data) => {
            // they will implicitly use the transaction
            strapi.db.transaction(async () => {
          
              /* 1.Insert care home details */
              // a. insert care home details
              const careHomeRes = await super.create({ data: data });
              console.log(careHomeRes.id);

              // b. Insert care home address
              await strapi
                .service("api::care-home-address.care-home-address")
                .create({
                  data: { ...data.address, care_home: `${careHomeRes.id}` },
                });

              /* 2. Insert care managers details associated with care home*/
              // a. insert care managers details
              for (let i = 0; i < data?.care_managers.length; i++) {
                const careManagerRes = await strapi
                  .service("api::care-manger.care-manger")
                  .create({
                    data: {
                      ...data?.care_managers[0],
                      care_home: `${careHomeRes.id}`,
                    },
                  });

                // b. insert care manager address
                await strapi
                  .service("api::care-manager-address.care-manager-address")
                  .create({
                    data: {
                      ...data?.care_managers[0]?.address,
                      care_manger: `${careManagerRes.id}`,
                    },
                  });
                // c. insert care manager experience
                for (
                  let j = 0;
                  j < data?.care_managers[i].experience.length;
                  j++
                ) {
                  await strapi
                    .service("api::care-users-experience.care-users-experience")
                    .create({
                      data: {
                        ...data?.care_managers[i].experience[j],
                        care_manger: `${careManagerRes.id}`,
                      },
                    });
                }

                console.log("careManagerRes-->", careManagerRes);
              }

              /* 3. Insert care workers details associated with care home */
              // a. Map care workers with came home id and insert care workers table
              for (let i = 0; i < data?.care_workers.length; i++) {
                const careWorkersRes = await strapi
                  .service("api::care-worker.care-worker")
                  .create({
                    data: {
                      ...data?.care_workers[i],
                      care_home: careHomeRes.id,
                    },
                  });
                // b. insert care worker address
                await strapi
                  .service("api::care-worker-address.care-worker-address")
                  .create({
                    data: {
                      ...data?.care_workers[i]?.address,
                      care_worker: careWorkersRes?.id,
                    },
                  });
                // c. insert care worker experience
                for (
                  let j = 0;
                  j < data?.care_managers[i].experience.length;
                  j++
                ) {
                  await strapi
                    .service(
                      "api::care-worker-experience.care-worker-experience"
                    )
                    .create({
                      data: {
                        ...data?.care_workers[i].experience[j],
                        care_worker: `${careWorkersRes.id}`,
                      },
                    });
                }
              }
              console.log("careHomeRes-->", careHomeRes);
              successCareHomes.push(careHomeRes);
            });
            resolve(successCareHomes);
          });
        } catch (error) {
          reject(error);
          console.log("error==>", error);
        }
      });
    },
  })
);
