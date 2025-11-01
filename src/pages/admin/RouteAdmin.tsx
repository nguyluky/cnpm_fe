import { Card } from '../../components/uiItem/card.tsx';
import { Button } from '../../components/uiItem/button.tsx';
import { MapPin, Bell } from "lucide-react";
import Map, { Layer, NavigationControl, Source, Popup, Marker } from "react-map-gl/mapbox";
import { useEffect, useState } from "react";
const MAPBOX_TOKEN = "pk.eyJ1Ijoibmd1eWx1a3kxIiwiYSI6ImNtZ2Yxb2hoMjAzbW8yam9teHN1MGhiYXYifQ.5gyVRqeLYNO0lXUYIRgpJQ";
import { Bus, AlertTriangle, User, Route, Clock, Plus,Search } from "lucide-react";

interface StopPoint {
  id: string;
  name: string;
  location: { latitude: number; longitude: number };
}

interface Route {
  id: string;
  name: string;
  district: string;
  distance: string;
  time: string;
  students: number;
  active: boolean;
}

const mockStopPoints: StopPoint[] = [
  { id: "1", name: "Bến xe Bến Thành", location: { latitude: 10.771, longitude: 106.698 } },
  { id: "2", name: "Công viên 23/9", location: { latitude: 10.768, longitude: 106.695 } },
  { id: "3", name: "Chợ Bến Thành", location: { latitude: 10.772, longitude: 106.699 } },
];

const mockRoutes: Route[] = [
  {
    id: "1",
    name: "Tuyến đường qua Quận 1 và trung tâm TPHCM",
    district: "Quận 1",
    distance: "12",
    time: "45",
    students: 18,
    active: true,
  },
  {
    id: "2",
    name: "Tuyến đường qua Quận 3",
    district: "Quận 3",
    distance: "8",
    time: "35",
    students: 22,
    active: true,
  },
];

const busLocation = [106.698, 10.771]; // Vị trí xe bus

