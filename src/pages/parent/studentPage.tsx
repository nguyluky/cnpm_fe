import { Card } from '../../components/uiItem/card.tsx';
import { useEffect, useState } from "react";
import { UserCircle2, Baby, School, Calendar, User, X, ChevronRight, Mars, Venus } from "lucide-react";

interface Student {
  id: string;
  name: string;
  meta: {
    class?: string;
    gender?: "Nam" | "Nữ";
    birthday?: string;
    nickname?: string;
    studentCode?: string;
    address?: string;
    parentName?: string;
    phone?: string;
  };
}

export function StudentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);

      const mockData: Student[] = [
        {
          id: "stu_001",
          name: "Dương Tùng Thiện",
          meta: {
            class: "6A1",
            gender: "Nam",
            birthday: "15/03/2014",
            nickname: "Con trai ngoan của mẹ",
            studentCode: "HS123456",
            address: "Số 123, đường ABC, Quận 1, TP.HCM",
            parentName: "Dương Thị Hồng",
            phone: "0901234567"
          }
        },
        {
          id: "stu_002",
          name: "Dương Minh Anh",
          meta: {
            class: "4A2",
            gender: "Nữ",
            birthday: "22/11/2016",
            nickname: "Công chúa nhỏ nhà mình",
            studentCode: "HS123457",
            address: "Số 123, đường ABC, Quận 1, TP.HCM",
            parentName: "Dương Thị Hồng",
            phone: "0901234567"
          }
        }
      ];

      setTimeout(() => {
        setStudents(mockData);
        setLoading(false);
      }, 600);
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#E0E7FF]">
        <div className="text-indigo-600 text-lg">Đang tải thông tin các bé...</div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#E0E7FF] w-full h-full overflow-y-auto">
      <div className="my-5 mx-7 flex-1 max-w-4xl">
        <Card className="shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center gap-3">
              <Baby className="w-8 h-8" />
              Thông tin học sinh
            </h2>

            {students.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <UserCircle2 className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                <p>Chưa có thông tin học sinh nào được liên kết với tài khoản của bạn.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className="bg-white border-2 border-[#8fd67c] rounded-2xl p-5 flex items-center gap-5 hover:shadow-md transition-all duration-200 cursor-pointer group"
                  >
                    <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-full p-3">
                      <div className={`w-14 h-14 ${student.meta.gender === "Nam" ? "bg-blue-400" : "bg-pink-400"} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md`}>
                        {student.name.charAt(0)}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">{student.name}</h3>
                      {student.meta.nickname && (
                        <p className="text-indigo-600 font-medium mt-1">{student.meta.nickname}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        {student.meta.class && (
                          <span className="flex items-center gap-1">
                            <School className="w-4 h-4" />
                            Lớp {student.meta.class}
                          </span>
                        )}
                        <span className={student.meta.gender === "Nam" ? "text-blue-600 font-semibold" : "text-pink-600 font-semibold"}>
                          {student.meta.gender}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-6 h-6 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Modal Chi Tiết */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-3xl p-8 text-white">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center mt-4">
                  <div className={`w-28 h-28 ${selectedStudent.meta.gender === "Nam" ? "bg-blue-300" : "bg-pink-300"} rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-xl border-4 border-white`}>
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <h2 className="text-3xl font-bold mt-4">{selectedStudent.name}</h2>
                  {selectedStudent.meta.nickname && (
                    <p className="text-lg opacity-90 mt-1">"{selectedStudent.meta.nickname}"</p>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-5">

                  {/* Mã học sinh */}
                  {selectedStudent.meta.studentCode && (
                    <div className="flex items-center gap-4">
                      <User className="w-6 h-6 text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-500">Mã học sinh</p>
                        <p className="font-bold text-gray-800">{selectedStudent.meta.studentCode}</p>
                      </div>
                    </div>
                  )}

                  {/* Lớp học */}
                  {selectedStudent.meta.class && (
                    <div className="flex items-center gap-4">
                      <School className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">Lớp học</p>
                        <p className="font-bold text-gray-800">Lớp {selectedStudent.meta.class}</p>
                      </div>
                    </div>
                  )}

                  {/* Ngày sinh */}
                  {selectedStudent.meta.birthday && (
                    <div className="flex items-center gap-4">
                      <Calendar className="w-6 h-6 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Ngày sinh</p>
                        <p className="font-bold text-gray-800">{selectedStudent.meta.birthday}</p>
                      </div>
                    </div>
                  )}

                  {/* Giới tính - ĐẸP NHẤT */}
                  <div className="flex items-center gap-4">
                    {selectedStudent.meta.gender === "Nam" ? (
                      <Mars className="w-8 h-8 text-blue-600" strokeWidth={2.5} />
                    ) : (
                      <Venus className="w-8 h-8 text-pink-600" strokeWidth={2.5} />
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Giới tính</p>
                      <p className={`text-xl font-bold ${selectedStudent.meta.gender === "Nam" ? "text-blue-600" : "text-pink-600"}`}>
                        {selectedStudent.meta.gender}
                      </p>
                    </div>
                  </div>

                  {/* Các thông tin khác giữ nguyên... */}
                  {selectedStudent.meta.parentName && (
                    <div className="flex items-center gap-4">
                      <UserCircle2 className="w-6 h-6 text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-500">Phụ huynh</p>
                        <p className="font-bold text-gray-800">{selectedStudent.meta.parentName}</p>
                      </div>
                    </div>
                  )}

                  {selectedStudent.meta.phone && (
                    <div className="flex items-center gap-4">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-bold text-gray-800">{selectedStudent.meta.phone}</p>
                      </div>
                    </div>
                  )}

                  {selectedStudent.meta.address && (
                    <div className="flex items-start gap-4">
                      <svg className="w-6 h-6 text-orange-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Địa chỉ</p>
                        <p className="font-bold text-gray-800">{selectedStudent.meta.address}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 text-center">
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="bg-indigo-600 text-white px-10 py-3 rounded-full hover:bg-indigo-700 transition-all font-semibold text-lg"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}