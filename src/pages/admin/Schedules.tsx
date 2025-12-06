import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, ChevronLeft, ChevronRight, Clock, Edit, Plus, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { BusData, RouteData, TimeTable } from "../../api/data-contracts";
import { AutoComplete } from "../../components/uiPart/AutoComplete";
import { useApi } from "../../contexts/apiConetxt";
import { useModal } from "../../contexts/modalContext";
import { cachedCallback } from "../../utils/cacheCallback";


interface ScheduleInfo {
    id: string;
    driver: {
        id: string;
        name: string;
        email: string;
    };
    bus: BusData;
    times: TimeTable;
    route: RouteData;
    meta: any;
    startDate: string;
    endDate: string;
    type: "DISPATCH" | "RETURN";
}

// Modal for Edit/Create Schedule
function EditAndCreateScheduleModal({
    type,
    defaultValue
}: {
    type?: 'edit' | 'create';
    defaultValue?: ScheduleInfo;
}) {
    const api = useApi();
    const queryClient = useQueryClient();
    const { closeModal } = useModal();
    const [formData, setFormData] = useState({
        busId: defaultValue?.bus?.id || "",
        routeId: defaultValue?.route?.id || "",
        driverId: defaultValue?.driver.id || "",
        times: defaultValue?.times || {
            dayOfWeek: [],
            departureTime: "06:45"
        },
        meta: defaultValue?.meta || {},
        startDate: defaultValue?.startDate || new Date().toISOString(),
        endDate: defaultValue?.endDate || "",
        type: defaultValue?.type || "DISPATCH" as "DISPATCH" | "RETURN"
    });

    // Fetch buses for dropdown
    const { data: busesData } = useQuery({
        queryKey: ['buses'],
        queryFn: async () => {
            const response = await api.api.getAllBuses();
            return response.data.data?.data || [];
        }
    });

    const [routeData, setRouteData] = useState<RouteData[]>([]);
    const [driverData, setDriverData] = useState<{
        id: string;
        username: string;
        roles: string[];
        email: string;
        createdAt: string;
        updatedAt: string;
    }[]>([]);
    const [busData, setBusData] = useState<BusData[]>(busesData || []);

    const [counter, setCounter] = useState(0);


    const queryFnDrivers = async (s: string) => {
        setCounter(e => e + 1);
        const getAllUser = cachedCallback(
            (search: string) => ['users', 'driver', search],
            async (search: string) => await api.api.getAllUsers({
                role: 'driver',
                search: search
            })
        )

        const getUserById = cachedCallback(
            (id: string) => ['user-by-id', id],
            async (id: string) => await api.api.getUserById(id)
        )

        const response = await getAllUser(s);
        const data = response.data.data?.data || [];
        if (s == "" && formData.driverId != "") {
            const response = await getUserById(formData.driverId);
            data.push(response.data.data!);
        }
        setDriverData(data);
        setCounter(e => e - 1);
        return data;
    }

    const queryFnBuses = async (s: string) => {
        setCounter(e => e + 1);

        const getAllBuses = cachedCallback(
            (search: string) => ['buses', search],
            async (search: string) => await api.api.getAllBuses({
                search: search
            })
        )

        const getBusById = cachedCallback(
            (id: string) => ['bus-by-id', id],
            async (id: string) => await api.api.getBusById(id)
        )


        const response = await getAllBuses(s);
        const data = response.data.data?.data || [];
        if (s == "" && formData.busId != "") {
            const response = await getBusById(formData.busId);
            data.push(response.data.data!);
        }
        setBusData(data);
        setCounter(e => e - 1);
        return data;
    }

    const queryFnRoutes = async (s: string) => {
        setCounter(e => e + 1);

        const getAllRoutes = cachedCallback(
            (search: string) => ['routes', search],
            async (search: string) => await api.api.getAllRoutes({
                search: search
            })
        )
        
        const getRouteById = cachedCallback(
            (id: string) => ['route-by-id', id],
            async (id: string) => await api.api.getRouteById(id)
        )

        const response = await getAllRoutes(s);
        const data = response.data.data?.data || [];
        if (s == "" && formData.routeId != "") {
            const response = await getRouteById(formData.routeId);
            data.push(response.data.data!);
        }
        setRouteData(data);
        setCounter(e => e - 1);
        return data;
    }

    const createNewSchedule = useMutation({
        mutationFn: async () => {

            console.log("formData", formData);
            if (type === 'create') {
                const response = await api.api.createANewSchedule({
                    driverId: formData.driverId,
                    busId: formData.busId,
                    routeId: formData.routeId,
                    times: formData.times,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    type: formData.type,
                });
                return response.data.data!;
            } else {
                await api.api.updateASchedule(defaultValue!.id, {
                    driverId: formData.driverId,
                    busId: formData.busId,
                    routeId: formData.routeId,
                    times: formData.times,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    type: formData.type,
                });

                return formData as any;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
            closeModal();
        }
    });

    return (
        <div className={"relative w-4xl transform rounded-lg bg-white p-8 shadow-xl transition-all " +
            (createNewSchedule.status === "pending" ? "pointer-events-none" : "")
        }>
            {(createNewSchedule.status === "pending" || counter > 0) && (
                <div className="absolute z-100 inset-0 bg-white/50 flex items-center justify-center rounded-lg">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            )}

            <h2 className="text-2xl font-semibold mb-6">
                {type === 'edit' ? 'Chỉnh sửa lịch trình' : 'Tạo lịch trình mới'}
            </h2>

            <form onSubmit={(e) => {
                e.preventDefault();
                createNewSchedule.mutate();
            }} className="space-y-6">

                <div className="grid grid-cols-2 gap-6">
                    {/* Xe buýt */}
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Xe buýt <span className="text-red-500">*</span></label>
                        <AutoComplete
                            placeholder="Tìm kiếm xe buýt..."
                            value={busData.find(bus => bus.id === formData.busId)}
                            onChange={(value) => {
                                setFormData({
                                    ...formData,
                                    busId: value ? value.id : ""
                                });
                            }}
                            fetchData={queryFnBuses}
                            renderItem={(item, isSelected) => (
                                <div className={`px-4 py-2 ${isSelected ? "bg-gray-100" : ""}`}>
                                    <div className="font-medium">{item?.licensePlate}</div>
                                    <div className="text-sm text-gray-500">Sức chứa: {item?.capacity || 'N/A'}</div>
                                </div>
                            )}
                            rightSlot={<X className="text-gray-400" size={16} onClick={() => {
                                setFormData({
                                    ...formData,
                                    busId: ""
                                });
                            }} />}
                            renderDisplay={(item) => {
                                return <div className="px-2 py-1">
                                    <div className="font-medium">{item?.licensePlate}</div>
                                    <div className="text-sm text-gray-500">Sức chứa: {item?.capacity || 'N/A'}</div>
                                </div>;
                            }}
                        />
                    </div>

                    {/* Tuyến đường */}
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Tuyến đường <span className="text-red-500">*</span></label>
                        <AutoComplete
                            placeholder="Tìm kiếm tuyến đường..."
                            value={routeData.find(route => route.id === formData.routeId)}
                            onChange={(value) => {
                                setFormData({
                                    ...formData,
                                    routeId: value ? value.id : ""
                                });
                            }}
                            fetchData={queryFnRoutes}
                            renderItem={(item, isSelected) => (
                                <div className={`px-4 py-2 ${isSelected ? "bg-gray-100" : ""}`}>
                                    <div className="font-medium">{item?.name}</div>
                                    <div className="text-sm text-gray-500">
                                        {
                                            item?.metadata.Distance + " m"
                                        }
                                    </div>
                                </div>
                            )}
                            rightSlot={<X className="text-gray-400" size={16} onClick={() => {
                                setFormData({
                                    ...formData,
                                    routeId: ""
                                });
                            }} />}
                            renderDisplay={(item) => {
                                return <div className="px-2 py-1">
                                    <div className="font-medium">{item?.name}</div>
                                    <div className="text-sm text-gray-500">
                                        {
                                            item?.metadata.Distance + " m"
                                        }
                                    </div>
                                </div>;
                            }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Tài xế */}
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Tài xế <span className="text-red-500">*</span></label>
                        <AutoComplete
                            placeholder="Tìm kiếm tài xế..."
                            value={driverData.find(driver => driver.id === formData.driverId)}
                            onChange={(value) => {
                                setFormData({
                                    ...formData,
                                    driverId: value ? value.id : ""
                                });
                            }}
                            fetchData={queryFnDrivers}
                            renderItem={(item, isSelected) => (
                                <div className={`px-4 py-2 ${isSelected ? "bg-gray-100" : ""}`}>
                                    <div className="font-medium">{item?.username}</div>
                                    <div className="text-sm text-gray-500">{item?.email}</div>
                                </div>
                            )}
                            rightSlot={<X className="text-gray-400" size={16} onClick={() => {
                                setFormData({
                                    ...formData,
                                    driverId: ""
                                });
                            }} />}
                            renderDisplay={(item) => {
                                return <div className="px-2 py-1">
                                    <div className="font-medium">{item?.username}</div>
                                    <div className="text-sm text-gray-500">{item?.email}</div>
                                </div>;
                            }}
                        />
                    </div>

                    {/* Loại chuyến */}
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Loại chuyến</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as "DISPATCH" | "RETURN" })}
                        >
                            <option value="DISPATCH">Đưa đón</option>
                            <option value="RETURN">Trở về</option>
                        </select>
                    </div>
                </div>

                {/* Thời gian và ngày trong tuần */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Giờ khởi hành</label>
                        <input
                            type="time"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.times.departureTime}
                            onChange={(e) => setFormData({
                                ...formData,
                                times: { ...formData.times, departureTime: e.target.value }
                            })}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Ngày trong tuần</label>
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { value: 1, label: "T2" },
                                { value: 2, label: "T3" },
                                { value: 3, label: "T4" },
                                { value: 4, label: "T5" },
                                { value: 5, label: "T6" },
                                { value: 6, label: "T7" },
                                { value: 7, label: "CN" }
                            ].map((day) => (
                                <label key={day.value} className="flex items-center space-x-1">
                                    <input
                                        type="checkbox"
                                        checked={formData.times.dayOfWeek.includes(day.value)}
                                        onChange={(e) => {
                                            const days = e.target.checked
                                                ? [...formData.times.dayOfWeek, day.value]
                                                : formData.times.dayOfWeek.filter(d => d !== day.value);
                                            setFormData({
                                                ...formData,
                                                times: { ...formData.times, dayOfWeek: days }
                                            });
                                        }}
                                        className="rounded"
                                    />
                                    <span className="text-sm">{day.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Ngày bắt đầu và kết thúc */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Ngày bắt đầu</label>
                        <input
                            type="datetime-local"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.startDate.slice(0, 16)}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value + ':00.000Z' })}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Ngày kết thúc</label>
                        <input
                            type="datetime-local"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.endDate.slice(0, 16)}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value + ':00.000Z' })}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        {type === 'edit' ? 'Cập nhật' : 'Tạo mới'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export const Schedules = () => {
    const api = useApi();
    const queryClient = useQueryClient();
    const { openModal } = useModal();
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);

    const { data, isLoading, error } = useQuery({
        queryKey: ['schedules', page],
        queryFn: async () => {
            // Replace with actual API call
            const response = await api.api.getAllSchedules({
                page: page,
            });
            return response.data.data;

            // Mock data for now
        },
    });

    const schedules = data?.data;
    const pagination = data?.meta;

    const handleAddSchedule = () => {
        openModal(<EditAndCreateScheduleModal type="create" />);
    };

    const handleEditSchedule = (schedule: ScheduleInfo) => {
        openModal(<EditAndCreateScheduleModal type="edit" defaultValue={schedule} />);
    };

    const handleDeleteSchedule = async (_id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa lịch trình này?')) {
            await api.api.deleteASchedule(_id);
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
        }
    };

    const filteredSchedules = schedules?.filter((schedule) =>
        schedule.route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.bus.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header with search and actions */}
            <div className="flex items-center justify-between mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm lịch trình..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleAddSchedule}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
                >
                    <Plus className="mr-2" size={18} />
                    Thêm lịch trình
                </button>
            </div>

            {/* Loading state */}
            {isLoading && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Đang tải...</p>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="text-center py-12 text-red-600">
                    <p className="mt-2">Đã có lỗi xảy ra khi tải dữ liệu.</p>
                </div>
            )}

            {/* Table */}
            {filteredSchedules && filteredSchedules.length > 0 && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tuyến đường
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Xe buýt
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Loại chuyến
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thời gian
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày trong tuần
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thời gian hoạt động
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSchedules.map((schedule) => (
                                <tr key={schedule.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{schedule.route.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{schedule.bus.licensePlate}</div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            <span className="font-medium">Tài xế:</span> {schedule.driver?.name || 'N/A'}
                                        </div>
                                        <div className="text-sm text-gray-500">Sức chứa: {schedule.bus.capacity || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${schedule.type === "DISPATCH" ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {schedule.type == "DISPATCH" ? "Đưa đón" : "Trở về"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Clock className="mr-2 text-gray-400" size={16} />
                                            <span className="text-sm text-gray-900">{schedule.times.departureTime}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {schedule.times.dayOfWeek && schedule.times.dayOfWeek.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {
                                                        schedule.times.dayOfWeek.map((time, idx) => (
                                                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                {(() => {
                                                                    // 1 = Thứ 2, 7 = Chủ nhật
                                                                    switch (time) {
                                                                        case 1:
                                                                            return 'Thứ 2';
                                                                        case 2:
                                                                            return 'Thứ 3';
                                                                        case 3:
                                                                            return 'Thứ 4';
                                                                        case 4:
                                                                            return 'Thứ 5';
                                                                        case 5:
                                                                            return 'Thứ 6';
                                                                        case 6:
                                                                            return 'Thứ 7';
                                                                        case 7:
                                                                            return 'Chủ nhật';
                                                                        default:
                                                                            return 'N/A';
                                                                    }
                                                                })()}
                                                            </span>
                                                        ))
                                                    }
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-500">Chưa thiết lập</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <Calendar className="mr-2 text-gray-400" size={14} />
                                                <span className="font-medium">Bắt đầu:</span>
                                                <span className="ml-1">{new Date(schedule.startDate).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="mr-2 text-gray-400" size={14} />
                                                <span className="font-medium">Kết thúc:</span>
                                                <span className="ml-1">
                                                    {schedule.endDate ? new Date(schedule.endDate).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                            onClick={() => handleEditSchedule(schedule)}
                                        >
                                            <Edit size={16} className="inline" />
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-900"
                                            onClick={() => handleDeleteSchedule(schedule.id)}
                                        >
                                            <Trash2 size={16} className="inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            {/* Mobile pagination */}
                            <button
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={true} // Replace with your pagination logic
                            >
                                Trước
                            </button>
                            <button
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={true} // Replace with your pagination logic
                            >
                                Sau
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Hiển thị{' '}
                                    <span className="font-medium">{
                                        pagination ? ((pagination.page - 1) * pagination.limit + 1) : "N/A"

                                    }</span>
                                    {' '}đến{' '}
                                    <span className="font-medium">{
                                        pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : "N/A"
                                    }</span>
                                    {' '}trên tổng số{' '}
                                    <span className="font-medium">{
                                        pagination ? pagination.total : "N/A"
                                    }</span>
                                    {' '}kết quả
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    {/* Previous button */}
                                    <button
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={pagination?.page === 1}
                                        onClick={() => {
                                            setPage((prev) => Math.max(prev - 1, 1));
                                        }}
                                    >
                                        <span className="sr-only">Trang trước</span>
                                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                    </button>

                                    {/* Page numbers */}
                                    {
                                        // Dynamically generate page numbers based on pagination data
                                        Array.from({ length: pagination?.totalPages || 0 }, (_, i) => i + 1).map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageNum === pagination?.page
                                                    ? 'bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                onClick={() => {
                                                    setPage(pageNum);
                                                }}
                                            >
                                                {pageNum}
                                            </button>
                                        ))
                                    }
                                    {/* Next button */}
                                    <button
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={pagination?.page === pagination?.totalPages}
                                        onClick={() => {
                                            setPage((prev) => (pagination ? Math.min(prev + 1, pagination.totalPages) : prev + 1));
                                        }}
                                    >
                                        <span className="sr-only">Trang sau</span>
                                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && filteredSchedules && filteredSchedules.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Không có lịch trình</h3>
                    <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách tạo lịch trình mới.</p>
                    <div className="mt-6">
                        <button
                            onClick={handleAddSchedule}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="mr-2" size={18} />
                            Thêm lịch trình
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedules;
