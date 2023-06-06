/**
 * care-home service
 */
import { factories } from "@strapi/strapi";
import AWS from 'aws-sdk';

interface BulkCreateRes {
  count: number;
  ids?: number[];
}

const config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  region: process.env.AWS_REGION,
  rootPath: process.env.AWS_FOLDER,
}
const S3 = new AWS.S3({
  apiVersion: '2006-03-01',
  ...config,
});


function getSignedUrl(
  name: string,
  attachmentType: string,
  type: string,
  carehomeId: string) {

  const root = process.env.AWS_FOLDER !== undefined
    ? `${process.env.AWS_FOLDER}/`
    : '';
  return S3.getSignedUrl(
    'getObject',
    {
      Bucket: process.env.AWS_BUCKET,
      Key: `${root}${attachmentType}/${type}/${carehomeId}/${name}`,
      Expires: 30 * 60, // 30 minutes
    });
}

async function uploadToS3(contentType: string,
  name: string,
  attachmentType: string,
  type: string,
  content: string) {

  let fileContent = Buffer.from(content.replace(/^data:application\/\w+;base64,/, ''), 'base64');
  const root = process.env.AWS_FOLDER !== undefined
    ? `${process.env.AWS_FOLDER}/`
    : '';
  const params = {
    Key: `${root}${type.toLowerCase()}/${name}.${attachmentType}`,
    Bucket: process.env.AWS_BUCKET,
    Body: fileContent,
    ContentType: contentType,
    ContentEncoding: 'base64',
    ContentDisposition: 'inline',
  };

  S3.upload(params)
  return
}

function getCityInfo(data) {
  return {
    id: data.id,
    name: data.name,
    province_id: data.province.id,
    country_id: data.country.id,
  };
}

function findNewAmenities(fullSet = [], existing = []) {
  const existingNames = existing.map((data) => {
    return data.name;
  });
  const newAmenities = fullSet.map((data) => {
    if (existingNames.includes(!data?.name)) {
      return {
        name: data,
        description: data,
        published_at: new Date(),
      };
    }
    return;
  });

  return newAmenities;
}

