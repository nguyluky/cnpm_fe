import { useState } from 'react';
import { Badge } from '../../components/uiItem/badge';
import { Button } from '../../components/uiItem/button';
import { Card } from '../../components/uiItem/card';

interface Student {
  id: string;
  name: string;
  grade: string;
  status: 'WAITING' | 'PICKED_UP' | 'DROPPED_OFF';
}

export default function QRRollCall() {
  const [selectedTripId] = useState('trip-003');
  const [isScanning, setIsScanning] = useState(false);
  const [students, setStudents] = useState<Student[]>([
    { id: 'std-001', name: 'Nguyễn Văn A', grade: '10A1', status: 'WAITING' },
    { id: 'std-002', name: 'Trần Thị B', grade: '10A2', status: 'PICKED_UP' },
    { id: 'std-003', name: 'Lê Văn C', grade: '10A1', status: 'WAITING' },
    { id: 'std-004', name: 'Phạm Thị D', grade: '10A3', status: 'DROPPED_OFF' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WAITING': return 'bg-yellow-100 text-yellow-800';
      case 'PICKED_UP': return 'bg-green-100 text-green-800';
      case 'DROPPED_OFF': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'WAITING': return 'Đang chờ';
      case 'PICKED_UP': return 'Đã đón';
      case 'DROPPED_OFF': return 'Đã thả';
      default: return 'Không xác định';
    }
  };

  const handlePickupStudent = (studentId: string) => {
    console.log(`Picking up student: ${studentId} for trip: ${selectedTripId}`);
    // Mock API call - POST /api/drivers/trip/{tripId}/students/{studentId}/pickup
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, status: 'PICKED_UP' }
        : student
    ));
  };

  const handleDropoffStudent = (studentId: string) => {
    console.log(`Dropping off student: ${studentId} for trip: ${selectedTripId}`);
    // Mock API call - POST /api/drivers/trip/{tripId}/students/{studentId}/dropoff
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, status: 'DROPPED_OFF' }
        : student
    ));
  };

  const handleQRScan = () => {
    setIsScanning(true);
    // Mock QR scan result after 2 seconds
    setTimeout(() => {
      const waitingStudent = students.find(s => s.status === 'WAITING');
      if (waitingStudent) {
        handlePickupStudent(waitingStudent.id);
      }
      setIsScanning(false);
    }, 2000);
  };

  const waitingCount = students.filter(s => s.status === 'WAITING').length;
  const pickedUpCount = students.filter(s => s.status === 'PICKED_UP').length;
  const droppedOffCount = students.filter(s => s.status === 'DROPPED_OFF').length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Điểm danh QR Code</h1>
        <p className="text-gray-600">Quét mã QR để điểm danh học sinh</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{waitingCount}</div>
          <div className="text-sm text-gray-600">Đang chờ</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{pickedUpCount}</div>
          <div className="text-sm text-gray-600">Đã đón</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{droppedOffCount}</div>
          <div className="text-sm text-gray-600">Đã thả</div>
        </Card>
      </div>

      {/* QR Scanner */}
      <Card className="p-6 mb-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Quét mã QR</h2>
          <div className="w-64 h-64 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
            {isScanning ? (
              <div className="text-center">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Đang quét...</p>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-2">📱</div>
                <p className="text-sm">Vùng quét QR Code</p>
              </div>
            )}
          </div>
          <Button 
            onClick={handleQRScan}
            disabled={isScanning}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isScanning ? 'Đang quét...' : 'Bắt đầu quét QR'}
          </Button>
        </div>
      </Card>

      {/* Student List */}
      <Card>
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Danh sách học sinh</h2>
          <p className="text-sm text-gray-600">Tổng: {students.length} học sinh</p>
        </div>
        <div className="divide-y">
          {students.map((student) => (
            <div key={student.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium">{student.name}</h3>
                    <Badge className={`${getStatusColor(student.status)} px-2 py-1 text-xs font-medium rounded-full`}>
                      {getStatusText(student.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Lớp: {student.grade}</p>
                  <p className="text-xs text-gray-500">ID: {student.id}</p>
                </div>
                <div className="flex gap-2">
                  {student.status === 'WAITING' && (
                    <Button 
                      onClick={() => handlePickupStudent(student.id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Đón
                    </Button>
                  )}
                  {student.status === 'PICKED_UP' && (
                    <Button 
                      onClick={() => handleDropoffStudent(student.id)}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Thả
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
