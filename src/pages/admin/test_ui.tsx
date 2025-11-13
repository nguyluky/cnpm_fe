import React, { useState } from 'react';

// Types
interface Schedule {
  id: string;
  routeId: string;
  busId: string;
  driverId: string;
  type: 'MORNING' | 'AFTERNOON';
  daysOfWeek: number[];
  startTime: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  meta: any;
  createdAt: string;
  updatedAt: string;
  // Additional fields for display
  routeName?: string;
  busNumber?: string;
  driverName?: string;
}

interface NewScheduleForm {
  routeId: string;
  busId: string;
  driverId: string;
  type: 'MORNING' | 'AFTERNOON';
  daysOfWeek: number[];
  startTime: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  notes: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

// Mock data for dropdowns
const mockRoutes = [
  { id: 'route_001', name: 'Tuyến A - Trung tâm thành phố' },
  { id: 'route_002', name: 'Tuyến B - Khu vực ngoại ô' },
  { id: 'route_003', name: 'Tuyến C - Đặc biệt cuối tuần' },
  { id: 'route_004', name: 'Tuyến D - Khu công nghiệp' },
  { id: 'route_005', name: 'Tuyến E - Khu học đường' },
];

const mockBuses = [
  { id: 'bus_001', number: 'BUS-001' },
  { id: 'bus_002', number: 'BUS-002' },
  { id: 'bus_003', number: 'BUS-003' },
  { id: 'bus_004', number: 'BUS-004' },
  { id: 'bus_005', number: 'BUS-005' },
  { id: 'bus_006', number: 'BUS-006' },
  { id: 'bus_007', number: 'BUS-007' },
];

const mockDrivers = [
  { id: 'driver_001', name: 'Nguyễn Văn A' },
  { id: 'driver_002', name: 'Trần Thị B' },
  { id: 'driver_003', name: 'Lê Văn C' },
  { id: 'driver_004', name: 'Phạm Thị D' },
  { id: 'driver_005', name: 'Hoàng Văn E' },
  { id: 'driver_006', name: 'Võ Thị F' },
  { id: 'driver_007', name: 'Đỗ Văn G' },
];

// Mock schedules data
const mockSchedules: Schedule[] = [
  {
    id: 'SCH001',
    routeId: 'route_001',
    busId: 'bus_001',
    driverId: 'driver_001',
    type: 'MORNING',
    daysOfWeek: [1, 2, 3, 4, 5],
    startTime: '07:00:00',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'ACTIVE',
    meta: { notes: 'Tuyến buýt thường xuyên buổi sáng', priority: 'HIGH' },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2025-11-10T14:19:23.000Z',
    routeName: 'Tuyến A - Trung tâm thành phố',
    busNumber: 'BUS-001',
    driverName: 'Nguyễn Văn A'
  },
  {
    id: 'SCH002',
    routeId: 'route_002',
    busId: 'bus_002',
    driverId: 'driver_002',
    type: 'AFTERNOON',
    daysOfWeek: [1, 2, 3, 4, 5],
    startTime: '14:30:00',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'ACTIVE',
    meta: { notes: 'Tuyến chiều về khu vực ngoại ô', priority: 'MEDIUM' },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2025-11-10T14:20:15.000Z',
    routeName: 'Tuyến B - Khu vực ngoại ô',
    busNumber: 'BUS-002',
    driverName: 'Trần Thị B'
  },
  {
    id: 'SCH003',
    routeId: 'route_003',
    busId: 'bus_003',
    driverId: 'driver_003',
    type: 'MORNING',
    daysOfWeek: [6, 7],
    startTime: '08:00:00',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'INACTIVE',
    meta: { notes: 'Tuyến cuối tuần - tạm thời ngừng hoạt động', priority: 'LOW' },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2025-11-10T14:18:45.000Z',
    routeName: 'Tuyến C - Đặc biệt cuối tuần',
    busNumber: 'BUS-003',
    driverName: 'Lê Văn C'
  },
  {
    id: 'SCH004',
    routeId: 'route_001',
    busId: 'bus_004',
    driverId: 'driver_004',
    type: 'AFTERNOON',
    daysOfWeek: [1, 3, 5],
    startTime: '16:00:00',
    startDate: '2024-02-01',
    endDate: '2024-11-30',
    status: 'ACTIVE',
    meta: { notes: 'Dịch vụ chiều thay thế', priority: 'HIGH' },
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2025-11-10T14:21:30.000Z',
    routeName: 'Tuyến A - Trung tâm thành phố',
    busNumber: 'BUS-004',
    driverName: 'Phạm Thị D'
  },
  {
    id: 'SCH005',
    routeId: 'route_004',
    busId: 'bus_005',
    driverId: 'driver_005',
    type: 'MORNING',
    daysOfWeek: [1, 2, 3, 4, 5, 6],
    startTime: '06:30:00',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    status: 'ACTIVE',
    meta: { notes: 'Tuyến mới phục vụ khu công nghiệp', priority: 'MEDIUM' },
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-11-10T14:22:10.000Z',
    routeName: 'Tuyến D - Khu công nghiệp',
    busNumber: 'BUS-005',
    driverName: 'Hoàng Văn E'
  },
  {
    id: 'SCH006',
    routeId: 'route_005',
    busId: 'bus_006',
    driverId: 'driver_006',
    type: 'AFTERNOON',
    daysOfWeek: [2, 4, 6],
    startTime: '15:45:00',
    startDate: '2024-06-01',
    endDate: '2025-05-31',
    status: 'ACTIVE',
    meta: { notes: 'Tuyến phục vụ trường học', priority: 'HIGH' },
    createdAt: '2024-06-01T00:00:00.000Z',
    updatedAt: '2025-11-10T14:23:05.000Z',
    routeName: 'Tuyến E - Khu học đường',
    busNumber: 'BUS-006',
    driverName: 'Võ Thị F'
  }
];

const ScheduleAdminWithForm: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Schedule>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<{
    type: string;
    status: string;
    searchTerm: string;
    priority: string;
  }>({
    type: 'ALL',
    status: 'ALL',
    searchTerm: '',
    priority: 'ALL'
  });

