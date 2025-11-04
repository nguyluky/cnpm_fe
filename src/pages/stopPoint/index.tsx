import { useEffect, useState, type FormEvent } from 'react';
import Map, { Layer, /*Marker,*/ NavigationControl, Source } from 'react-map-gl/mapbox';
import { useApi } from '../../contexts/apiConetxt';
import type { StopPointsData } from '../../api/data-contracts';
import { useModal } from '../../contexts/modalContext';


interface AddStopPointModalProps {
    onSubmit: (formData: Omit<StopPointsData, 'id' | 'meta'> & { meta: StopPointsData['meta'] }) => void; // Gửi dữ liệu khi submit
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

    const { closeModal: onClose } = useModal();

    // Xử lý khi submit form
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault(); // Ngăn trang reload

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
        });

        // Đóng modal sau khi submit
        onClose();

        // (Tùy chọn) Reset form
        setName('');
        setLatitude(0);
        setLongitude(0);
        // ... reset các state khác nếu muốn
    };

    // Các lớp CSS chung cho input
    const inputClass = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    ";
    const labelClass = "block mb-2 text-sm font-medium text-gray-900 ";

    return (
        <div
            className="relative w-full max-w-xl transform rounded-lg bg-white p-6 shadow-xl transition-all "
        >
            {/* === Header === */}
            <div className="flex items-start justify-between pb-4 border-b rounded-t ">
                <h3 className="text-xl font-semibold text-gray-900 ">
                    Thêm Điểm dừng (Endpoint) mới
                </h3>
                <button
                    type="button"
                    className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900  "
                    onClick={onClose}
                >
                    {/* Icon "X" */}
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
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
                        Thêm Endpoint
                    </button>
                </div>
            </form>
        </div>
    );
};

function ModalConfirmDelete() {
    const { closeModal } = useModal();
    return (
        <div className="relative bg-white rounded-lg shadow-sm">
            <button onClick={closeModal} type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-hide="popup-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500"> you sure you want to delete this product?</h3>
                <button data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                    Yes, I'm sure
                </button>
                <button onClick={closeModal} type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"> cancel</button>
            </div>
        </div>
    )
}

interface StopPointsTableProps {
    stopPoints: StopPointsData[];
}

const StopPointsStripedTable: React.FC<StopPointsTableProps> = ({ stopPoints }) => {
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
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
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
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
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
                            <td className="px-6 py-4">
                                <button className="text-blue-600 hover:underline mr-4" onClick={() => {
                                    openModal(<AddStopPointModal editData={point} onSubmit={(formData) => {
                                        // Xử lý cập nhật điểm dừng ở đây
                                        console.log('Cập nhật điểm dừng:', formData);
                                    }} />);
                                }}>Edit</button>
                                <button className="text-red-600 hover:underline" onClick={() => {
                                    openModal(<ModalConfirmDelete />);
                                }}>Delete</button>
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
    const api = useApi();
    const [stopPoints, setStopPoints] = useState<StopPointsData[]>([]);
    const [selectedStopPoint, setSelectedStopPoint] = useState<string[]>([]);

    const [viewState, setViewState] = useState({
        zoom: 14,
        latitude: start[1],
        longitude: start[0],
    });


    useEffect(() => {
        const getStopPoints = async () => {
            const response = await api.getAllStoppoints();
            if (response && response.data) {
                setStopPoints(response.data?.data?.data || []);
            }

        }
        getStopPoints();
    }, [])

    const handleOpenModal = () => {
        openModal(<AddStopPointModal onSubmit={function (formData: Omit<StopPointsData, 'id' | 'meta'> & { meta: StopPointsData['meta']; }): void {
            throw new Error('Function not implemented.');
        }} />);
    }

    return (
        <div className="flex flex-row h-full w-full">
            <div className="w-2/3 h-screen grid grid-rows-[auto_1fr]">
                <div className="flex p-4 justify-between items-center">
                    <h1 className="text-2xl font-bold">Stop Points</h1>
                    <button className="btn btn-primary" onClick={handleOpenModal}>Add Stop Point</button>
                </div>

                <StopPointsStripedTable stopPoints={stopPoints} />

            </div>

            <div className="w-1/3 h-screen">
                <Map
                    {...viewState}
                    mapboxAccessToken="pk.eyJ1Ijoibmd1eWx1a3kxIiwiYSI6ImNtZ2Yxb2hoMjAzbW8yam9teHN1MGhiYXYifQ.5gyVRqeLYNO0lXUYIRgpJQ"
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                    onMove={evt => setViewState(evt.viewState)}
                >
                    <Source id="my-data" type="geojson" data={{
                        type: "FeatureCollection",
                        features: stopPoints.map((stop) => ({
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
                    <NavigationControl />
                </Map>
            </div>
        </div >
    );
}

