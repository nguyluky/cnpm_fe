import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import Map, { Layer, /*Marker,*/ NavigationControl, Popup, Source, type MapRef } from 'react-map-gl/mapbox';
import { useApi } from '../../contexts/apiConetxt';
import type { StopPointsData } from '../../api/data-contracts';
import { useModal } from '../../contexts/modalContext';
import { Search } from 'lucide-react';
import type { MapLayerMouseEvent } from 'mapbox-gl';


interface AddStopPointModalProps {
    onSubmit: (formData: Omit<StopPointsData, 'id' | 'meta'> & { meta: StopPointsData['meta'] }) => Promise<void>; // Gửi dữ liệu khi submit
    editData?: StopPointsData; // Dữ liệu để chỉnh sửa (nếu có)
}

const AddStopPointModal: React.FC<AddStopPointModalProps> = ({ onSubmit, editData }) => {
    // Dùng state để quản lý dữ liệu của form
    // Khởi tạo state trống
    const [name, setName] = useState(editData ? editData.name : '');
    const [latitude, setLatitude] = useState(editData ? editData.location.latitude : 0);
    const [longitude, setLongitude] = useState(editData ? editData.location.longitude : 0);
    const [street, setStreet] = useState(editData ? editData.meta.street : '');
    const [ward, setWard] = useState(editData ? editData.meta.ward : '');
    const [zone, setZone] = useState(editData ? editData.meta.zone : '');
    const [status, setStatus] = useState<'Active' | 'Inactive'>(editData ? (editData.meta.status) : 'Active');
    const [supportDisability, setSupportDisability] = useState<'Yes' | 'No' | 'Unknown'>(editData ? editData.meta.supportDisability : 'Unknown');
    const [isLoading, setIsLoading] = useState(false);

    const { closeModal: onClose } = useModal();

    // Xử lý khi submit form
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault(); // Ngăn trang reload

        setIsLoading(true);
        // Gửi dữ liệu ra bên ngoài
        onSubmit({
            name,
            location: {
                latitude,
                longitude,
            },
            meta: {
                street,
                ward,
                zone,
                status,
                supportDisability,
            },
        }).finally(() => {
            setIsLoading(false);

            // Đóng modal sau khi submit
            onClose();
        });
    };

    // Các lớp CSS chung cho input
    const inputClass = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    ";
    const labelClass = "block mb-2 text-sm font-medium text-gray-900 ";

    return (
        <div
            className={"relative w-full max-w-xl transform rounded-lg bg-white p-6 shadow-xl transition-all" + (isLoading ? ' opacity-60 pointer-events-none' : '')} 
        >

            {
                isLoading && (
                    <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                )
            }

            {/* === Header === */}
            <div className="flex items-start justify-between pb-4 border-b rounded-t ">
                <h3 className="text-xl font-semibold text-gray-900 ">
                    {
                        editData ? 'Chỉnh sửa Điểm dừng' : 'Thêm Điểm dừng mới'
                    }
                </h3>
                <button
                    type="button"
                    className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900  "
                    onClick={onClose}
                >
                    {/* Icon "X" */}
                    <svg onClick={onClose} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
            </div>

            {/* === Form Body === */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* Grid 2 cột */}
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">

                    {/* Tên điểm dừng */}
                    <div className="sm:col-span-2">
                        <label htmlFor="name" className={labelClass}>
                            Tên điểm dừng (Endpoint Name)
                        </label>
                        <input
                            type="text"
                            id="name"
                            className={inputClass}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Vĩ độ (Latitude) */}
                    <div>
                        <label htmlFor="latitude" className={labelClass}>
                            Vĩ độ (Latitude)
                        </label>
                        <input
                            type="number"
                            id="latitude"
                            step="any" // Cho phép số thập phân
                            className={inputClass}
                            value={latitude}
                            onChange={(e) => setLatitude(parseFloat(e.target.value))}
                            required
                        />
                    </div>

                    {/* Kinh độ (Longitude) */}
                    <div>
                        <label htmlFor="longitude" className={labelClass}>
                            Kinh độ (Longitude)
                        </label>
                        <input
                            type="number"
                            id="longitude"
                            step="any"
                            className={inputClass}
                            value={longitude}
                            onChange={(e) => setLongitude(parseFloat(e.target.value))}
                            required
                        />
                    </div>

                    {/* Thông tin Meta */}
                    <h4 className="sm:col-span-2 text-lg font-medium text-gray-900  pt-2 border-t ">
                        Thông tin Meta
                    </h4>

                    {/* Đường */}
                    <div className="sm:col-span-2">
                        <label htmlFor="street" className={labelClass}>
                            Đường
                        </label>
                        <input
                            type="text"
                            id="street"
                            className={inputClass}
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                        />
                    </div>

                    {/* Phường */}
                    <div>
                        <label htmlFor="ward" className={labelClass}>
                            Phường (Ward)
                        </label>
                        <input
                            type="text"
                            id="ward"
                            className={inputClass}
                            value={ward}
                            onChange={(e) => setWard(e.target.value)}
                        />
                    </div>

                    {/* Khu vực (Zone) */}
                    <div>
                        <label htmlFor="zone" className={labelClass}>
                            Khu vực (Zone/Quận)
                        </label>
                        <input
                            type="text"
                            id="zone"
                            className={inputClass}
                            value={zone}
                            onChange={(e) => setZone(e.target.value)}
                        />
                    </div>

                    {/* Trạng thái */}
                    <div>
                        <label htmlFor="status" className={labelClass}>
                            Trạng thái
                        </label>
                        <select
                            id="status"
                            className={inputClass}
                            value={status}
                            onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Hỗ trợ */}
                    <div>
                        <label htmlFor="support" className={labelClass}>
                            Hỗ trợ người khuyết tật
                        </label>
                        <select
                            id="support"
                            className={inputClass}
                            value={supportDisability}
                            onChange={(e) => setSupportDisability(e.target.value as 'Yes' | 'No' | 'Unknown')}
                        >
                            <option value="Unknown">Không rõ</option>
                            <option value="Yes">Có</option>
                            <option value="No">Không</option>
                        </select>
                    </div>
                </div>

                {/* === Footer (Buttons) === */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                    <button
                        type="button" // Quan trọng: type="button" để không submit form
                        onClick={onClose}
                        className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        {editData ? 'Cập nhật Điểm dừng' : 'Thêm Điểm dừng'}
                    </button>
                </div>
            </form>
        </div>
    );
};

