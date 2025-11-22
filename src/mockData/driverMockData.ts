// Mock data for Driver App
export interface BusInfo {
  id: string;
  plateNumber: string;
  model: string;
  capacity: number;
}

export interface Route {
  id: string;
  name: string;
  path?: Array<any>;
}

export interface Schedule {
  scheduleId: string;
  tripId: string;
  date: string;
  static: "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  type: "DISPATH" | "RETURN";
  startTime: string;
}

export interface FullSchedule {
  id: string;
  route: Route;
  bus: BusInfo;
  type: "MORNING" | "AFTERNOON";
  daysOfWeek: number[];
  startDate: string;
}

export interface Stop {
  id: string;
  name: string;
  location: [number, number];
  sequence: number;
  status: "PENDING" | "ARRIVED" | "DONE" | "SKIPPED";
}

export interface TripDetail {
  id: string;
  status: "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  rotute: Route;
  bus: BusInfo;
  stops: Stop[];
}

// Mock data
export const mockBusInfo: BusInfo = {
  id: "bus-001",
  plateNumber: "29A-123.45",
  model: "Hyundai Universe",
  capacity: 45
};

export const mockRoutes: Route[] = [
  {
    id: "route-001",
    name: "Tuyến 1: Trường - Khu A - Khu B"
  },
  {
    id: "route-002", 
    name: "Tuyến 2: Trường - Khu C - Khu D"
  }
];

export const mockTodaySchedules: Schedule[] = [
  {
    scheduleId: "sch-001",
    tripId: "trip-001",
    date: "2024-11-20",
    static: "PLANNED",
    type: "DISPATH",
    startTime: "06:30"
  },
  {
    scheduleId: "sch-002", 
    tripId: "trip-002",
    date: "2024-11-20",
    static: "COMPLETED",
    type: "RETURN",
    startTime: "16:30"
  },
  {
    scheduleId: "sch-003",
    tripId: "trip-003", 
    date: "2024-11-20",
    static: "ONGOING",
    type: "DISPATH",
    startTime: "12:00"
  }
];

export const mockFullSchedules: FullSchedule[] = [
  {
    id: "full-sch-001",
    route: mockRoutes[0],
    bus: mockBusInfo,
    type: "MORNING",
    daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
    startDate: "2024-11-01T00:00:00Z"
  },
  {
    id: "full-sch-002",
    route: mockRoutes[1], 
    bus: mockBusInfo,
    type: "AFTERNOON",
    daysOfWeek: [1, 2, 3, 4, 5],
    startDate: "2024-11-01T00:00:00Z"
  }
];

export const mockStops: Stop[] = [
  {
    id: "stop-001",
    name: "Cổng trường chính",
    location: [10.762622, 106.660172],
    sequence: 1,
    status: "DONE"
  },
  {
    id: "stop-002", 
    name: "Khu dân cư A",
    location: [10.765432, 106.663245],
    sequence: 2,
    status: "DONE"
  },
  {
    id: "stop-003",
    name: "Khu dân cư B", 
    location: [10.768901, 106.666789],
    sequence: 3,
    status: "ARRIVED"
  },
  {
    id: "stop-004",
    name: "Bến xe bus",
    location: [10.771234, 106.669012],
    sequence: 4,
    status: "PENDING"
  }
];

export const mockTripDetail: TripDetail = {
  id: "trip-003",
  status: "ONGOING",
  rotute: mockRoutes[0],
  bus: mockBusInfo,
  stops: mockStops
};