  // Add form state
  const [newSchedule, setNewSchedule] = useState<NewScheduleForm>({
    routeId: '',
    busId: '',
    driverId: '',
    type: 'MORNING',
    daysOfWeek: [],
    startTime: '',
    startDate: '2025-11-11',
    endDate: '2025-12-31',
    status: 'ACTIVE',
    notes: '',
    priority: 'MEDIUM'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper functions
  const getDayNames = (days: number[]): string => {
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days.map(day => dayNames[day]).join(', ');
  };

  const formatTime = (time: string): string => {
    return time.substring(0, 5);
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (datetime: string): string => {
    return new Date(datetime).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateId = (): string => {
    const count = schedules.length + 1;
    return `SCH${count.toString().padStart(3, '0')}`;
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!newSchedule.routeId) errors.routeId = 'Vui lòng chọn tuyến đường';
    if (!newSchedule.busId) errors.busId = 'Vui lòng chọn xe buýt';
    if (!newSchedule.driverId) errors.driverId = 'Vui lòng chọn tài xế';
    if (!newSchedule.startTime) errors.startTime = 'Vui lòng nhập giờ khởi hành';
    if (!newSchedule.startDate) errors.startDate = 'Vui lòng chọn ngày bắt đầu';
    if (!newSchedule.endDate) errors.endDate = 'Vui lòng chọn ngày kết thúc';
    if (newSchedule.daysOfWeek.length === 0) errors.daysOfWeek = 'Vui lòng chọn ít nhất một ngày trong tuần';

    if (newSchedule.startDate && newSchedule.endDate) {
      if (new Date(newSchedule.startDate) >= new Date(newSchedule.endDate)) {
        errors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const selectedRoute = mockRoutes.find(r => r.id === newSchedule.routeId);
      const selectedBus = mockBuses.find(b => b.id === newSchedule.busId);
      const selectedDriver = mockDrivers.find(d => d.id === newSchedule.driverId);

      const newScheduleData: Schedule = {
        id: generateId(),
        routeId: newSchedule.routeId,
        busId: newSchedule.busId,
        driverId: newSchedule.driverId,
        type: newSchedule.type,
        daysOfWeek: newSchedule.daysOfWeek,
        startTime: newSchedule.startTime + ':00',
        startDate: newSchedule.startDate,
        endDate: newSchedule.endDate,
        status: newSchedule.status,
        meta: { 
          notes: newSchedule.notes,
          priority: newSchedule.priority
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        routeName: selectedRoute?.name || '',
        busNumber: selectedBus?.number || '',
        driverName: selectedDriver?.name || ''
      };

      setSchedules(prev => [newScheduleData, ...prev]);
      
      // Reset form
      setNewSchedule({
        routeId: '',
        busId: '',
        driverId: '',
        type: 'MORNING',
        daysOfWeek: [],
        startTime: '',
        startDate: '2025-11-11',
        endDate: '2025-12-31',
        status: 'ACTIVE',
        notes: '',
        priority: 'MEDIUM'
      });
      
      setShowAddForm(false);
      setFormErrors({});
      
      // Show success message (you can implement toast notification here)
      alert('Thêm lịch trình thành công!');
      
    } catch (error) {
      alert('Có lỗi xảy ra khi thêm lịch trình!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle day selection
  const handleDayToggle = (day: number) => {
    setNewSchedule(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day].sort()
    }));
  };

  // Filter and sort schedules
  const filteredSchedules = schedules.filter(schedule => {
    const matchesType = filter.type === 'ALL' || schedule.type === filter.type;
    const matchesStatus = filter.status === 'ALL' || schedule.status === filter.status;
    const matchesPriority = filter.priority === 'ALL' || schedule.meta?.priority === filter.priority;
    const matchesSearch = filter.searchTerm === '' || 
      schedule.id.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
      schedule.routeName?.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
      schedule.busNumber?.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
      schedule.driverName?.toLowerCase().includes(filter.searchTerm.toLowerCase());
    
    return matchesType && matchesStatus && matchesPriority && matchesSearch;
  });

  const sortedSchedules = [...filteredSchedules].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedSchedules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSchedules = sortedSchedules.slice(startIndex, startIndex + itemsPerPage);

  // Handle sorting
  const handleSort = (field: keyof Schedule) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedSchedules.length === paginatedSchedules.length) {
      setSelectedSchedules([]);
    } else {
      setSelectedSchedules(paginatedSchedules.map(s => s.id));
    }
  };

  // Handle individual select
  const handleSelect = (id: string) => {
    setSelectedSchedules(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const SortIcon = ({ field }: { field: keyof Schedule }) => {
    if (sortField !== field) {
      return <span className="text-gray-400">↕️</span>;
    }
    return (
      <span className="text-blue-600">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý lịch trình</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Quản lý và theo dõi lịch trình xe buýt | Đăng nhập: <span className="font-medium">nguylukyt</span>
                </p>
              </div>
              <div className="mt-4 lg:mt-0 text-sm text-gray-500">
                Cập nhật lần cuối: {formatDateTime('2025-11-11T12:18:32.000Z')}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tìm kiếm</label>
                <input
                  type="text"
                  placeholder="ID, tuyến, xe, tài xế..."
                  value={filter.searchTerm}
                  onChange={(e) => setFilter({...filter, searchTerm: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Loại ca</label>
                <select
                  value={filter.type}
                  onChange={(e) => setFilter({...filter, type: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">Tất cả</option>
                  <option value="MORNING">Ca sáng</option>
                  <option value="AFTERNOON">Ca chiều</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={filter.status}
                  onChange={(e) => setFilter({...filter, status: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">Tất cả</option>
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="INACTIVE">Tạm dừng</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Độ ưu tiên</label>
                <select
                  value={filter.priority}
                  onChange={(e) => setFilter({...filter, priority: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">Tất cả</option>
                  <option value="HIGH">Cao</option>
                  <option value="MEDIUM">Trung bình</option>
                  <option value="LOW">Thấp</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Số dòng/trang</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Thêm lịch trình mới</h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setFormErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Route */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tuyến đường <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newSchedule.routeId}
                    onChange={(e) => setNewSchedule({...newSchedule, routeId: e.target.value})}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.routeId ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Chọn tuyến đường</option>
                    {mockRoutes.map(route => (
                      <option key={route.id} value={route.id}>{route.name}</option>
                    ))}
                  </select>
                  {formErrors.routeId && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.routeId}</p>
                  )}
                </div>

                {/* Bus */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xe buýt <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newSchedule.busId}
                    onChange={(e) => setNewSchedule({...newSchedule, busId: e.target.value})}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.busId ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Chọn xe buýt</option>
                    {mockBuses.map(bus => (
                      <option key={bus.id} value={bus.id}>{bus.number}</option>
                    ))}
                  </select>
                  {formErrors.busId && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.busId}</p>
                  )}
                </div>

                {/* Driver */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tài xế <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newSchedule.driverId}
                    onChange={(e) => setNewSchedule({...newSchedule, driverId: e.target.value})}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.driverId ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Chọn tài xế</option>
                    {mockDrivers.map(driver => (
                      <option key={driver.id} value={driver.id}>{driver.name}</option>
                    ))}
                  </select>
                  {formErrors.driverId && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.driverId}</p>
                  )}
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại ca</label>
                  <select
                    value={newSchedule.type}
                    onChange={(e) => setNewSchedule({...newSchedule, type: e.target.value as 'MORNING' | 'AFTERNOON'})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="MORNING">Ca sáng</option>
                    <option value="AFTERNOON">Ca chiều</option>
                  </select>
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giờ khởi hành <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={newSchedule.startTime}
                    onChange={(e) => setNewSchedule({...newSchedule, startTime: e.target.value})}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.startTime ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.startTime && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.startTime}</p>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Độ ưu tiên</label>
                  <select
                    value={newSchedule.priority}
                    onChange={(e) => setNewSchedule({...newSchedule, priority: e.target.value as 'HIGH' | 'MEDIUM' | 'LOW'})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="HIGH">Cao</option>
                    <option value="MEDIUM">Trung bình</option>
                    <option value="LOW">Thấp</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newSchedule.startDate}
                    onChange={(e) => setNewSchedule({...newSchedule, startDate: e.target.value})}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.startDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.startDate && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.startDate}</p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày kết thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newSchedule.endDate}
                    onChange={(e) => setNewSchedule({...newSchedule, endDate: e.target.value})}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.endDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.endDate && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.endDate}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select
                    value={newSchedule.status}
                    onChange={(e) => setNewSchedule({...newSchedule, status: e.target.value as 'ACTIVE' | 'INACTIVE'})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Tạm dừng</option>
                  </select>
                </div>
              </div>

              {/* Days of Week */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày hoạt động trong tuần <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {dayNames.map((day, index) => (
                    <label key={index} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSchedule.daysOfWeek.includes(index)}
                        onChange={() => handleDayToggle(index)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
                {formErrors.daysOfWeek && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.daysOfWeek}</p>
                )}
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  value={newSchedule.notes}
                  onChange={(e) => setNewSchedule({...newSchedule, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập ghi chú về lịch trình..."
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormErrors({});
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu lịch trình'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
          <div className="px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                + Thêm lịch trình
              </button>
              {selectedSchedules.length > 0 && (
                <>
                  <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors">
                    Kích hoạt ({selectedSchedules.length})
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors">
                    Xóa ({selectedSchedules.length})
                  </button>
                </>
              )}
            </div>
            <div className="text-sm text-gray-600">
              Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedSchedules.length)} của {sortedSchedules.length} bản ghi
            </div>
          </div>
        </div>

        {/* Table */}

        {/* Statistics Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{schedules.length}</div>
            <div className="text-sm text-gray-600">Tổng lịch trình</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {schedules.filter(s => s.status === 'ACTIVE').length}
            </div>
            <div className="text-sm text-gray-600">Đang hoạt động</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-red-600">
              {schedules.filter(s => s.status === 'INACTIVE').length}
            </div>
            <div className="text-sm text-gray-600">Tạm dừng</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">
              {schedules.filter(s => s.meta?.priority === 'HIGH').length}
            </div>
            <div className="text-sm text-gray-600">Độ ưu tiên cao</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAdminWithForm;
