import React, { useState } from 'react';

interface FormData {
  routeId: string;
  busId: string;
  driverId: string;
  type: 'MORNING' | 'AFTERNOON' | '';
  daysOfWeek: number[];
  startTime: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  notes: string;
  capacity: number;
  estimatedDuration: string;
}

// Mock data cho dropdowns
const routes = [
  { id: 'route_001', name: 'Tuyến A - Trung tâm thành phố', code: 'RT-A' },
  { id: 'route_002', name: 'Tuyến B - Khu vực ngoại ô', code: 'RT-B' },
  { id: 'route_003', name: 'Tuyến C - Đặc biệt cuối tuần', code: 'RT-C' },
  { id: 'route_004', name: 'Tuyến D - Khu công nghiệp', code: 'RT-D' },
  { id: 'route_005', name: 'Tuyến E - Khu học đường', code: 'RT-E' },
];

const buses = [
  { id: 'bus_001', number: 'BUS-001', status: 'AVAILABLE', model: 'Hyundai Universe' },
  { id: 'bus_002', number: 'BUS-002', status: 'AVAILABLE', model: 'Daewoo BX212' },
  { id: 'bus_003', number: 'BUS-003', status: 'MAINTENANCE', model: 'Thaco TB120S' },
  { id: 'bus_004', number: 'BUS-004', status: 'AVAILABLE', model: 'Hyundai County' },
  { id: 'bus_005', number: 'BUS-005', status: 'AVAILABLE', model: 'Samco Felix' },
];

const drivers = [
  { id: 'driver_001', name: 'Nguyễn Văn A', license: 'D123456', experience: '5 năm' },
  { id: 'driver_002', name: 'Trần Thị B', license: 'D234567', experience: '8 năm' },
  { id: 'driver_003', name: 'Lê Văn C', license: 'D345678', experience: '3 năm' },
  { id: 'driver_004', name: 'Phạm Thị D', license: 'D456789', experience: '7 năm' },
  { id: 'driver_005', name: 'Hoàng Văn E', license: 'D567890', experience: '4 năm' },
];

