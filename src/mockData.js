// Mock data for Bus Tracking System

export const buses = [
  {
    id: '1',
    plateNumber: '29A-12345',
    status: 'active',
    route: 'Tuyến 1 - Quận 1',
    driver: 'Nguyễn Văn A',
    currentLocation: { lat: 10.7769, lng: 106.7009 },
    address: 'Đường Nguyễn Huệ, Quận 1, TP.HCM',
    studentsOnBoard: 18,
    capacity: 35,
    lastUpdate: '18/35 học sinh'
  },
  {
    id: '2',
    plateNumber: '29B-67890',
    status: 'moving',
    route: 'Tuyến 2 - Quận 3',
    driver: 'Trần Văn B',
    currentLocation: { lat: 10.7829, lng: 106.6956 },
    address: 'Đường Lê Văn Sỹ, Quận 3, TP.HCM',
    studentsOnBoard: 22,
    capacity: 40,
    lastUpdate: '22/40 học sinh'
  },
  {
    id: '3',
    plateNumber: '29C-11111',
    status: 'maintenance',
    route: 'Không có tuyến',
    driver: 'Không',
    currentLocation: { lat: 10.7626, lng: 106.6822 },
    address: 'Bến xe Miền Đông',
    studentsOnBoard: 0,
    capacity: 30,
    lastUpdate: '0/30 học sinh'
  }
];

export const students = [
  {
    id: '1',
    name: 'Nguyễn Minh Khang',
    class: 'Lớp 6A',
    parentName: 'Nguyễn Văn X',
    parentPhone: '0901234567',
    address: 'Đường Nguyễn Huệ, Quận 1, TP.HCM',
    pickupPoint: 'Bến xe Bến Thành',
    dropoffPoint: 'Trường THCS ABC',
    busAssigned: '29A-12345',
    status: 'active',
    pickupTime: '07:00',
    dropoffTime: '17:30'
  },
  {
    id: '2',
    name: 'Lê Thị Mai',
    class: 'Lớp 7B',
    parentName: 'Lê Văn Y',
    parentPhone: '0907654321',
    address: 'Đường Lê Lợi, Quận 1, TP.HCM',
    pickupPoint: 'Công viên 23/9',
    dropoffPoint: 'Trường THCS ABC',
    busAssigned: '29A-12345',
    status: 'active',
    pickupTime: '07:10',
    dropoffTime: '17:30'
  },
  {
    id: '3',
    name: 'Trần Văn Nam',
    class: 'Lớp 8C',
    parentName: 'Trần Văn Z',
    parentPhone: '0909876543',
    address: 'Đường Hai Bà Trưng, Quận 3, TP.HCM',
    pickupPoint: 'Chợ Bến Thành',
    dropoffPoint: 'Trường THCS XYZ',
    busAssigned: '29B-67890',
    status: 'active',
    pickupTime: '07:15',
    dropoffTime: '17:45'
  }
];

export const routes = [
  {
    id: '1',
    name: 'Tuyến 1 - Quận 1',
    description: 'Tuyến đường qua Quận 1 và trung tâm TP.HCM',
    busAssigned: '29A-12345',
    driverAssigned: 'Nguyễn Văn A',
    pickupPoints: [
      { id: 'p1', name: 'Bến xe Bến Thành', time: '07:00', address: 'Lê Lợi, Q1' },
      { id: 'p2', name: 'Công viên 23/9', time: '07:10', address: 'Phạm Ngũ Lão, Q1' },
      { id: 'p3', name: 'Chợ Bến Thành', time: '07:20', address: 'Lê Thánh Tôn, Q1' }
    ],
    destination: 'Trường THCS ABC',
    estimatedDuration: '45 phút',
    distance: '12 km',
    studentsCount: 18,
    status: 'active'
  },
  {
    id: '2',
    name: 'Tuyến 2 - Quận 3',
    description: 'Tuyến đường qua Quận 3',
    busAssigned: '29B-67890',
    driverAssigned: 'Trần Văn B',
    pickupPoints: [
      { id: 'p4', name: 'Công viên Tao Đàn', time: '07:00', address: 'Trương Định, Q3' },
      { id: 'p5', name: 'Chợ Tân Định', time: '07:15', address: 'Hai Bà Trưng, Q3' }
    ],
    destination: 'Trường THCS XYZ',
    estimatedDuration: '35 phút',
    distance: '8 km',
    studentsCount: 22,
    status: 'active'
  }
];

