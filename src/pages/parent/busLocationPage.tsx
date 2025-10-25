import { Card } from '../../components/uiItem/card.tsx';
import { MapPin } from "lucide-react";
import Map, { Layer, NavigationControl, Source } from "react-map-gl/mapbox";
import { useEffect, useState } from "react";
import { Button } from "../../components/uiItem/button.tsx";

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
          <Card className="xl:w-2/3 w-full min-w-[600px]">
            <div className="p-5 flex flex-col gap-5">
              <div className="h-fit flex gap-2">
                <MapPin />
                <span>Vi tri xe Bus</span>
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
                  <p>Tuyen 56 - Quan 2</p>
                </div>
                <Button variant='outline' size='md' className='justify-end text-white bg-[#1B763E] rounded-[20px] border-0'>Hoạt động</Button>
              </Card>
            </div>
          </Card>
          <div className='min-w-[600px] xl:min-w-[100px] flex flex-col gap-5'>
            <Card>Hello World</Card>
          </div>
        </div>
      </div >
    </div >
  );
}