export default factories.createCoreService(
  "api::care-home.care-home",
  ({ strapi }) => ({
    async getCareHomesDetails({ params, query }) {
      const response: any = await strapi.db
        .query("api::care-home.care-home")
        .findOne({
          // select: [
          //   "id",
          //   "name",
          //   "about",
          //   "mission_statement",
          //   "procedures",
          //   "phone_number",
          // ],
          where: { id: params.id, isDeleted: false, status: "Active" },
          populate: [
            "cover_photo_name",
            "services",
            "medicalSpecializations",
            "genderPreferences",
            "careManagers",
            "careWorkers",
            "address",
            "lifeStyle"],
        });
      
      let care_managers:any[] = [];
      if (query?.populate.includes("careManagers") || query?.populate.includes("*")) {
        care_managers = await strapi.db
          .query("api::care-manger.care-manger")
          .findMany({
            where: {
              careHome: params.id,
            },
          });
      }

      let care_worker:any[] = [];
      if (query?.populate.includes("careWorkers") || query?.populate.includes("*")) {
        care_worker = await strapi.db
          .query("api::care-worker.care-worker")
          .findMany({
            where: {
              careHome: params.id,
              isDeleted: false,
              status: "Active",
            },
          });
      }
      response.workers = [...care_worker, ...care_managers];

      //add images to workers
      if (response.workers !== undefined &&
        response.workers !== null) {
        response.workers.forEach(element => {
          element.imageUrl = getSignedUrl(`${element.image}`,
            "Images",
            "worker",
            params.id);
        });
      }

      if (query?.populate.includes("lifeStyle") || query?.populate.includes("*")) {
        response.lifeStyle = await strapi.db
          .query("api::life-style.life-style")
          .findMany({
            where: {
              careHome: params.id,
              isDeleted: false,
              status: "Active",
            },
          });
      }

      //add images to lifeStyle
      if (response.lifeStyle !== undefined &&
        response.lifeStyle !== null) {
        response.lifeStyle.forEach(element => {
          element.imageUrl = getSignedUrl(`${element.image}`,
            "Images",
            "suite",
            params.id);
        });
      }


      if (query?.populate.includes("gallery") || query?.populate.includes("*")) {
        response.gallery = await strapi.db
          .query("api::gallery.gallery")
          .findMany({
            where: {
              careHome: params.id,
              isDeleted: false,
              status: "Active",
            },
          });
      }

      if (response.gallery !== undefined &&
        response.gallery !== null) {
        response.gallery.forEach(element => {
          element.imageUrl = getSignedUrl(`${element.image}`,
            "Images",
            "gallery",
            params.id);
        });
      }


      if (query?.populate.includes("testimonials") || query?.populate.includes("*")) {
        response.testimonials = await strapi.db
          .query("api::testimonial.testimonial")
          .findMany({
            where: {
               careHome: params.id,
              isDeleted: false,
              status: "Active",
            },
          });
      }

      // if (query?.populate.includes("care_home_attachments") || query?.populate.includes("*")) {
      //   response.care_home_attachments = await strapi.db
      //     .query("api::care-home-attachment.care-home-attachment")
      //     .findMany({
      //       where: {
      //         careHome: params.id,
      //         isDeleted: false,
      //         // status: "Active",
      //       },
      //     }).catch((error) => {
      //       console.log(error);
      //     });
      // }

      // //add images to care_home_attachments
      // if (response.care_home_attachments !== undefined &&
      //   response.care_home_attachments !== null) {
      //   response.care_home_attachments.forEach(element => {
      //     element.docUrl = getSignedUrl(element.name,
      //       element.attachmentType,
      //       element.type,
      //       params.id);
      //   });
      // }

      //add images to service
      if (response.services !== undefined &&
        response.services !== null) {
        response.services.forEach(element => {
          element['imageUrl'] = getSignedUrl(`${element.image}`,
            'Images',
            'service',
            params.id);
        });
      }

      //add cover image
      response['cover_photo'] = getSignedUrl(response['cover_photo_name'],
        'Images',
        'cover',
        params.id);

        response['imageUrl'] = getSignedUrl(response['profile'],
        'Images',
        'profile',
        params.id);
      return response;
    },

    async createCareHomes(params) {
      const failedOperations = [];
      const finalData = params?.data?.map(async (data) => {
        return new Promise((resolve, reject) => {
          // they will implicitly use the transaction
          strapi.db.transaction(async () => {
            /* 1. Fetch or create associated amenities or service*/
            // a. Fetch amenities or service
            if (data?.services?.length > 0) {
              // const response: any = await strapi.entityService.findMany(
              //   "api::amnesty.amnesty",
              //   {
              //     filters: {
              //       name: {
              //         $in: data.services,
              //       },
              //     },
              //   }
              // );
              // const addNewServices = findNewAmenities(
              //   data.services,
              //   response
              // );
              // const newServicesResponse = await strapi.db
              //   .query("api::amnesty.amnesty")
              //   .createMany({ data: addNewServices });
            }

            /* 2.Insert care home details */
            // a. insert care home details
            const _data = { ...data };
            delete _data['care_managers']
            delete _data['care_workers']
            delete _data['lifeStyle']
            delete _data['testimonials']
            delete _data['gallery']
            const careHomeRes = await super.create({ data: _data });

            // b. Insert care home address
            if (data?.address?.city) {
              const response = await strapi.db.query("api::city.city").findOne({
                where: { name: { $eqi: data?.address?.city } },
                populate: ["province", "country"],
              });


              if (!response) {
                failedOperations.push(data);
                reject(data);
                // return;
              } else {
                const cityDetails = getCityInfo(response);
                const {
                  addressOne = "",
                  addressTwo = "",
                  lat = 0,
                  lng = 0,
                  postalCode = "",
                } = data?.address;

                const address = {
                  addressOne,
                  addressTwo,
                  lat,
                  lng,
                  city: cityDetails.id ?? null,
                  postalCode,
                  province: cityDetails.province_id ?? null,
                  isDeleted: true,
                  careHome: careHomeRes.id,
                };
                await strapi
                  .service("api::care-home-address.care-home-address")
                  .create({
                    data: address,
                  }).then(async (res) => {
                    // add address relation in carehome
                    await strapi
                      .entityService
                      .update("api::care-home.care-home", careHomeRes.id, { data: { address: res.id } })
                  });

                careHomeRes.address = address ?? {};
              }
            }

            /* 3. Insert care managers details associated with care home*/
            // a. insert care managers details
            const careManagers = [];
            for (let i = 0; i < data?.care_managers?.length; i++) {
              try {
                const careManagerRes = await strapi
                  .service("api::care-manger.care-manger")
                  .create({
                    data: {
                      ...data?.care_managers[i],
                      careHome: `${careHomeRes.id}`,
                    },
                  });

                // b. insert care manager address
                if (data?.care_managers?.[i]?.address?.city) {
                  const response = await strapi.db
                    .query("api::city.city")
                    .findOne({
                      where: {
                        name: { $eqi: data?.care_managers?.[i]?.address?.city },
                      },
                      populate: ["province", "country"],
                    });

                  if (!response) {
                    failedOperations.push(data);
                    reject(data);
                    // return;
                  } else {
                    const cityDetails = getCityInfo(response);
                    const {
                      addressOne = "",
                      addressTwo = "",
                      lat = 0,
                      lng = 0,
                      postalCode = "",
                    } = data?.address;

                    const address = {
                      addressOne,
                      addressTwo,
                      lat,
                      lng,
                      city: cityDetails.id ?? null,
                      postalCode,
                      province: cityDetails.province_id ?? null,
                      isDeleted: true,
                      care_manger: `${careManagerRes.id}`,
                    };
                    const careManagersAddress = await strapi
                      .service("api::care-manager-address.care-manager-address")
                      .create({
                        data: address,
                      });

                    careManagerRes.address = careManagersAddress ?? {};
                  }
                }

                // c. insert care manager experience
                let careManagerExp = [];
                for (
                  let j = 0;
                  j < data?.care_managers?.[i]?.experience?.length;
                  j++
                ) {
                  const expRes = await strapi
                    .service("api::care-users-experience.care-users-experience")
                    .create({
                      data: {
                        ...data?.care_managers[i].experience[j],
                        care_manger: `${careManagerRes.id}`,
                      },
                    });
                  careManagerExp.push(expRes);
                }
                careManagerRes.experience = careManagerExp ?? [];

                careManagers.push(careManagerRes);
              } catch (error) {
                failedOperations.push(data);
                reject(error);
              }
            }

            /* 4. Insert care workers details associated with care home */
            // a. Map care workers with came home id and insert care workers table
            const careWorkers = [];
            for (let i = 0; i < data?.care_workers?.length; i++) {
              try {
                const careWorkersRes = await strapi
                  .service("api::care-worker.care-worker")
                  .create({
                    data: {
                      ...data.care_workers[i],
                      careHome: careHomeRes.id,
                    },
                  });

                // b. insert care worker address
                if (data?.care_workers?.[i]?.address?.city) {
                  const response = await strapi.db
                    .query("api::city.city")
                    .findOne({
                      where: {
                        name: { $eqi: data?.care_workers?.[i]?.address?.city },
                      },
                      populate: ["province", "country"],
                    });

                  if (!response) {
                    failedOperations.push(data);
                    reject(data);
                    // return;
                  } else {
                    const cityDetails = getCityInfo(response);
                    const {
                      addressOne = "",
                      addressTwo = "",
                      lat = 0,
                      lng = 0,
                      postalCode = "",
                    } = data?.address;

                    const address = {
                      addressOne,
                      addressTwo,
                      lat,
                      lng,
                      city: cityDetails.id ?? null,
                      postalCode,
                      province: cityDetails.province_id ?? null,
                      isDeleted: true,
                      care_worker: `${careWorkersRes.id}`,
                    };
                    const careWorkersAddress = await strapi
                      .service("api::care-worker-address.care-worker-address")
                      .create({
                        data: address,
                      });
                    careWorkersRes.address = careWorkersAddress;
                  }
                }

                // c. insert care worker experience
                let careWorkerExp = [];
                for (
                  let j = 0;
                  j < data?.care_managers?.[i]?.experience?.length;
                  j++
                ) {
                  const expResult = await strapi
                    .service(
                      "api::care-worker-experience.care-worker-experience"
                    )
                    .create({
                      data: {
                        ...data.care_workers[i].experience[j],
                        care_worker: `${careWorkersRes.id}`,
                      },
                    });
                  careWorkerExp.push(expResult);
                }
                careWorkersRes.experience = careWorkerExp;
                careWorkers.push(careWorkersRes);
              } catch (error) {
                failedOperations.push(data);
                reject(error);
              }
            }

            // adding suites
            for (let i = 0; i < data?.lifeStyle?.length; i++) {
              try {
                const carehome_suites = await strapi
                  .service("api::life-style.life-style")
                  .create({
                    data: {
                      ...data?.lifeStyle[i],
                      careHome: `${careHomeRes.id}`,
                    },
                  });
              } catch (error) {
                failedOperations.push(data);
                reject(error);
              }
            }

            // adding testimonials
            for (let i = 0; i < data?.testimonials?.length; i++) {
              try {
                const testimonials = await strapi
                  .service("api::testimonial.testimonial")
                  .create({
                    data: {
                      ...data?.testimonials[i],
                      careHome: `${careHomeRes.id}`,
                    },
                  });
              } catch (error) {
                failedOperations.push(data);
                reject(error);
              }
            }

            // adding gallery
            for (let i = 0; i < data?.gallery?.length; i++) {
              try {
                const gallery = await strapi
                  .service("api::gallery.gallery")
                  .create({
                    data: {
                      ...data?.gallery[i],
                      careHome: `${careHomeRes.id}`,
                    },
                  });
              } catch (error) {
                failedOperations.push(data);
                reject(error);
              }
            }

            // adding carehome attachments
            for (let i = 0; i < data?.care_home_attachments?.length; i++) {
              try {
                const care_home_attachment = await strapi
                  .service("api::care_home_attachment.care_home_attachment")
                  .create({
                    data: {
                      ...data?.care_home_attachments[i],
                      careHome: `${careHomeRes.id}`,
                    },
                  })
                // .then(async () => {
                //   const { contentType, name, attachmentType, type, content } = data?.care_home_attachments[i];
                //   await uploadToS3(contentType, name, attachmentType, type, content);
                // });
              } catch (error) {
                failedOperations.push(data);
                reject(error);
              }
            }

            careHomeRes.care_manager = careManagers;
            careHomeRes.care_worker = careWorkers;
            resolve(careHomeRes);
            // successCareHomes.push(careHomeRes);
          });
        }).catch((error) => console.log("error===>", error));
        // return successCareHomes;
      });

      return Promise.all(finalData)
        .then((values) => {
          return {
            success: values.filter((data) => data),
            failed: failedOperations.filter((data) => data),
          };
        })
        .catch((error) => {
          throw error;
        });
    },

    async createCareManagers(params) {
      const successCareHomes = [];
      return new Promise((resolve, reject) => {
        try {
          params?.map(async (data) => {
            // they will implicitly use the transaction
            strapi.db.transaction(async () => {
              /* 1.Fetch care home details */
              // a. Fetch care home details
              // const careHomeRes = await super.find(params);
              const careHomeRes = await strapi.db
                .query("api::care-home.care-home")
                .findOne({
                  select: ["name", "id"],
                  where: { id: data.care_home_id },
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
              }
              successCareHomes.push(careHomeRes);
            });
            resolve(successCareHomes);
          });
        } catch (error) {
          reject(error);
        }
      });
    },

    async createCareWorkers(params) {
      const successCareHomes = [];
      return new Promise((resolve, reject) => {
        try {
          params?.map(async (data) => {
            // they will implicitly use the transaction
            strapi.db.transaction(async () => {
              /* 1.Fetch care home details */
              // a. Fetch care home details
              // const careHomeRes = await super.find(params);
              const careHomeRes = await strapi.db
                .query("api::care-home.care-home")
                .findOne({
                  select: ["name", "id"],
                  where: { id: data.care_home_id },
                });

              /* 2. Insert care workers details associated with care home */
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
              successCareHomes.push(careHomeRes);
            });
            resolve(successCareHomes);
          });
        } catch (error) {
          reject(error);
        }
      });
    },
  })
);
