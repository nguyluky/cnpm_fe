// import { Badge } from '../../components/uiItem/badge';
// import { Card } from '../../components/uiItem/card';
// import { mockFullSchedules, type FullSchedule } from '../../mockData/driverMockData';
//
// export default function DriverSchedule() {
//   const getDaysOfWeekText = (days: number[]) => {
//     const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
//     return days.map(day => dayNames[day]).join(', ');
//   };
//
//   const getScheduleTypeColor = (type: string) => {
//     return type === 'MORNING' 
//       ? 'bg-blue-100 text-blue-800' 
//       : 'bg-orange-100 text-orange-800';
//   };
//
//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch trình làm việc</h1>
//         <p className="text-gray-600">Xem tất cả lịch trình được giao</p>
//       </div>
//
//       <div className="grid gap-6">
//         {mockFullSchedules.map((schedule: FullSchedule) => (
//           <Card key={schedule.id} className="p-6">
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex-1">
//                 <h3 className="text-xl font-semibold mb-2">{schedule.route.name}</h3>
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-4">
//                     <Badge className={`${getScheduleTypeColor(schedule.type)} px-3 py-1 font-medium rounded-full`}>
//                       {schedule.type === 'MORNING' ? 'Buổi sáng' : 'Buổi chiều'}
//                     </Badge>
//                     <span className="text-sm text-gray-600">
//                       Ngày trong tuần: {getDaysOfWeekText(schedule.daysOfWeek)}
//                     </span>
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     <p>Bắt đầu từ: {new Date(schedule.startDate).toLocaleDateString('vi-VN')}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//
//             <div className="bg-gray-50 rounded-lg p-4">
//               <h4 className="font-medium mb-3">Thông tin xe</h4>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                 <div>
//                   <span className="text-gray-600">Biển số:</span>
//                   <span className="ml-2 font-medium">{schedule.bus.plateNumber}</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Loại xe:</span>
//                   <span className="ml-2">{schedule.bus.model}</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Sức chứa:</span>
//                   <span className="ml-2">{schedule.bus.capacity} chỗ</span>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>
//
//       {mockFullSchedules.length === 0 && (
//         <Card className="p-8 text-center">
//           <div className="text-gray-500">
//             <p className="text-lg mb-2">Chưa có lịch trình nào</p>
//             <p className="text-sm">Vui lòng liên hệ quản lý để được phân công lịch trình</p>
//           </div>
//         </Card>
//       )}
//     </div>
//   );
// }

export default function HomePage() {
    return (
<div> hello</div>
    );
}