export const RouteAdmin : React.FC = () => {
  const [stopPoints] = useState<StopPoint[]>(mockStopPoints);
  const [selectedRoute] = useState<Route | null>(mockRoutes[0]);
  const [viewState, setViewState] = useState({
    latitude: 10.771,
    longitude: 106.698,
    zoom: 14,
  });
  const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-2/5">
          <input
            type="text"
            placeholder="Tìm kiếm tuyến đường..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded-lg focus:outline-non"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <Button variant="default" 
        className="bg-indigo-500 text-white flex items-center w-50 h-10"
         onClick={() => setShowForm(true)}>
          <Plus className="mr-2" size={18} /> Tạo tuyến mới
        </Button>
        
        
      </div>
      <div className="flex-1  my-5 flex flex-col xl:flex-row gap-5 overflow-hidden">
        {/* Left Column - Danh sách tuyến */}
        <Card className="xl:w-96 w-full h-fit xl:h-full overflow-y-auto p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-0">
            <h2 className="text-lg font-semibold">Quản lý tuyến đường</h2>

         {showForm && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-40">
                  <div className="bg-white p-6 rounded-xl shadow-lg w-[600px] animate-scale-in">
        
                    <h2 className="text-xl font-semibold mb-4">
                      Thêm học sinh mới
                    </h2>
        

                    <div className="flex flex-col w-full">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                          Tên tuyến
                        </label>
                        <input
                          type="text"
                          placeholder="Tuyến 3 - Quận 5"
                          className="border rounded p-2 w-full mb-4"
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                          Tên tuyến
                        </label>
                        <textarea
                          className="border p-2 rounded w-full"
                          
                          placeholder="Nhập mô tả..."
                        ></textarea>
                    </div>
                    <div className="flex gap-4 mb-4">
                      
                    <div className="flex flex-col w-1/2">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Khoảng cách
                    </label>
                    <input
                      type="text"
                      placeholder="10 Km"
                      className="border rounded p-2 w-full mb-4"
                    />
                     </div>
        
        
                    <div className="flex flex-col w-1/2">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Thời gian dự kiến
                    </label>
                    <input
                      type="text"
                      placeholder="30 phút"
                      className="border rounded p-2 w-full mb-4"
                    />
                     </div>
                    </div>
        
                    {/* Buttons */}
                    <div className="flex justify-end gap-2">
                      <Button  onClick={() => setShowForm(false)}>
                        Hủy
                      </Button>
                      <Button className="bg-indigo-600 text-white">
                        Thêm học sinh
                      </Button>
                    </div>
                  </div>
                </div>
              )}
          </div>
          <p className="text-sm text-gray-600">Tạo và quản lý các tuyến đường xe Bus</p>

          <div className="flex flex-col gap-3">
            {mockRoutes.map((route) => (
            <Card
              key={route.id}
              className={`p-4 rounded-xl border ${
                selectedRoute?.id === route.id ? "border-[#6366F1]" : "border-gray-200"
              } bg-white cursor-pointer hover:shadow-sm transition-shadow`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-base">
                    Tuyến {route.id} - {route.district}
                  </h3>
                  <p className="text-sm text-gray-600  max-w-[200px] break-words">{route.name}</p>
                </div>
                <span className="px-2 py-1 bg-[#D3FDCB] text-[#38B76A] rounded-full text-xs font-semibold">
                  Hoạt động
                </span>
              </div>

              {/* flex-col để hiển thị theo chiều dọc */}
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  {route.distance}Km
                </span>

                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {route.time} phút
                </span>

                <span className="flex items-center gap-1">
                  <User size={16} />
                  {route.students} học sinh 
                </span>
              </div>
            </Card>

            ))}
          </div>
        </Card>

        {/* Right Column - Bản đồ + Thông tin */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Bản đồ */}
          <Card className="flex-1 min-h-196">
            <div className="p-5 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold text-xl">Tuyến 1 - Quận 1</span>
              </div>

              <div className="flex-1 rounded-lg overflow-hidden relative">
              <Map
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                mapboxAccessToken={MAPBOX_TOKEN}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                style={{ width: "100%", height: "100%" }}
              >
                  {/* Vị trí xe bus */}
                  <Source
                    id="bus-location"
                    type="geojson"
                    data={{
                      type: "Feature",
                      geometry: { type: "Point", coordinates: busLocation },
                      properties: {},
                    }}
                  >
                    <Layer
                      id="bus-point"
                      type="circle"
                      paint={{
                        "circle-radius": 12,
                        "circle-color": "#1B763E",
                        "circle-stroke-width": 3,
                        "circle-stroke-color": "#fff",
                      }}
                    />
                  </Source>

                  {/* Điểm dừng */}
                  <Source
                    id="stop-points"
                    type="geojson"
                    data={{
                      type: "FeatureCollection",
                      features: stopPoints.map((stop, idx) => ({
                        type: "Feature",
                        geometry: {
                          type: "Point",
                          coordinates: [stop.location.longitude, stop.location.latitude],
                        },
                        properties: { id: stop.id, name: stop.name, index: idx + 1 },
                      })),
                    }}
                  >
                    <Layer
                      id="stops-circle"
                      type="circle"
                      paint={{
                        "circle-radius": 10,
                        "circle-color": "#3B82F6",
                        "circle-stroke-width": 2,
                        "circle-stroke-color": "#fff",
                      }}
                    />
                    <Layer
                      id="stops-label"
                      type="symbol"
                      layout={{
                        "text-field": ["get", "index"],
                        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                        "text-size": 12,
                        "text-offset": [0, 0],
                      }}
                      paint={{
                        "text-color": "#fff",
                      }}
                    />
                  </Source>

                  <NavigationControl position="top-right" />
                </Map>
              </div>

              {/* Thông tin xe */}
              <div className="flex gap-4 mt-4">
                {/* Card thông tin xe */}
                <Card className="flex-1 p-4 bg-[#F9FAFB] flex items-center gap-3">
                 
                  <div>
                    <p className="text-sm text-gray-600">Xe Bus</p>
                    <p className="font-semibold text-lg">29A-12345</p> 
                  </div>
                </Card>

                {/* Card tài xế */}
                <Card className="flex-1 p-4 bg-[#F9FAFB] flex flex-col justify-center text-left">
                  <p className="text-sm">Tài xế</p>
                  <p className="font-semibold">Nguyễn Văn A</p>
                </Card>
              </div>


              {/* Danh sách điểm đón */}
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Điểm đón (3)</h4>
                {stopPoints.map((stop, idx) => (
                  <Card
                    key={stop.id}
                    className="p-3 flex items-center gap-3 bg-[#DDEDF4] border border-gray-200"
                  >
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{stop.name}</p>
                      <p className="text-xs text-gray-500">
                        {idx === 0 && "Lê Lợi, Quận 1"}
                        {idx === 1 && "Phạm Ngũ Lão, Q1"}
                        {idx === 2 && "Lê Thánh Tôn, Q1"}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {idx === 0 && "07:00"}
                      {idx === 1 && "07:10"}
                      {idx === 2 && "07:20"}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}