export const schedules = [
  {
    id: '1',
    busId: '1',
    busPlateNumber: '29A-12345',
    driverId: '1',
    driverName: 'Nguyễn Văn A',
    routeId: '1',
    routeName: 'Tuyến 1 - Quận 1',
    date: '2025-08-10',
    timeSlot: 'morning',
    startTime: '06:45',
    endTime: '08:00',
    status: 'scheduled'
  },
  {
    id: '2',
    busId: '1',
    busPlateNumber: '29A-12345',
    driverId: '1',
    driverName: 'Nguyễn Văn A',
    routeId: '1',
    routeName: 'Tuyến 1 - Quận 1',
    date: '2025-08-10',
    timeSlot: 'afternoon',
    startTime: '16:45',
    endTime: '18:00',
    status: 'scheduled'
  },
  {
    id: '3',
    busId: '2',
    busPlateNumber: '29B-67890',
    driverId: '2',
    driverName: 'Trần Văn B',
    routeId: '2',
    routeName: 'Tuyến 2 - Quận 3',
    date: '2025-08-10',
    timeSlot: 'morning',
    startTime: '06:45',
    endTime: '08:00',
    status: 'scheduled'
  }
];

export const drivers = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    licenseNumber: 'B2-12345',
    experience: '10 năm',
    busAssigned: '29A-12345',
    routeAssigned: 'Tuyến 1 - Quận 1',
    status: 'active'
  },
  {
    id: '2',
    name: 'Trần Văn B',
    phone: '0907654321',
    licenseNumber: 'B2-67890',
    experience: '8 năm',
    busAssigned: '29B-67890',
    routeAssigned: 'Tuyến 2 - Quận 3',
    status: 'active'
  }
];

export const notifications = [
  {
    id: '1',
    type: 'warning',
    title: 'Xe buýt sẽ đến điểm đón trong 5 phút',
    time: '2 phút trước',
    read: false
  },
  {
    id: '2',
    type: 'info',
    title: 'Con em đã lên xe an toàn',
    time: '15 phút trước',
    read: false
  },
  {
    id: '3',
    type: 'warning',
    title: 'Xe buýt BUS001 bị trễ 5 phút do tắc đường',
    time: '20:38',
    bus: 'BUS001',
    date: '2025-08-10'
  },
  {
    id: '4',
    type: 'warning',
    title: 'Đã đón xong học sinh tại Bến xe Bến Thành',
    time: '20:53',
    bus: 'BUS001',
    date: '2025-08-10'
  },
  {
    id: '5',
    type: 'alert',
    title: 'Xe buýt BUS002 báo cáo sự cố nhỏ, đang xử lý',
    time: '20:48',
    bus: 'BUS002',
    date: '2025-08-10'
  }
];

export const driverScheduleToday = {
  driverId: '1',
  driverName: 'Nguyễn Văn A',
  busPlateNumber: '29A-12345',
  date: '2025-08-10',
  shifts: [
    {
      id: 's1',
      type: 'morning',
      routeName: 'Tuyến 1 - Quận 1',
      startTime: '06:45',
      endTime: '08:00',
      pickupPoints: [
        {
          id: 'pp1',
          name: 'Bến xe Bến Thành',
          time: '07:00',
          students: [
            { id: '1', name: 'Nguyễn Minh Khang', class: 'Lớp 6A', status: 'pending' }
          ]
        },
        {
          id: 'pp2',
          name: 'Công viên 23/9',
          time: '07:10',
          students: [
            { id: '2', name: 'Lê Thị Mai', class: 'Lớp 7B', status: 'pending' }
          ]
        }
      ],
      status: 'scheduled'
    },
    {
      id: 's2',
      type: 'afternoon',
      routeName: 'Tuyến 1 - Quận 1',
      startTime: '16:45',
      endTime: '18:00',
      pickupPoints: [
        {
          id: 'pp3',
          name: 'Trường THCS ABC',
          time: '17:00',
          students: [
            { id: '1', name: 'Nguyễn Minh Khang', class: 'Lớp 6A', status: 'pending' },
            { id: '2', name: 'Lê Thị Mai', class: 'Lớp 7B', status: 'pending' }
          ]
        }
      ],
      status: 'scheduled'
    }
  ]
};
