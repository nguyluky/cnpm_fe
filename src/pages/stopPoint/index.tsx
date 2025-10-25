import { useEffect, useState } from 'react';
import Map, { Layer, /*Marker,*/ NavigationControl, Source } from 'react-map-gl/mapbox';

interface StopPoint {
    id: string;
    name: string;
    location: {
        latitude: number;
        longitude: number;
    }
}


const start = [106.660172, 10.762622];
export function StopsPointsPage() {
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
        <div className="flex flex-row h-full w-full">
            <div className="w-1/2 h-screen grid grid-rows-[auto_1fr]">
                <div className="flex p-4 justify-between items-center">
                    <h1 className="text-2xl font-bold">Stop Points</h1>
                    <button className="btn btn-primary">Add Stop Point</button>
                </div>
                <div className="overflow-x-auto h-full">
                    <table className="table table-pin-rows">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Pos</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stopPoints.map((stop) => (
                                <tr key={stop.id} onClick={() => {
                                    setViewState({
                                        ...viewState,
                                        latitude: stop.location.latitude,
                                        longitude: stop.location.longitude,
                                    })
                                    if (selectedStopPoint.includes(stop.id)) {
                                        setSelectedStopPoint(selectedStopPoint.filter(id => id !== stop.id));
                                    } else {
                                        setSelectedStopPoint([...selectedStopPoint, stop.id]);
                                    }
                                }} className={"hover cursor-pointer " + (selectedStopPoint.includes(stop.id) ? 'bg-primary/20' : '')}>
                                    <td className='max-w-[60px] truncate'>{stop.id}</td>
                                    <td>{stop.name}</td>
                                    <td>{`[${stop.location.latitude}, ${stop.location.longitude}]`}</td>
                                    <td>
                                        <button className="btn btn-error btn-sm">x</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


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
    );
}

export { Sidebar } from '../../components/uiPart/Sidebar';
export { Header } from '../../components/uiPart/Header';
export { WelcomeBanner } from '../../components/uiPart/WelcomeBanner';
export { ScheduleCard } from '../../components/uiPart/ScheduleCard';
export { TripCard } from '../../components/uiPart/TripCard';
export { QuickInfoSidebar } from '../../components/uiPart/QuickInfoSidebar';

// Export layout
export { DriverLayout } from '../../layouts/DriverLayout';
// Export pages
export { WorkSchedulePage } from '../driver/WorkSchedulePage';
export { StudentListPage } from '../driver/StudentListPage';
export { NotificationsPage } from '../driver/NotificationsPage';

// Export types
export type { Driver, ScheduleCardProps } from '../../components/uiPart/ScheduleCard';
export type { TripCardProps } from '../../components/uiPart/TripCard';
export type { QuickInfoProps } from '../../components/uiPart/QuickInfoSidebar';