export const AddSchedulePage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    routeId: '',
    busId: '',
    driverId: '',
    type: '',
    daysOfWeek: [],
    startTime: '',
    startDate: '',
    endDate: '',
    status: 'ACTIVE',
    priority: 'MEDIUM',
    notes: '',
    capacity: 45,
    estimatedDuration: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);

  const dayOptions = [
    { value: 1, label: 'Thứ 2' },
    { value: 2, label: 'Thứ 3' },
    { value: 3, label: 'Thứ 4' },
    { value: 4, label: 'Thứ 5' },
    { value: 5, label: 'Thứ 6' },
    { value: 6, label: 'Thứ 7' },
    { value: 0, label: 'Chủ nhật' },
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleDayToggle = (day: number) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day].sort()
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.routeId) newErrors.routeId = 'Vui lòng chọn tuyến đường';
      if (!formData.busId) newErrors.busId = 'Vui lòng chọn xe buýt';
      if (!formData.driverId) newErrors.driverId = 'Vui lòng chọn tài xế';
    } else if (step === 2) {
      if (!formData.type) newErrors.type = 'Vui lòng chọn ca làm việc';
      if (!formData.startTime) newErrors.startTime = 'Vui lòng nhập thời gian bắt đầu';
      if (formData.daysOfWeek.length === 0) newErrors.daysOfWeek = 'Vui lòng chọn ít nhất một ngày';
      if (!formData.startDate) newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
      if (!formData.endDate) newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
      if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
        newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(2) && validateStep(3)) {
      console.log('Submitting schedule:', formData);
      // Here you would typically send the data to your API
      alert('Lịch trình đã được tạo thành công!');
    }
  };

  const generateScheduleId = (): string => {
    return 'SCH' + Date.now().toString().slice(-6);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-gray-700">
                  ← Quay lại danh sách
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Thêm lịch trình mới</h1>
                  <p className="text-sm text-gray-600">
                    Người tạo: <span className="font-medium">nguylukyt</span> | 
                    Thời gian: <span className="font-medium">2025-11-10 14:25:59</span>
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                ID dự kiến: <span className="font-mono">{generateScheduleId()}</span>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep >= step
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {step}
                  </div>
                  <div className={`ml-3 text-sm font-medium ${
                    currentStep >= step ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step === 1 && 'Thông tin cơ bản'}
                    {step === 2 && 'Thời gian & Lịch'}
                    {step === 3 && 'Chi tiết & Xác nhận'}
                  </div>
                  {step < 3 && (
                    <div className={`ml-4 w-16 h-1 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Route Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tuyến đường <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.routeId}
                        onChange={(e) => handleInputChange('routeId', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.routeId ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Chọn tuyến đường</option>
                        {routes.map((route) => (
                          <option key={route.id} value={route.id}>
                            {route.code} - {route.name}
                          </option>
                        ))}
                      </select>
                      {errors.routeId && <p className="mt-1 text-sm text-red-600">{errors.routeId}</p>}
                    </div>

                    {/* Bus Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Xe buýt <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.busId}
                        onChange={(e) => handleInputChange('busId', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.busId ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Chọn xe buýt</option>
                        {buses.map((bus) => (
                          <option 
                            key={bus.id} 
                            value={bus.id}
                            disabled={bus.status !== 'AVAILABLE'}
                          >
                            {bus.number} - {bus.model} 
                            {bus.status === 'MAINTENANCE' && ' (Đang bảo trì)'}
                          </option>
                        ))}
                      </select>
                      {errors.busId && <p className="mt-1 text-sm text-red-600">{errors.busId}</p>}
                    </div>

                    {/* Driver Selection */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tài xế <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.driverId}
                        onChange={(e) => handleInputChange('driverId', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.driverId ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Chọn tài xế</option>
                        {drivers.map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.name} - GPLX: {driver.license} ({driver.experience} kinh nghiệm)
                          </option>
                        ))}
                      </select>
                      {errors.driverId && <p className="mt-1 text-sm text-red-600">{errors.driverId}</p>}
                    </div>
                  </div>

                  {/* Selected Info Preview */}
                  {(formData.routeId || formData.busId || formData.driverId) && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Xem trước thông tin đã chọn:</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        {formData.routeId && (
                          <p>🛣️ Tuyến: {routes.find(r => r.id === formData.routeId)?.name}</p>
                        )}
                        {formData.busId && (
                          <p>🚌 Xe: {buses.find(b => b.id === formData.busId)?.number} ({buses.find(b => b.id === formData.busId)?.model})</p>
                        )}
                        {formData.driverId && (
                          <p>👨‍✈️ Tài xế: {drivers.find(d => d.id === formData.driverId)?.name}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Schedule & Time */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Thời gian & Lịch trình</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shift Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ca làm việc <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="MORNING"
                            checked={formData.type === 'MORNING'}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                            className="mr-2 text-blue-600"
                          />
                          <span className="text-sm">Ca sáng</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="AFTERNOON"
                            checked={formData.type === 'AFTERNOON'}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                            className="mr-2 text-blue-600"
                          />
                          <span className="text-sm">Ca chiều</span>
                        </label>
                      </div>
                      {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                    </div>

                    {/* Start Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời gian bắt đầu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.startTime ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>}
                    </div>

                    {/* Date Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày bắt đầu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.startDate ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày kết thúc <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.endDate ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                    </div>
                  </div>

                  {/* Days of Week */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày hoạt động trong tuần <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {dayOptions.map((day) => (
                        <label key={day.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.daysOfWeek.includes(day.value)}
                            onChange={() => handleDayToggle(day.value)}
                            className="mr-2 text-blue-600 rounded"
                          />
                          <span className="text-sm">{day.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.daysOfWeek && <p className="mt-1 text-sm text-red-600">{errors.daysOfWeek}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Details & Confirmation */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết & Xác nhận</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Status & Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="INACTIVE">Tạm dừng</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Độ ưu tiên</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="HIGH">Cao</option>
                        <option value="MEDIUM">Trung bình</option>
                        <option value="LOW">Thấp</option>
                      </select>
                    </div>

                    {/* Capacity & Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sức chứa (hành khách)</label>
                      <input
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => handleInputChange('capacity', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian dự kiến</label>
                      <input
                        type="text"
                        value={formData.estimatedDuration}
                        onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
                        placeholder="VD: 90 phút"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={4}
                      placeholder="Nhập ghi chú về lịch trình..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Summary */}
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-4">📋 Tóm tắt lịch trình</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p><span className="font-medium">Tuyến:</span> {routes.find(r => r.id === formData.routeId)?.name}</p>
                        <p><span className="font-medium">Xe:</span> {buses.find(b => b.id === formData.busId)?.number}</p>
                        <p><span className="font-medium">Tài xế:</span> {drivers.find(d => d.id === formData.driverId)?.name}</p>
                        <p><span className="font-medium">Ca:</span> {formData.type === 'MORNING' ? 'Ca sáng' : 'Ca chiều'}</p>
                      </div>
                      <div className="space-y-2">
                        <p><span className="font-medium">Thời gian:</span> {formData.startTime}</p>
                        <p><span className="font-medium">Ngày hoạt động:</span> {dayOptions.filter(d => formData.daysOfWeek.includes(d.value)).map(d => d.label).join(', ')}</p>
                        <p><span className="font-medium">Thời gian hiệu lực:</span> {formData.startDate} - {formData.endDate}</p>
                        <p><span className="font-medium">Trạng thái:</span> {formData.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm dừng'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="px-6 py-4 bg-gray-50 flex justify-between">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    ← Quay lại
                  </button>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Lưu nháp
                </button>
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Tiếp tục →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    ✅ Tạo lịch trình
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

