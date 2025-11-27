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

export interface GeoLocation {
  /** Latitude must be between -90 and 90 */
  latitude: number;
  /** Longitude must be between -180 and 180 */
  longitude: number;
}

export interface BusMetadata {
  color?: string;
  brand?: string;
  madeYear?: number;
  camera?: boolean;
}

export interface BusInfo {
  id: string;
  licensePlate: string;
}

export interface StudentInfoReqAssignmetStop {
  id: string;
  name: string;
  routeId: string;
}

export interface StudentAssignment {
  id: string;
  busId: string;
  stopPointId: string;
  effectiveFrom: string;
  effectiveTo: string;
}

export interface RouteMeta {
  Color?: string;
  Headway?: string;
  Distance?: number;
  encodedPath: any;
  OperationTime?: string;
}

export interface PaginationMetaData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BusData {
  /**
   * @format uuid
   * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
   */
  id: string;
  licensePlate: string;
  capacity: number;
  metadata: BusMetadata;
}

export interface RouteData {
  /**
   * @format uuid
   * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
   */
  id: string;
  name: string;
  startLocation: GeoLocation;
  endLocation: GeoLocation;
  metadata: RouteMeta;
}

export interface TimeTable {
  dayOfWeek: string[];
  /**
   * @format time
   * @pattern ^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?$
   */
  departureTime: string;
}

export interface StopPointsMeta {
  zone?: string;
  ward?: string;
  addressNo?: string;
  street?: string;
  supportDisability?: string;
  status?: string;
  search?: string;
}

export interface StudentMetadata {
  gender?: string;
  birthday?: string;
  school?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}