function ModalConfirmDelete({
    yesAction,

}: {
    yesAction?: () => Promise<void>;
}) {
    const { closeModal } = useModal();
    const [isLoading, setIsLoading] = useState(false);

    const handleYes = async () => {
        if (yesAction) {
            setIsLoading(true);
            await yesAction();
            setIsLoading(false);
        }
        closeModal();
    };
    return (
        <div className="relative bg-white rounded-lg shadow-sm">
            <button onClick={closeModal} type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-hide="popup-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500"> you sure you want to delete this product?</h3>
                <button onClick={handleYes} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                    {
                        isLoading ? (
                            <>
                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                </svg>
                                Loading...
                            </>
                        ) : "Yes, I'm sure"
                    }
                </button>
                <button onClick={closeModal} type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"> cancel</button>
            </div>
        </div>
    )
}

interface StopPointsTableProps {
    stopPoints: StopPointsData[];
    setViewState?: (viewState: { zoom: number; latitude: number; longitude: number }) => void;
    updateStopPoint?: (id: string, data: Omit<StopPointsData, 'id' | 'meta'> & { meta: StopPointsData['meta'] }) => void;
    deleteStopPoint?: (id: string) => Promise<void>;
}

const StopPointsStripedTable: React.FC<StopPointsTableProps> = ({ stopPoints, setViewState, updateStopPoint, deleteStopPoint }) => {
    const { openModal } = useModal();

    // Hàm helper để ghép địa chỉ
    const getFullAddress = (meta: StopPointsData['meta']) => {
        const addressParts = [
            meta.addressNo,
            meta.street,
            meta.ward,
            meta.zone,
        ].filter(Boolean); // Lọc ra các giá trị rỗng

        return addressParts.join(', ') || 'N/A';
    };

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 ">

                {/* === PHẦN HEADER CỦA BẢNG === */}
                {/* Áp dụng style sọc cho cột 1 và 3 */}
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Đại chỉ
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Vị trí (Lat, Lng)
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Actions
                        </th>
                    </tr>
                </thead>

                {/* === PHẦN BODY CỦA BẢNG (ĐỘNG) === */}
                <tbody>
                    {stopPoints.map((point) => (
                        <tr
                            key={point.id}
                            className="odd:bg-white even:bg-gray-50  border-b border-gray-200"
                        >
                            {/* Cột 1: Tên (Sọc) */}
                            <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900"
                            >
                                {point.name}
                            </th>

                            {/* Cột 2: Địa chỉ (Thường) */}
                            <td className="px-6 py-4">
                                {getFullAddress(point.meta)}
                            </td>

                            {/* Cột 4: Vị trí (Thường) */}
                            <td className="px-6 py-4">
                                {point.location.latitude.toFixed(4)}, {point.location.longitude.toFixed(4)}
                            </td>

                            {/* Cột 5: Actions (Thường) */}
                            <td className="px-6 py-4 flex space-x-4">
                                <button className="text-blue-600 hover:underline" onClick={() => {
                                    openModal(<AddStopPointModal editData={point} onSubmit={(data) => {
                                        if (updateStopPoint) {
                                            updateStopPoint(point.id, data);
                                        }
                                    }} />);
                                }}>Edit</button>
                                <button className="text-red-600 hover:underline" onClick={() => {
                                    openModal(<ModalConfirmDelete yesAction={async () => {
                                        if (deleteStopPoint) await deleteStopPoint(point.id);
                                    }} />);
                                }}>Delete</button>
                                <button className="text-green-600 hover:underline" onClick={() => {
                                    if (setViewState) {
                                        setViewState({
                                            zoom: 16,
                                            latitude: point.location.latitude,
                                            longitude: point.location.longitude,
                                        });
                                    }
                                }}>View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const start = [106.660172, 10.762622];
export function StopsPointsPage() {
    const { openModal } = useModal();
    const { api } = useApi();
    const mapRef = useRef<MapRef>(null); // <--- 1. Tạo ref để truy cập map instance

    const [allStopPoints, setAllStopPoints] = useState<StopPointsData[]>([]);
    const [visibleStopPoints, setVisibleStopPoints] = useState<StopPointsData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [selectedStopPoint, setSelectedStopPoint] = useState<string[]>([]);
    const [popupInfo, setPopupInfo] = useState<StopPointsData | null>(null);
    const [cursor, setCursor] = useState<string>('auto');
    const [viewState, setViewState] = useState({
        zoom: 14,
        latitude: start[1],
        longitude: start[0],
    });

    // Hàm lọc dữ liệu dựa trên bounds hiện tại của map
    const updateVisiblePoints = useCallback(() => {
        if (!mapRef.current || allStopPoints.length === 0) return;

        const map = mapRef.current.getMap();
        const bounds = map.getBounds(); // Lấy giới hạn 4 góc hiện tại
        if (map.getZoom() < 12) {
            // Nếu zoom quá xa, không lọc ẩn tắt cả
            setVisibleStopPoints([]);
            return;
        }
        if (!bounds) return;

        // Lọc các điểm nằm trong bounds
        const filtered = allStopPoints.filter((point) => {
            // bounds.contains([lng, lat]) kiểm tra xem tọa độ có nằm trong vùng nhìn thấy không
            return bounds.contains([point.location.longitude, point.location.latitude]);
        });

        setVisibleStopPoints(filtered);
    }, [allStopPoints]);

    // 1. Tải dữ liệu ban đầu
    useEffect(() => {
        const getStopPoints = async () => {
            const response = await api.getAllStoppoints();
            if (response && response.data) {
                const data = response.data?.data?.data || [];
                setAllStopPoints(data);
                // Chưa setVisibleStopPoints ngay ở đây, để useEffect bên dưới lo
            }
        }
        setIsLoading(true);
        getStopPoints().finally(() => setIsLoading(false));
    }, []);

    // 2. Mỗi khi allStopPoints thay đổi (lúc mới tải xong) hoặc map đã sẵn sàng, cập nhật list hiển thị lần đầu
    useEffect(() => {
        // Chạy lần đầu khi có dữ liệu
        updateVisiblePoints();
    }, [allStopPoints, updateVisiblePoints]);


    const pointsToRender = useMemo(() => {
        // Ưu tiên 1: Nếu đang tìm kiếm, lọc trong TOÀN BỘ dữ liệu
        if (searchTerm.trim() !== '') {
            const lowerTerm = searchTerm.toLowerCase();
            return allStopPoints.filter(point =>
                point.name.toLowerCase().includes(lowerTerm)
                // Có thể thêm điều kiện tìm theo địa chỉ nếu muốn:
                // || point.meta.street.toLowerCase().includes(lowerTerm)
            );
        }

        // Ưu tiên 2: Nếu không tìm kiếm, chỉ hiển thị các điểm trong Viewport
        return visibleStopPoints;
    }, [searchTerm, allStopPoints, visibleStopPoints]);

    const createStopPoint = async (fromData: Omit<StopPointsData, 'id' | 'meta'> & { meta: StopPointsData['meta'] }) => {
        await api.createANewStoppoint({
            sequence: 0,
            name: fromData.name,
            location: fromData.location,
            meta: fromData.meta,
        }).then((response) => {
            // TODO: Xử lý sau khi tạo thành công
            // Thêm điểm mới vào danh sách
            if (response && response.data) {

                // const newPoint = response.data;
                // setAllStopPoints(prev => [...prev, newPoint]);
            }
        });
    }

    const updateStopPoint = async (id: string, formData: Omit<StopPointsData, 'id' | 'meta'> & { meta: StopPointsData['meta'] }) => {
        // TODO: chưa update api
        await api.updateAStoppoint(id, {
            name: formData.name,
            location: formData.location,
            sequence: 0
        }).then((response) => {
            if (response && response.data) {
                // Cập nhật điểm trong danh sách
                setAllStopPoints(prev => prev.map(p => p.id === id ? { ...p, ...formData } : p));
            }
        });
    }

    const deleteStopPoint = async (id: string) => {
        const response = await api.deleteAStoppoint(id);
        if (response && response.data) {
            // Xoá điểm khỏi danh sách
            setAllStopPoints(prev => prev.filter(p => p.id !== id));
        }
    }

    const handleOpenModal = () => {
        openModal(<AddStopPointModal onSubmit={createStopPoint} />);
    }

    const onMapClick = useCallback((event: MapLayerMouseEvent) => {
        // Lấy các feature tại điểm click từ layer có id là 'point'
        const features = event.features || [];
        const clickedFeature = features.find(f => f.layer.id === 'point');

        if (clickedFeature) {
            const { id, name } = clickedFeature.properties || {};
            const [longitude, latitude] = clickedFeature.geometry.coordinates;
            const fullData = allStopPoints.find(p => p.id === id) || {
                id, name, location: { longitude, latitude }
            } as StopPointsData; // Ép kiểu tạm nếu tìm không thấy (hiếm khi xảy ra)

            // console.log('Clicked Stop Point:', fullData);
            setPopupInfo(fullData);
        } else {
            // Nếu click ra ngoài thì đóng popup
            // setPopupInfo(null); // Tùy chọn: muốn click ra ngoài thì đóng hay không
        }
    }, [allStopPoints]);

    const renderPopup = useMemo(() => {
        return popupInfo && (
            <Popup
                longitude={popupInfo.location.longitude}
                latitude={popupInfo.location.latitude}
                anchor="bottom" // Neo popup ở phía dưới điểm
                offset={15}     // Cách điểm một chút cho đẹp
                onClose={() => setPopupInfo(null)} // Xử lý khi bấm nút X trên popup
                closeOnClick={false} // Quan trọng: để click vào popup không bị đóng ngay lập tức
                className="z-50"     // Đảm bảo nó nổi lên trên
                closeOnMove={true} // Đóng popup khi di chuyển bản đồ
            >
                <div className="p-2 max-w-xs">
                    <h3 className="font-bold text-sm">{popupInfo.name}</h3>
                    {/* Hiển thị thêm thông tin nếu muốn */}
                    {popupInfo.meta && (
                        <p className="text-xs text-gray-600 mt-1">
                            {popupInfo.meta.addressNo} {popupInfo.meta.street}, {popupInfo.meta.ward}
                        </p>
                    )}
                    <div className="mt-2 flex justify-end space-x-2 text-xs">
                        {/* Ví dụ thêm nút thao tác nhanh trong Popup */}
                        <button
                            className="text-blue-600 hover:underline"
                            onClick={() => {
                                openModal(<AddStopPointModal editData={popupInfo} onSubmit={(data) => updateStopPoint(popupInfo.id, data)} />);
                            }}
                        >
                            Edit
                        </button>
                    </div>
                </div>
            </Popup>
        );
    }, [popupInfo]);

    return (
        <div className="flex flex-row h-full w-full">
            <div className="w-full h-screen grid grid-rows-[auto_1fr]">
                <div className="flex p-4 items-center">
                    <div className="flex-grow flex">
                        <h1 className="text-2xl font-bold">
                            Stop Points
                            {/* Hiển thị số lượng đang render để debug cho dễ */}
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                (Showing {pointsToRender.length} / {allStopPoints.length})
                            </span>
                        </h1>
                        <div className="relative w-1/3 ms-6">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <Search className="w-4 h-4" />
                            </div>
                            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" placeholder="Search branch name..." required />
                        </div>
                    </div>

                    <button className="btn btn-primary" onClick={handleOpenModal}>Add Stop Point</button>
                </div>

                {
                    isLoading ? (
                        <div className="flex-grow flex items-center justify-center">
                            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
                            <p> Loading stop points...</p>
                        </div>
                    ) :
                        <StopPointsStripedTable stopPoints={pointsToRender} setViewState={setViewState} deleteStopPoint={deleteStopPoint} />
                }

            </div>

            <div className="min-w-[700px] h-screen">
                <Map
                    ref={mapRef} // <--- Gắn ref vào Map
                    {...viewState}
                    mapboxAccessToken="pk.eyJ1Ijoibmd1eWx1a3kxIiwiYSI6ImNtZ2Yxb2hoMjAzbW8yam9teHN1MGhiYXYifQ.5gyVRqeLYNO0lXUYIRgpJQ"
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                    onMove={evt => setViewState(evt.viewState)}
                    onMoveEnd={updateVisiblePoints} // <--- Gọi hàm lọc khi DỪNG di chuyển
                    onLoad={updateVisiblePoints}    // <--- Gọi hàm lọc khi map load xong
                    onClick={onMapClick}  // <--- Xử lý click trên map
                    interactiveLayerIds={['point']}
                    onMouseEnter={() => setCursor('pointer')}
                    onMouseLeave={() => setCursor('auto')}
                    onMouseDown={(event) => {
                        // console.log('Map clicked at: ', event.lngLat);
                        openModal(<AddStopPointModal editData={{
                            id: '',
                            name: '',
                            location: {
                                latitude: event.lngLat.lat,
                                longitude: event.lngLat.lng,
                            },
                            meta: {
                                addressNo: '',
                                street: '',
                                ward: '',
                                zone: '',
                                status: 'Active',
                                supportDisability: 'Unknown',
                            }
                        }} onSubmit={async () => {}}/>)
                        // event.point
                    }}
                    cursor={cursor}
                >
                    <Source id="my-data" type="geojson" data={{
                        type: "FeatureCollection",
                        // Dùng visibleStopPoints để map cũng nhẹ hơn (tùy chọn, Mapbox chịu tải tốt hơn React Table)
                        features: pointsToRender.map((stop) => ({
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [stop.location.longitude, stop.location.latitude],
                            },
                            properties: {
                                id: stop.id,
                                name: stop.name,
                                selected: selectedStopPoint.includes(stop.id),
                            }
                        }))
                    }}>
                        <Layer
                            id="point"
                            type="circle"
                            paint={{
                                'circle-radius': 8,
                                'circle-color': [
                                    'case',
                                    ['get', 'selected'],
                                    '#f00',
                                    '#00f'
                                ],
                                'circle-stroke-width': 2,
                                'circle-stroke-color': '#fff'
                            }}
                        />
                    </Source>
                    {renderPopup}
                    <NavigationControl />
                </Map>
            </div>
        </div >
    );
}
