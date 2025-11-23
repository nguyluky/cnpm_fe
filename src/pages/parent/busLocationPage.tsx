import Map, { type MapRef } from "react-map-gl/mapbox";
import { useRef, useState } from "react";
import { ChevronUp, Search } from "lucide-react";

const mockStudent = [
    {
        id: 1,
        name: "John Doe",
        age: 10,
        location: "123 Main St, Cityville",
        avatarUrl: "https://avatar.iran.liara.run/public"
    },
    {
        id: 2,
        name: "Jane Smith",
        age: 9,
        location: "456 Oak Ave, Townsville",
        avatarUrl: "https://avatar.iran.liara.run/public"
    },
    {
        id: 3,
        name: "Sam Johnson",
        age: 11,
        location: "789 Pine Rd, Villagetown",
        avatarUrl: "https://avatar.iran.liara.run/public"
    }
]

export function BusLocationPage() {
    const mapRef = useRef<MapRef>(null);
    const [viewState, setViewState] = useState({
        longitude: 106.660172,
        latitude: 10.762622,
        zoom: 12
    });
    const [selectedStudent, setSelectedStudent] = useState(mockStudent[0]);
    const [showStudentList, setShowStudentList] = useState(false);

    return <>
        <Map
            ref={mapRef} // <--- Gắn ref vào Map
            {...viewState}
            mapboxAccessToken="pk.eyJ1Ijoibmd1eWx1a3kxIiwiYSI6ImNtZ2Yxb2hoMjAzbW8yam9teHN1MGhiYXYifQ.5gyVRqeLYNO0lXUYIRgpJQ"
            mapStyle="mapbox://styles/mapbox/streets-v9"
            onMove={evt => setViewState(evt.viewState)}
        >
        </Map>

        {
            // student info overlay
        }
        <div className="absolute z-10 flex bottom-19 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 rounded-lg shadow-lg py-2 px-3 w-11/12 max-w-md">
            <div className="relative w-full" >
                <div className="flex items-center space-x-4">
                    <img
                        src={selectedStudent?.avatarUrl}
                        alt="Student Avatar"
                        className="w-16 h-16 rounded-full border-2 border-blue-500"
                    />
                    <div>
                        <h2 className="text-sm font-semibold text-gray-800">
                            {selectedStudent?.name}
                        </h2>
                        <p className="text-xs text-gray-600">
                            Age: {selectedStudent?.age}
                        </p>
                        <p className="text-xs text-gray-600 truncate">Location: {selectedStudent?.location}</p>
                    </div>
                </div>

                {
                    // arrow showing more student
                }
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2" onClick={() => setShowStudentList(!showStudentList)}>
                    <ChevronUp className="w-6 h-6 text-gray-500" />
                </div>
            </div>
            {
                showStudentList &&
                <div className="absolute bottom-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
                    {mockStudent.map((student) => (
                        <div
                            key={student.id}
                            className="flex items-center space-x-4 p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                setSelectedStudent(student);
                                setShowStudentList(false);
                            }}
                        >
                            <img
                                src={student.avatarUrl}
                                alt="Student Avatar"
                                className="w-10 h-10 rounded-full border-2 border-blue-500"
                            />
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800">
                                    {student.name}
                                </h3>
                                <p className="text-xs text-gray-600">
                                    Age: {student.age}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            }

        </div>
        {
            // search bar
        }
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md bg-white bg-opacity-90 rounded-lg shadow-lg flex 
                    items-center
                    border border-slate-300
                    focus-within:border-blue-500

                    ">
            <input
                type="text"
                placeholder="Search for routes, stops..."
                className="w-full py-2 rounded-lg outline-none px-4 bg-transparent text-gray-700"
            />
            <Search className="w-6 h-6 text-gray-500 m-2" />
        </div>

    </>
}
