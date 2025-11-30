/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import type {
  BusData,
  BusInfo,
  BusMetadata,
  GeoLocation,
  PaginationMetaData,
  RouteData,
  RouteMeta,
  StopPointsMeta,
  StudentInfoReqAssignmetStop,
  StudentMetadata,
  TimeTable,
} from "./data-contracts";
import { ContentType, HttpClient, type RequestParams } from "./http-client";

export class Api<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**

 * No description
 *
 * @tags AuthController
 * @name Register
 * @summary Register
 * @request POST:/api/auth/register*/

  /**
   */

  register = (
    data: {
      username: string;
      password: string;
      /**
       * @format email
       * @pattern ^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$
       */
      email: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          /**
           * @format uuid
           * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
           */
          id: string;
          username: string;
          /**
           * @format email
           * @pattern ^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$
           */
          email: string;
          roles: string[];
        };
      },
      {
        /**
         * HTTP status code of the error
         * @min 400
         * @max 599
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        /** Error class name */
        name?: string;
      }
    >({
      path: `/api/auth/register`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags AuthController
 * @name Login
 * @summary Login
 * @request POST:/api/auth/login*/

  /**
   */

  login = (
    data: {
      username: string;
      password: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          id: string;
          username: string;
          email: string;
          roles: string[];
          permissions: string[];
          accessToken: string;
          refreshToken: string;
        };
      },
      {
        /**
         * HTTP status code of the error
         * @min 400
         * @max 599
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        /** Error class name */
        name?: string;
      }
    >({
      path: `/api/auth/login`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags AuthController
 * @name RefreshToken
 * @summary Refresh Token
 * @request POST:/api/auth/refresh*/

  /**
   */

  refreshToken = (
    data: {
      refreshToken: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          accessToken: string;
        };
      },
      {
        /**
         * HTTP status code of the error
         * @min 400
         * @max 599
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        /** Error class name */
        name?: string;
      }
    >({
      path: `/api/auth/refresh`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags AuthController
 * @name GetUserProfile
 * @summary Get User Profile
 * @request GET:/api/auth/profile
 * @secure*/

  /**
   */

  getUserProfile = (params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/auth/profile`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags AuthController
 * @name AuthAdminChangePasswordCreate
 * @request POST:/api/auth/admin/change-password*/

  /**
   */

  authAdminChangePasswordCreate = (
    data: {
      email: string;
      password: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
      },
      {
        /**
         * HTTP status code of the error
         * @min 400
         * @max 599
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        /** Error class name */
        name?: string;
      }
    >({
      path: `/api/auth/admin/change-password`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags BusesController
 * @name GetAllBuses
 * @summary Get all buses
 * @request GET:/api/buses/
 * @secure*/

  /**
   */

  getAllBuses = (
    query?: {
      /** Search term to filter results */
      search?: string;
      /**
       * Page number, minimum is 1
       * @min 1
       * @default 1
       */
      page?: number;
      /**
       * Number of items per page, minimum is 1 and maximum is 100
       * @min 1
       * @max 100
       * @default 10
       */
      limit?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          data: BusData[];
          meta: PaginationMetaData;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/buses/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags BusesController
 * @name CreateANewBus
 * @summary Create a new bus
 * @request POST:/api/buses/
 * @secure*/

  /**
   */

  createANewBus = (
    data: {
      licensePlate: string;
      capacity: number;
      metadata: BusMetadata;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          /**
           * @format uuid
           * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
           */
          id: string;
          licensePlate: string;
          capacity: number;
          metadata: BusMetadata;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/buses/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags BusesController
 * @name GetBusById
 * @summary Get bus by ID
 * @request GET:/api/buses/{id}
 * @secure*/

  /**
   */

  getBusById = (id: string, params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          /**
           * @format uuid
           * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
           */
          id: string;
          licensePlate: string;
          capacity: number;
          metadata: BusMetadata;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/buses/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags BusesController
 * @name UpdateABus
 * @summary Update a bus
 * @request PUT:/api/buses/{id}
 * @secure*/

  /**
   */

  updateABus = (
    id: string,
    data: {
      licensePlate: string;
      capacity: number;
      metadata: BusMetadata;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          /**
           * @format uuid
           * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
           */
          id: string;
          licensePlate: string;
          capacity: number;
          metadata: BusMetadata;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/buses/${id}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags BusesController
 * @name DeleteABus
 * @summary Delete a bus
 * @request DELETE:/api/buses/{id}
 * @secure*/

  /**
   */

  deleteABus = (id: string, params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/buses/${id}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags routescontroller
 * @name GetAllRoutes
 * @summary Get all routes
 * @request GET:/api/routes/
 * @secure*/

  /**
   */

  getAllRoutes = (
    query?: {
      /** Search term to filter results */
      search?: string;
      /**
       * Page number, minimum is 1
       * @min 1
       * @default 1
       */
      page?: number;
      /**
       * Number of items per page, minimum is 1 and maximum is 100
       * @min 1
       * @max 100
       * @default 10
       */
      limit?: number;
      stopId?: string;
      /**
       * Stop point IDs to filter by (comma-separated)
       
       */
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          data: RouteData[];
          meta: PaginationMetaData;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/routes/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags routescontroller
 * @name CreateANewRoute
 * @summary Create a new route
 * @request POST:/api/routes/
 * @secure*/

  /**
   */

  createANewRoute = (
    data: {
      name: string;
      startLocation: GeoLocation;
      endLocation: GeoLocation;
      meta: RouteMeta;
      /**
       * @maxItems 50
       * @minItems 1
       */
      stopPointIds: string[];
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          id: string;
          name: string;
          stopPoints: {
            /**
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            id: string;
            name: string;
            location: GeoLocation;
            sequence: number;
            meta: {
              __?: string;
            };
          }[];
          /**
           * @format date-time
           * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
           */
          createdAt: string;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/routes/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags routescontroller
 * @name GetRouteById
 * @summary Get route by ID
 * @request GET:/api/routes/{id}
 * @secure*/

  /**
   */

  getRouteById = (id: string, params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          /**
           * @format uuid
           * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
           */
          id: string;
          name: string;
          startLocation: GeoLocation;
          endLocation: GeoLocation;
          metadata: RouteMeta;
          stopPoints: {
            /**
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            id: string;
            name: string;
            location: GeoLocation;
            meta: StopPointsMeta;
            sequence: number;
          }[];
          /**
           * @format date-time
           * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
           */
          createdAt: string;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/routes/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags routescontroller
 * @name UpdateARoute
 * @summary Update a route
 * @request PUT:/api/routes/{id}
 * @secure*/

  /**
   */

  updateARoute = (
    id: string,
    data: {
      name: string;
      meta?: RouteMeta;
      /**
       * @maxItems 50
       * @minItems 1
       */
      stopPointIds: string[];
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          /**
           * @format uuid
           * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
           */
          id: string;
          name: string;
          /**
           * @format date-time
           * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
           */
          updatedAt: string;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/routes/${id}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags routescontroller
 * @name DeleteARouteById
 * @summary Delete a route by ID
 * @request DELETE:/api/routes/{id}
 * @secure*/

  /**
   */

  deleteARouteById = (id: string, params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/routes/${id}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags SchedulesController
 * @name GetAllSchedules
 * @summary Get all schedules
 * @request GET:/api/schedules/
 * @secure*/

  /**
   */

  getAllSchedules = (
    query?: {
      /** Search term to filter results */
      search?: string;
      /**
       * Page number, minimum is 1
       * @min 1
       * @default 1
       */
      page?: number;
      /**
       * Number of items per page, minimum is 1 and maximum is 100
       * @min 1
       * @max 100
       * @default 10
       */
      limit?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          data: {
            /**
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            id: string;
            bus: BusData;
            driver: {
              /**
               * @format uuid
               * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
               */
              id: string;
              name: string;
              email: string;
            };
            times: TimeTable;
            route: RouteData;
            meta: any;
            /**
             * @format date-time
             * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
             */
            startDate: string;
            /**
             * @format date-time
             * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
             */
            endDate: string;
            type: "DISPATCH" | "RETURN";
          }[];
          meta: PaginationMetaData;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/schedules/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags SchedulesController
 * @name CreateANewSchedule
 * @summary Create a new schedule
 * @request POST:/api/schedules/
 * @secure*/

  /**
   */

  createANewSchedule = (
    data: {
      busId: string;
      routeId: string;
      driverId: string;
      times: TimeTable;
      meta?: any;
      /**
       * @format date-time
       * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
       */
      startDate: string;
      /**
       * @format date-time
       * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
       */
      endDate: string;
      type: "DISPATCH" | "RETURN";
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          /**
           * @format uuid
           * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
           */
          id: string;
          bus: BusData;
          driver: {
            /**
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            id: string;
            name: string;
            email: string;
          };
          times: TimeTable;
          route: RouteData;
          meta: any;
          /**
           * @format date-time
           * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
           */
          startDate: string;
          /**
           * @format date-time
           * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
           */
          endDate: string;
          type: "DISPATCH" | "RETURN";
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/schedules/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags SchedulesController
 * @name GetScheduleById
 * @summary Get schedule by ID
 * @request GET:/api/schedules/{id}
 * @secure*/

  /**
   */

  getScheduleById = (id: string, params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          /**
           * @format uuid
           * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
           */
          id: string;
          bus: BusData;
          driver: {
            /**
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            id: string;
            name: string;
            email: string;
          };
          times: TimeTable;
          route: RouteData;
          meta: any;
          /**
           * @format date-time
           * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
           */
          startDate: string;
          /**
           * @format date-time
           * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
           */
          endDate: string;
          type: "DISPATCH" | "RETURN";
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/schedules/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags SchedulesController
 * @name UpdateASchedule
 * @summary Update a schedule
 * @request PUT:/api/schedules/{id}
 * @secure*/

  /**
   */

  updateASchedule = (
    id: string,
    data: {
      busId?: string;
      driverId?: string;
      meta?: any;
      /**
       * @format date-time
       * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
       */
      startDate?: string;
      /**
       * @format date-time
       * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
       */
      endDate?: string;
      type?: "DISPATCH" | "RETURN";
      routeId?: string;
      times?: TimeTable;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/schedules/${id}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags SchedulesController
 * @name DeleteASchedule
 * @summary Delete a schedule
 * @request DELETE:/api/schedules/{id}
 * @secure*/

  /**
   */

  deleteASchedule = (id: string, params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/schedules/${id}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags DriverController
 * @name GetTodaysSchedules
 * @summary Get today's schedules
 * @request GET:/api/drivers/schedules/today
 * @secure*/

  /**
   */

  getTodaysSchedules = (params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          data: {
            scheduleId: string;
            tripId: string;
            date: string;
            static: "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED";
            type: "DISPATH" | "RETURN";
            startTime: string;
          }[];
          total: number;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/drivers/schedules/today`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags DriverController
 * @name GetDriverSchedules
 * @summary get driver schedules
 * @request GET:/api/drivers/schedules
 * @secure*/

  /**
   */

  getDriverSchedules = (params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          data: {
            id: string;
            route: {
              id: string;
              name: string;
            };
            bus: BusInfo;
            type: "MORNING" | "AFTERNOON";
            daysOfWeek: number[];
            /** HH:mm format */
            startTime: string;
            startDate: string;
            endDate?: string;
          }[];
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/drivers/schedules`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags DriverController
 * @name GetTripById
 * @summary Get trip by ID
 * @request GET:/api/drivers/trip/{id}
 * @secure*/

  /**
   */

  getTripById = (id: string, params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          id: string;
          status: "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED";
          rotute: {
            id: string;
            name: string;
            path: any[];
            startTime: string;
          };
          bus: BusInfo;
          stops: {
            id: string;
            name: string;
            location: number[];
            sequence: number;
            status: "PENDING" | "ARRIVED" | "DONE" | "SKIPPED";
          }[];
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/drivers/trip/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags DriverController
 * @name StartTrip
 * @summary Start trip
 * @request POST:/api/drivers/trip/{id}/start
 * @secure*/

  /**
   */

  startTrip = (id: string, params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          tripId: string;
          status: string;
          /**
           * @format date-time
           * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
           */
          startedAt: string;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/drivers/trip/${id}/start`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags DriverController
 * @name MarkStoppointAsArrived
 * @summary Mark stoppoint as arrived
 * @request POST:/api/drivers/trip/{tripId}/stoppoint/{spId}/arrive
 * @secure*/

  /**
   */

  markStoppointAsArrived = (
    tripId: string,
    spId: string,
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          stopId: string;
          status: string;
          arrivedAt: string;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/drivers/trip/${tripId}/stoppoint/${spId}/arrive`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags DriverController
 * @name MarkStoppointAsDeparted
 * @summary Mark stoppoint as departed
 * @request POST:/api/drivers/trip/{tripId}/stoppoint/{spId}/depart
 * @secure*/

  /**
   */

  markStoppointAsDeparted = (
    tripId: string,
    spId: string,
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          stopId: string;
          status: string;
          departedAt: string;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/drivers/trip/${tripId}/stoppoint/${spId}/depart`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags DriverController
 * @name EndTrip
 * @summary End trip
 * @request GET:/api/drivers/trip/{tripId}/end
 * @secure*/

  /**
   */

  endTrip = (tripId: string, params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          tripId: string;
          status: string;
          startAt: string;
          endAt: string;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/drivers/trip/${tripId}/end`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags DriverController
 * @name PickupStudent
 * @summary Pickup student
 * @request POST:/api/drivers/trip/{tripId}/students/{studentId}/pickup
 * @secure*/

  /**
   */

  pickupStudent = (
    tripId: string,
    studentId: string,
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          studentId: string;
          status: string;
          pickedAt: string;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/drivers/trip/${tripId}/students/${studentId}/pickup`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags DriverController
 * @name DropoffStudent
 * @summary Dropoff student
 * @request POST:/api/drivers/trip/{tripId}/students/{studentId}/dropoff
 * @secure*/

  /**
   */

  dropoffStudent = (
    tripId: string,
    studentId: string,
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          studentId: string;
          status: string;
          droppedAt: string;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/drivers/trip/${tripId}/students/${studentId}/dropoff`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags DriverController
 * @name UpdateTripLocation
 * @summary Update trip location
 * @request POST:/api/drivers/trip/{tripId}/location
 * @secure*/

  /**
   */

  updateTripLocation = (
    tripId: string,
    data: {
      latitude: number;
      longitude: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          /** @default true */
          ok: boolean;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/drivers/trip/${tripId}/location`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags ParentController
 * @name GetStudentsForParent
 * @summary Get students for parent
 * @request GET:/api/parents/students
 * @secure*/

  /**
   */

  getStudentsForParent = (params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          data: {
            id: string;
            name: string;
            meta: any;
          }[];
          total: number;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/parents/students`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags ParentController
 * @name GetStudentInfoForParent
 * @summary Get student info for parent
 * @request GET:/api/parents/student-info/{studentId}
 * @secure*/

  /**
   */

  getStudentInfoForParent = (studentId: string, params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          studentId: string;
          name: string;
          assignment: {
            pickupStop?: StudentInfoReqAssignmetStop;
            dropoffStop?: StudentInfoReqAssignmetStop;
          };
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/parents/student-info/${studentId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags ParentController
 * @name GetTodaysTripForStudent
 * @summary Get todays trip for student
 * @request GET:/api/parents/today-trip/{studentId}*/

  /**
   */

  getTodaysTripForStudent = (studentId: string, params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          tripId: string;
          status: "ONGOING" | "COMPLETED" | "PENDING";
          type: "DISPATCH" | "RETURN";
          route: {
            routeId: string;
            routeName: string;
            path: any[];
          };
          stopPoint: {
            stopId: string;
            stopName: string;
            pos: any[];
          };
        };
      },
      {
        /**
         * HTTP status code of the error
         * @min 400
         * @max 599
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        /** Error class name */
        name?: string;
      }
    >({
      path: `/api/parents/today-trip/${studentId}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags ParentController
 * @name GetStudentAttendanceForToday
 * @summary Get student attendance for today
 * @request GET:/api/parents/student/{studentId}/attendance/today*/

  /**
   */

  getStudentAttendanceForToday = (
    studentId: string,
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          studentId: string;
          tripId?: string;
          status?: "PENDING" | "PICKED_UP" | "DROPPED_OFF" | "MISSED";
          pickupTime?: string;
          dropoffTime?: string;
        };
      },
      any
    >({
      path: `/api/parents/student/${studentId}/attendance/today`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags ParentController
 * @name UpdateStudentAssignmentForParent
 * @summary Update student assignment for parent
 * @request POST:/api/parents/student/{studentId}/assignment*/

  /**
   */

  updateStudentAssignmentForParent = (
    studentId: string,
    data: {
      routeId: string;
      stopId: string;
      direction: "PICKUP" | "DROPOFF";
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          id: string;
          studentId: string;
          routeId: string;
          stopId: string;
          direction: "PICKUP" | "DROPOFF";
          effectiveFrom: string;
          effectiveTo?: string;
        };
      },
      {
        /**
         * HTTP status code of the error
         * @min 400
         * @max 599
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        /** Error class name */
        name?: string;
      }
    >({
      path: `/api/parents/student/${studentId}/assignment`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags StoppointsController
 * @name GetAllStoppoints
 * @summary Get all stoppoints
 * @request GET:/api/stoppoints/stoppoints
 * @secure*/

  /**
   */

  getAllStoppoints = (
    query?: {
      east?: number;
      north?: number;
      south?: number;
      west?: number;
      name?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          data: {
            /**
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            id: string;
            name: string;
            location: GeoLocation;
            meta: StopPointsMeta;
          }[];
          total: number;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/stoppoints/stoppoints`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags StoppointsController
 * @name CreateANewStoppoint
 * @summary Create a new stoppoint
 * @request POST:/api/stoppoints/stoppoints
 * @secure*/

  /**
   */

  createANewStoppoint = (
    data: {
      name: string;
      location: GeoLocation;
      meta: StopPointsMeta;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          id: string;
          name: string;
          location: GeoLocation;
          meta: StopPointsMeta;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/stoppoints/stoppoints`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags StoppointsController
 * @name GetStoppointById
 * @summary Get stoppoint by ID
 * @request GET:/api/stoppoints/stoppoints/{id}
 * @secure*/

  /**
   */

  getStoppointById = (id: string, params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          id: string;
          name: string;
          location: GeoLocation;
          /**
           * @format date-time
           * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
           */
          createdAt: string;
          /**
           * @format date-time
           * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
           */
          updatedAt: string;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/stoppoints/stoppoints/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags StoppointsController
 * @name UpdateAStoppoint
 * @summary Update a stoppoint
 * @request PUT:/api/stoppoints/stoppoints/{id}
 * @secure*/

  /**
   */

  updateAStoppoint = (
    id: string,
    data: {
      name: string;
      location: GeoLocation;
      meta: StopPointsMeta;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/stoppoints/stoppoints/${id}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags StoppointsController
 * @name DeleteAStoppoint
 * @summary Delete a stoppoint
 * @request DELETE:/api/stoppoints/stoppoints/{id}
 * @secure*/

  /**
   */

  deleteAStoppoint = (id: string, params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/stoppoints/stoppoints/${id}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags StudentsController
 * @name GetAllStudents
 * @summary Get all students
 * @request GET:/api/students/
 * @secure*/

  /**
   */

  getAllStudents = (
    query?: {
      /** Search term to filter results */
      search?: string;
      /**
       * Page number, minimum is 1
       * @min 1
       * @default 1
       */
      page?: number;
      /**
       * Number of items per page, minimum is 1 and maximum is 100
       * @min 1
       * @max 100
       * @default 10
       */
      limit?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          data: {
            /**
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            id: string;
            name: string;
            /**
             * @format date-time
             * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
             */
            createdAt: string;
            /**
             * @format date-time
             * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
             */
            updatedAt: string;
            metadata: StudentMetadata;
          }[];
          meta: PaginationMetaData;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/students/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags StudentsController
 * @name CreateANewStudent
 * @summary Create a new student
 * @request POST:/api/students/
 * @secure*/

  /**
   */

  createANewStudent = (
    data: {
      name: string;
      userId: string;
      metadata: StudentMetadata;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          /**
           * @format uuid
           * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
           */
          id: string;
          name: string;
          /**
           * @format date-time
           * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
           */
          createdAt: string;
          /**
           * @format date-time
           * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
           */
          updatedAt: string;
          metadata: StudentMetadata;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/students/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags StudentsController
 * @name GetStudentById
 * @summary Get student by ID
 * @request GET:/api/students/{id}
 * @secure*/

  /**
   */

  getStudentById = (id: string, params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          /**
           * @format uuid
           * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
           */
          id: string;
          name: string;
          /**
           * @format date-time
           * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
           */
          createdAt: string;
          /**
           * @format date-time
           * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
           */
          updatedAt: string;
          metadata: StudentMetadata;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/students/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags StudentsController
 * @name UpdateAStudent
 * @summary Update a student
 * @request PUT:/api/students/{id}
 * @secure*/

  /**
   */

  updateAStudent = (
    id: string,
    data: {
      name: string;
      metadata: StudentMetadata;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          /**
           * @format uuid
           * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
           */
          id: string;
          name: string;
          /**
           * @format date-time
           * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
           */
          createdAt: string;
          /**
           * @format date-time
           * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
           */
          updatedAt: string;
          metadata: StudentMetadata;
        };
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/students/${id}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags StudentsController
 * @name DeleteAStudent
 * @summary Delete a student
 * @request DELETE:/api/students/{id}
 * @secure*/

  /**
   */

  deleteAStudent = (id: string, params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
      },
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
        }
      | {
          /**
           * HTTP status code of the error
           * @min 400
           * @max 599
           */
          code?: number;
          /** Human-readable error message */
          message?: string;
          /** Error class name */
          name?: string;
        }
    >({
      path: `/api/students/${id}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags UsersController
 * @name GetAllUsers
 * @summary Get All Users
 * @request GET:/api/users/*/

  /**
   */

  getAllUsers = (
    query?: {
      /** Search term to filter results */
      search?: string;
      /**
       * Page number, minimum is 1
       * @min 1
       * @default 1
       */
      page?: number;
      /**
       * Number of items per page, minimum is 1 and maximum is 100
       * @min 1
       * @max 100
       * @default 10
       */
      limit?: number;
      role?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          data: {
            id: string;
            username: string;
            roles: string[];
            email: string;
            createdAt: string;
            updatedAt: string;
          }[];
          meta: PaginationMetaData;
        };
      },
      any
    >({
      path: `/api/users/`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags UsersController
 * @name CreateNewUser
 * @summary Create New User
 * @request POST:/api/users/*/

  /**
   */

  createNewUser = (
    data: {
      username: string;
      email: string;
      password: string;
      roles: string[];
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
      },
      {
        /**
         * HTTP status code of the error
         * @min 400
         * @max 599
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        /** Error class name */
        name?: string;
      }
    >({
      path: `/api/users/`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags UsersController
 * @name GetUserById
 * @summary Get User by ID
 * @request GET:/api/users/{id}*/

  /**
   */

  getUserById = (id: string, params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          id: string;
          username: string;
          roles: string[];
          email: string;
          createdAt: string;
          updatedAt: string;
        };
      },
      {
        /**
         * HTTP status code of the error
         * @min 400
         * @max 599
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        /** Error class name */
        name?: string;
      }
    >({
      path: `/api/users/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags UsersController
 * @name GetAllRoles
 * @summary Get All Roles
 * @request GET:/api/users/roles*/

  /**
   */

  getAllRoles = (params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          data: {
            id: number;
            name: string;
            permissions: string[];
          }[];
          total: number;
        };
      },
      any
    >({
      path: `/api/users/roles`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags UsersController
 * @name GetAllPermissions
 * @summary Get All Permissions
 * @request GET:/api/users/permissions*/

  /**
   */

  getAllPermissions = (params: RequestParams = {}) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          data: {
            id: number;
            name: string;
          }[];
          total: number;
        };
      },
      any
    >({
      path: `/api/users/permissions`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags UsersController
 * @name CreatePermission
 * @summary Create Permission
 * @request POST:/api/users/permission*/

  /**
   */

  createPermission = (
    data: {
      name: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          id: number;
          name: string;
        };
      },
      {
        /**
         * HTTP status code of the error
         * @min 400
         * @max 599
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        /** Error class name */
        name?: string;
      }
    >({
      path: `/api/users/permission`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**

 * No description
 *
 * @tags UsersController
 * @name AddPermissionToRole
 * @summary Add Permission to Role
 * @request POST:/api/users/role/permission*/

  /**
   */

  addPermissionToRole = (
    data: {
      roleId: number;
      permissions: string[];
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /**
         * HTTP status code of the error
         * @min 200
         * @max 300
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        data?: {
          id: number;
          name: string;
          permissions: string[];
        };
      },
      {
        /**
         * HTTP status code of the error
         * @min 400
         * @max 599
         */
        code?: number;
        /** Human-readable error message */
        message?: string;
        /** Error class name */
        name?: string;
      }
    >({
      path: `/api/users/role/permission`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
