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
  AnyObject,
  BusData,
  BusInfo,
  GeoLocation,
  PaginationMetaData,
  RouteData,
  StopPointsData,
  StopPointsMeta,
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
 * @request GET:/api/auth/profile*/

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
      path: `/api/auth/profile`,
      method: "GET",
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
      metadata: AnyObject;
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
          metadata: AnyObject;
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
          metadata: AnyObject;
          test: string;
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
      meta?: AnyObject;
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
            meta: AnyObject;
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
          metadata: {
            Color?: string;
            Headway?: string;
            Distance?: number;
            encodedPath: any;
            OperationTime?: string;
          };
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
      meta?: AnyObject;
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
            times: TimeTable[];
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
            /**
             * @format time
             * @pattern ^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?$
             */
            startTime: string;
            /** @default "MORNING" */
            type: "MORNING" | "AFTERNOON";
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
      times: TimeTable[];
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
      /**
       * @format date-time
       * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
       */
      startTime: string;
      /** @default "MORNING" */
      type: "MORNING" | "AFTERNOON";
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
          times: TimeTable[];
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
          /**
           * @format time
           * @pattern ^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?$
           */
          startTime: string;
          /** @default "MORNING" */
          type: "MORNING" | "AFTERNOON";
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
          times: TimeTable[];
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
          /**
           * @format time
           * @pattern ^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?$
           */
          startTime: string;
          /** @default "MORNING" */
          type: "MORNING" | "AFTERNOON";
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
       * @format time
       * @pattern ^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?$
       */
      startTime?: string;
      /**
       * @format date
       * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))$
       */
      startDate?: string;
      /**
       * @format date
       * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))$
       */
      endDate?: string;
      /** @default "MORNING" */
      type: "MORNING" | "AFTERNOON";
      routeId?: string;
      times?: TimeTable[];
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
            /** ISO 8601 date string */
            startDate: string;
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
 * @name EndStoppoint
 * @summary End stoppoint
 * @request GET:/api/drivers/trip/{tripId}/end
 * @secure*/

  /**
   */

  endStoppoint = (tripId: string, params: RequestParams = {}) =>
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
 * @request POST:/api/drivers/
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
      path: `/api/drivers/`,
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
 * @request GET:/api/parents/getStudents
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
            stopPoint: StopPointsData;
            status: "PENDING" | "PICKED_UP" | "DROPPED_OFF" | "MISSED";
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
      path: `/api/parents/getStudents`,
      method: "GET",
      secure: true,
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

  getAllStoppoints = (params: RequestParams = {}) =>
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
          data: StopPointsData[];
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
}
