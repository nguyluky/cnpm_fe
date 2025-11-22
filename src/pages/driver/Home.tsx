// import { useState } from 'react';
// import { Badge } from '../../components/uiItem/badge';
// import { Button } from '../../components/uiItem/button';
// import { Card } from '../../components/uiItem/card';
// import {
//     // mockTodaySchedules,
//     mockTripDetail,
//     type Schedule,
//     type Stop,
//     type TripDetail
// } from '../../mockData/driverMockData';
//
// export default function DriverHome() {
//   const [selectedTrip, setSelectedTrip] = useState<TripDetail | null>(null);
//   const [currentLocation, setCurrentLocation] = useState({ lat: 10.762622, lng: 106.660172 });
//
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'PLANNED': return 'bg-blue-100 text-blue-800';
//       case 'ONGOING': return 'bg-green-100 text-green-800';
//       case 'COMPLETED': return 'bg-gray-100 text-gray-800';
//       case 'CANCELLED': return 'bg-red-100 text-red-800';
//       case 'ARRIVED': return 'bg-yellow-100 text-yellow-800';
//       case 'DONE': return 'bg-green-100 text-green-800';
//       case 'PENDING': return 'bg-gray-100 text-gray-600';
//       case 'SKIPPED': return 'bg-red-100 text-red-600';
//       default: return 'bg-gray-100 text-gray-600';
//     }
//   };
//
//   const handleStartTrip = (tripId: string) => {
//     console.log(`Starting trip: ${tripId}`);
//     // Mock API call - POST /api/drivers/trip/{id}/start
//     setSelectedTrip({
//       ...mockTripDetail,
//       status: 'ONGOING'
//     });
//   };
//
//   const handleArriveAtStop = (tripId: string, stopId: string) => {
//     console.log(`Arrived at stop ${stopId} for trip ${tripId}`);
//     // Mock API call - POST /api/drivers/trip/{tripId}/stoppoint/{spId}/arrive
//     if (selectedTrip) {
//       const updatedStops = selectedTrip.stops.map(stop => 
//         stop.id === stopId ? { ...stop, status: 'ARRIVED' as const } : stop
//       );
//       setSelectedTrip({ ...selectedTrip, stops: updatedStops });
//     }
//   };
//
//   const handleDepartFromStop = (tripId: string, stopId: string) => {
//     console.log(`Departed from stop ${stopId} for trip ${tripId}`);
//     // Mock API call - POST /api/drivers/trip/{tripId}/stoppoint/{spId}/depart
//     if (selectedTrip) {
//       const updatedStops = selectedTrip.stops.map(stop => 
//         stop.id === stopId ? { ...stop, status: 'DONE' as const } : stop
//       );
//       setSelectedTrip({ ...selectedTrip, stops: updatedStops });
//     }
//   };
//
//   const handleEndTrip = (tripId: string) => {
//     console.log(`Ending trip: ${tripId}`);
//     // Mock API call - GET /api/drivers/trip/{tripId}/end
//     if (selectedTrip) {
//       setSelectedTrip({ ...selectedTrip, status: 'COMPLETED' });
//     }
//   };
//
//   const updateLocation = () => {
//     // Mock API call - POST /api/drivers/trip/{tripId}/location
//     const newLat = currentLocation.lat + (Math.random() - 0.5) * 0.001;
//     const newLng = currentLocation.lng + (Math.random() - 0.5) * 0.001;
//     setCurrentLocation({ lat: newLat, lng: newLng });
//     console.log('Location updated:', { latitude: newLat, longitude: newLng });
//   };
//
//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Trang chủ Tài xế</h1>
//         <p className="text-gray-600">Quản lý lịch trình và chuyến đi của bạn</p>
//       </div>
//
//       {/* Current Location */}
//       <Card className="mb-6 p-4">
//         <h2 className="text-lg font-semibold mb-3">Vị trí hiện tại</h2>
//         <div className="flex items-center justify-between">
//           <div className="text-sm text-gray-600">
//             <p>Lat: {currentLocation.lat.toFixed(6)}</p>
//             <p>Lng: {currentLocation.lng.toFixed(6)}</p>
//           </div>
//           <Button onClick={updateLocation} className="bg-blue-600 hover:bg-blue-700">
//             Cập nhật vị trí
//           </Button>
//         </div>
//       </Card>
//
//       {/* Today's Schedules */}
//       <Card className="mb-6">
//         <div className="p-4 border-b">
//           <h2 className="text-xl font-semibold">Lịch trình hôm nay</h2>
//           <p className="text-sm text-gray-600">{new Date().toLocaleDateString('vi-VN')}</p>
//         </div>
//         <div className="divide-y">
//           {mockTodaySchedules.map((schedule: Schedule) => (
//             <div key={schedule.scheduleId} className="p-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-2">
//                     <span className="font-medium">{schedule.startTime}</span>
//                     <Badge className={`${getStatusColor(schedule.static)} px-2 py-1 text-xs font-medium rounded-full`}>
//                       {schedule.static}
//                     </Badge>
//                     <Badge className={`${schedule.type === 'DISPATH' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'} px-2 py-1 text-xs font-medium rounded-full`}>
//                       {schedule.type === 'DISPATH' ? 'Đưa đón' : 'Về'}
//                     </Badge>
//                   </div>
//                   <p className="text-sm text-gray-600">ID: {schedule.tripId}</p>
//                 </div>
//                 <div className="flex gap-2">
//                   {schedule.static === 'PLANNED' && (
//                     <Button 
//                       onClick={() => handleStartTrip(schedule.tripId)}
//                       className="bg-green-600 hover:bg-green-700"
//                     >
//                       Bắt đầu
//                     </Button>
//                   )}
//                   {schedule.static === 'ONGOING' && (
//                     <Button 
//                       onClick={() => setSelectedTrip(mockTripDetail)}
//                       className="bg-blue-600 hover:bg-blue-700"
//                     >
//                       Xem chi tiết
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </Card>
//
//       {/* Trip Detail Modal */}
//       {selectedTrip && (
//         <Card className="mb-6">
//           <div className="p-4 border-b bg-gray-50">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="text-xl font-semibold">Chi tiết chuyến đi</h2>
//                 <p className="text-sm text-gray-600">
//                   {selectedTrip.rotute.name} - {selectedTrip.bus.plateNumber}
//                 </p>
//               </div>
//               <div className="flex gap-2">
//                 <Badge className={`${getStatusColor(selectedTrip.status)} px-3 py-1 font-medium rounded-full`}>
//                   {selectedTrip.status}
//                 </Badge>
//                 <Button 
//                   onClick={() => setSelectedTrip(null)}
//                   variant="outline"
//                   className="ml-2"
//                 >
//                   Đóng
//                 </Button>
//               </div>
//             </div>
//           </div>
//
//           {/* Bus Info */}
//           <div className="p-4 border-b">
//             <h3 className="font-medium mb-2">Thông tin xe</h3>
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div>
//                 <span className="text-gray-600">Biển số:</span>
//                 <span className="ml-2 font-medium">{selectedTrip.bus.plateNumber}</span>
//               </div>
//               <div>
//                 <span className="text-gray-600">Loại xe:</span>
//                 <span className="ml-2">{selectedTrip.bus.model}</span>
//               </div>
//               <div>
//                 <span className="text-gray-600">Sức chứa:</span>
//                 <span className="ml-2">{selectedTrip.bus.capacity} chỗ</span>
//               </div>
//             </div>
//           </div>
//
//           {/* Stops */}
//           <div className="p-4">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="font-medium">Điểm dừng ({selectedTrip.stops.length})</h3>
//               {selectedTrip.status === 'ONGOING' && (
//                 <Button 
//                   onClick={() => handleEndTrip(selectedTrip.id)}
//                   className="bg-red-600 hover:bg-red-700"
//                 >
//                   Kết thúc chuyến
//                 </Button>
//               )}
//             </div>
//             <div className="space-y-3">
//               {selectedTrip.stops.map((stop: Stop) => (
//                 <div key={stop.id} className="flex items-center justify-between p-3 border rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium">
//                       {stop.sequence}
//                     </div>
//                     <div>
//                       <p className="font-medium">{stop.name}</p>
//                       <p className="text-xs text-gray-600">
//                         {stop.location[0]}, {stop.location[1]}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Badge className={`${getStatusColor(stop.status)} px-2 py-1 text-xs rounded-full`}>
//                       {stop.status}
//                     </Badge>
//                     {selectedTrip.status === 'ONGOING' && stop.status === 'PENDING' && (
//                       <Button 
//                         onClick={() => handleArriveAtStop(selectedTrip.id, stop.id)}
//                         size="sm"
//                         className="bg-yellow-600 hover:bg-yellow-700"
//                       >
//                         Đã đến
//                       </Button>
//                     )}
//                     {selectedTrip.status === 'ONGOING' && stop.status === 'ARRIVED' && (
//                       <Button 
//                         onClick={() => handleDepartFromStop(selectedTrip.id, stop.id)}
//                         size="sm"
//                         className="bg-green-600 hover:bg-green-700"
//                       >
//                         Rời đi
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </Card>
//       )}
//
//       {/* Quick Actions */}
//       <Card className="p-4">
//         <h2 className="text-lg font-semibold mb-4">Thao tác nhanh</h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//           <Button 
//             variant="outline"
//             className="h-16 flex flex-col items-center justify-center gap-1"
//           >
//             <span className="text-lg">📅</span>
//             <span className="text-sm">Lịch trình</span>
//           </Button>
//           <Button 
//             variant="outline"
//             className="h-16 flex flex-col items-center justify-center gap-1"
//           >
//             <span className="text-lg">📍</span>
//             <span className="text-sm">Định vị</span>
//           </Button>
//           <Button 
//             variant="outline"
//             className="h-16 flex flex-col items-center justify-center gap-1"
//           >
//             <span className="text-lg">👥</span>
//             <span className="text-sm">Học sinh</span>
//           </Button>
//           <Button 
//             variant="outline"
//             className="h-16 flex flex-col items-center justify-center gap-1"
//           >
//             <span className="text-lg">🔔</span>
//             <span className="text-sm">Thông báo</span>
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// }

export default function HomePage() {
    return (
<div> hello</div>
    );
}
