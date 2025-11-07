import { Card } from '../../components/uiItem/card.tsx';
import { MapPin } from "lucide-react";
import Map, { Layer, NavigationControl, Source } from "react-map-gl/mapbox";
import { useEffect, useState } from "react";
import { Button } from "../../components/uiItem/button.tsx";
import TeamLogo from "../../assets/vector_parent.png";
import { path } from "../../router/index.tsx";
import { useNavigate } from "react-router-dom";

interface StopPoint {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  }
}

const start = [106.6796834, 10.7599171];
export function BusLocationPage() {
  const navigate = useNavigate();
  const [stopPoints, setStopPoints] = useState<StopPoint[]>([]);
  const [selectedStopPoint, setSelectedStopPoint] = useState<string[]>([]);

  const [viewState, setViewState] = useState({
    zoom: 14,
    latitude: start[1],
    longitude: start[0],
  });


  useEffect(() => {
    const getStopPoints = async () => {
      const url = 'http://localhost:3000/api/stoppoints/';
      const options = { method: 'GET', headers: { Accept: 'application/json' } };

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
        setStopPoints(data.data.data);
      } catch (error) {
        console.error(error);
      }
    }
    getStopPoints();
  }, [])
  return (
    <div className="flex flex-col bg-[#E0E7FF] w-full h-full overflow-scroll">
      <div className="my-5 mx-7 flex-1">
        <div className="flex flex-col xl:flex-row gap-5">
          <Card className="xl:w-2/3 w-full min-w-[450px]">
            <div className="p-5 flex flex-col gap-5">
              <div className="h-fit flex gap-2">
                <MapPin className="m-1" />
                <span className="font-semibold text-xl">Vị trí xe Bus</span>
              </div>
              <div className="h-160 rounded-lg overflow-hidden">
                <Map
                  {...viewState}
                  mapboxAccessToken="pk.eyJ1Ijoibmd1eWx1a3kxIiwiYSI6ImNtZ2Yxb2hoMjAzbW8yam9teHN1MGhiYXYifQ.5gyVRqeLYNO0lXUYIRgpJQ"
                  mapStyle="mapbox://styles/mapbox/streets-v9"
                  onMove={evt => setViewState(evt.viewState)}
                >
                  {

                    // {...stopPoints.map((stop) => (
                    //     <Marker
                    //         key={stop.id}
                    //         longitude={stop.location.longitude}
                    //         latitude={stop.location.latitude}
                    //         color={selectedStopPoint.includes(stop.id) ? 'red' : 'blue'}
                    //     />
                    // ))}
                  }

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

              <Card className="justify-between h-20 pl-7 items-center bg-[#DBDFF0] flex flex-row gap-10 p-3">
                <div className='h-10 w-10 rounded-full bg-green-300'></div>
                <div className='w-6/10'>
                  <p className='text-xl font-semibold'>Xe Bus Airbus A320</p>
                  <p>Tuyến 56 - Quận 2</p>
                </div>
                <Button variant='outline' size='md' className='justify-end text-white bg-[#1B763E] rounded-[20px] border-0'>Hoạt động</Button>
              </Card>
            </div>
          </Card>
          <div className='min-w-[450px] xl:w-1/3 flex flex-col gap-5'>
            <Card>
              <div className="my-5">
                <div className="font-semibold text-xl m-5">Thông tin học sinh</div>
                <div className="justify-between bg-[#DCF2D8] rounded-xl m-5 flex flex-row gap-5 items-center">
                  <img src={TeamLogo} className="w-12 h-12 m-4" />
                  <div className="w-8/10">
                    <div className="font-semibold text-[20px]">Dương Tùng Thiện</div>
                    <div className="">Con ngoan của mẹ</div>
                  </div>
                </div>
                <div className="flex flex-row justify-between mx-6 my-3">
                  <span>Điểm đón: </span>
                  <span className="font-bold">Trường ĐH Sài Gòn</span>
                </div>
                <div className="flex flex-row justify-between mx-6 my-3">
                  <span>Trạng thái: </span>
                  <span className="text-[#A94B4B] font-bold">Đã lên xe</span>
                </div>
              </div>
            </Card>
            <Card className="p-5 flex flex-col gap-5">
              <div className="flex flex-row gap-5 justify-between items-center">
                <Button variant="ghost" size="icon" onClick={() => navigate(path.PARENT_NOTIFICATIONS)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                    <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
                  </svg>
                </Button>
                <span className="font-semibold text-[18px] w-12/13">Thông báo</span>
              </div>
              <div className="flex flex-col gap-2 p-5 px-10 bg-[#FEFCE8] rounded-xl border-l-4 border-l-[#FACC15]">
                <div className="font-semibold">Xe bus sẽ đến đón trong 5 phút</div>
                <div><span>1 phút trước</span></div>
              </div>

              <div className="flex flex-col gap-2 p-5 px-10 bg-[#F0FDF4] rounded-xl border-l-4 border-l-[#4ADE80]">
                <div className="font-semibold">Học sinh đã lên xe an toàn</div>
                <div><span>1 phút trước</span></div>
              </div>
            </Card>
          </div>
        </div>
      </div >
    </div >
  );
}
