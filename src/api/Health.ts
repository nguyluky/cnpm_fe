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

import { HttpClient, type RequestParams } from "./http-client";

export class Health<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**

 * No description
 *
 * @tags ApiRouter
 * @name HealthList
 * @request GET:/health*/

  /**
   */

  healthList = (params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/health`,
      method: "GET",
      ...params,
    });
}
