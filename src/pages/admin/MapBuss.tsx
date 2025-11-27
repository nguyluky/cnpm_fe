import { Bus, MapPin, Navigation, User } from "lucide-react";
import { useState } from "react";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl/mapbox";
import { Button } from "../../components/uiItem/button.tsx";
import { Card } from '../../components/uiItem/card.tsx';

const MAPBOX_TOKEN = "pk.eyJ1Ijoibmd1eWx1a3kxIiwiYSI6ImNtZ2Yxb2hoMjAzbW8yam9teHN1MGhiYXYifQ.5gyVRqeLYNO0lXUYIRgpJQ";

interface Bus {
  id: string;
  route: string;
  plate: string;
  status: "moving" | "late";
  driver: string;
  phone: string;
  currentLocation: string;
  pickupLocation: string;
  studentCount: number;
  students: { name: string; class: string; status: "onboard" | "waiting" }[];
  position: [number, number];
}

const mockBuses: Bus[] = [
  {
    id: "1",
    route: "29B-11111",
    plate: "51B-12345",
    status: "moving",
    driver: "Trần Văn B",
    phone: "0901234567",
    currentLocation: "Đường An Dương Vương, Quận 5",
    pickupLocation: "Tuyến 2 - Quận 3",
    studentCount: 22,
    students: [{ name: "Nguyễn Thành Luân", class: "Lớp 8C", status: "onboard" }],
    position: [106.6796834, 10.7599171],
  },
  {
    id: "2",
    route: "29B-11111",
    plate: "51B-67890",
    status: "late",
    driver: "Nguyễn Văn A",
    phone: "0909876543",
    currentLocation: "Gần Trường ĐH Sài Gòn",
    pickupLocation: "Tuyến 2 - Quận 3",
    studentCount: 18,
    students: [],
    position: [106.675, 10.755],
  },
];

export const Buss : React.FC = () => {
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [viewState, setViewState] = useState({
    latitude: 10.7599171,
    longitude: 106.6796834,
    zoom: 13.5,
  });

  return (
    <div className="flex flex-col bg-[#F0F4F8] w-full h-screen overflow-hidden">
      <div className="flex-1 flex flex-col xl:flex-row gap-5 p-5 xl:p-7">
        {/* Bản đồ */}
        <Card className="xl:w-2/3 w-full h-full min-h-[500px] p-0 overflow-hidden">
          <div className="p-5 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-700" />
              <span className="font-semibold text-xl">Bản đồ theo dõi vị trí xe Bus</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">Khu vực TP. Hồ Chí Minh • Tổng số xe: 3</div>
          </div>

          <div className="h-[calc(100%-80px)] rounded-lg overflow-hidden">
            <Map
              {...viewState}
              onMove={(evt) => setViewState(evt.viewState)}
              mapboxAccessToken={MAPBOX_TOKEN}
              mapStyle="mapbox://styles/mapbox/streets-v9"
              style={{ width: "100%", height: "100%" }}
            >
              <NavigationControl position="top-right" />
              {/* STATUS LEGEND */}
              <div className="absolute bottom-4 right-4 bg-white shadow-lg rounded-lg px-4 py-3 text-sm flex flex-col gap-2 z-50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Hoạt động</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Đang di chuyển</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Báo trễ</span>
                </div>
              </div>
              {mockBuses.map((bus) => (
                <Marker
                  key={bus.id}
                  longitude={bus.position[0]}
                  latitude={bus.position[1]}
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    setSelectedBus(bus);
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer transition-all ${
                      bus.status === "moving" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    <Bus className="w-5 h-5 text-white" />
                    {bus.status === "late" && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </Marker>
              ))}

              {selectedBus && (
                <Popup
                  longitude={selectedBus.position[0]}
                  latitude={selectedBus.position[1]}
                  anchor="bottom"
                  closeButton={false}
                  offset={20}
                  onClose={() => setSelectedBus(null)}
                  className="p-0"
                >
                  <div className="bg-black text-white px-4 py-2 rounded-t-lg font-semibold text-sm">
                    {selectedBus.route}
                  </div>
                  <div className="bg-white p-3 rounded-b-lg shadow-lg">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs">
                      Đang di chuyển
                    </Button>
                  </div>
                </Popup>
              )}
            </Map>
          </div>

          {/* Legend */}
          {/* <div className="flex justify-center gap-6 mt-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Hoạt động</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Đang di chuyển</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Báo trễ</span>
            </div>
          </div> */}
        </Card>

        {/* Panel chi tiết */}
        <div className="xl:w-1/3 w-full flex flex-col gap-5 overflow-y-auto">
          {selectedBus ? (
            <>
              {/* Thông tin xe */}
              <Card className="p-0 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Bus className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">{selectedBus.route}</div>
                      <div className="text-sm opacity-90">Đang di chuyển</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-600">Tài xế</div>
                      <div className="font-semibold">{selectedBus.driver}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Navigation className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-600">Tuyến đường</div>
                      <div className="font-semibold">{selectedBus.pickupLocation}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-600">Vị trí hiện tại</div>
                      <div className="font-semibold text-sm">{selectedBus.currentLocation}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Sức chứa</span>
                      <span className="font-bold text-blue-600">
                        {selectedBus.studentCount}/40 học sinh
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Học sinh trên xe */}
              <Card className="p-5">
                <div className="font-semibold text-lg mb-3">Học sinh trên xe ({selectedBus.students.length})</div>
                {selectedBus.students.length > 0 ? (
                  selectedBus.students.map((student, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                          L
                        </div>
                        <div>
                          <div className="font-semibold">{student.name}</div>
                          <div className="text-sm text-gray-600">{student.class}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">Chưa có học sinh lên xe</div>
                )}
              </Card>
            </>
          ) : (
            <Card className="p-8 text-center text-gray-500">
              <Bus className="w-16 h-16 mx-auto mb-3 text-gray-300" />
              <p>Chọn một xe buýt trên bản đồ để xem chi tiết</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}