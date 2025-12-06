import { useEffect, useState } from "react";
import { Baby, School, Calendar, User, X, ChevronRight, Mars, Venus, MapPin } from "lucide-react";
import { useApi } from "../../contexts/apiConetxt";
import { useNavigate } from "react-router-dom";
import { path } from "../../router";
import type { StudentInfoReqAssignmetStop } from "../../api/data-contracts";

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
        school?: string;
    };
}

interface StudentAssignment {
    studentId: string;
    name: string;
    assignment: {
        pickupStop?: StudentInfoReqAssignmetStop;
        dropoffStop?: StudentInfoReqAssignmetStop;
    };
}
// api: getStudentInfoForParent()

export function StudentPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [studentAssignment, setStudentAssignment] = useState<StudentAssignment>();
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const {api} = useApi();
    const navigate = useNavigate();

    // fetch students from api
    const fetchStudents = async() => {
        setLoading(true);
        try {
            const data = await api.getStudentsForParent();
            if (data.data.data) {
                setStudents(data.data.data?.data);
            }
        } catch (error) {
            console.error("Failed to fetch students:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentAssignment = async(studentId: string) => {
        if (!studentId) return;
        try {
            const data = await api.getStudentInfoForParent(studentId);
            console.log("Student assignment data:", data);
            if (data.data.data) {
                setStudentAssignment(data.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch student assignment:", error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        fetchStudentAssignment(selectedStudent?.id || "");
    }, [selectedStudent]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-indigo-700 font-medium">Đang tải thông tin các bé...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Background nhẹ cho mobile */}
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
                <div className="pb-20 pt-6 px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-indigo-800 flex items-center justify-center gap-3">
                            <Baby className="w-10 h-10 text-indigo-600" />
                            Các bé của bạn
                        </h1>
                        <p className="text-gray-600 mt-2">Chọn bé để xem thông tin chi tiết</p>
                    </div>

                    {/* Danh sách học sinh */}
                    <div className="space-y-4 max-w-md mx-auto">
                        {students.map((student) => (
                            <div
                                key={student.id}
                                onClick={() => setSelectedStudent(student)}
                                className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 transform transition-all duration-200 active:scale-95"
                            >
                                <div className="p-5 flex items-center gap-4">
                                    {/* Avatar */}
                                    <div className="relative">
                                        <div className={`w-16 h-16 ${student.meta.gender === "Nam" ? "bg-gradient-to-br from-blue-400 to-blue-600" : "bg-gradient-to-br from-pink-400 to-rose-500"} rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl`}>
                                            {student.name.charAt(0)}
                                        </div>
                                        {student.meta.gender === "Nam" ? (
                                            <Mars className="w-6 h-6 text-blue-600 absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow" />
                                        ) : (
                                            <Venus className="w-6 h-6 text-pink-600 absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow" />
                                        )}
                                    </div>

                                    {/* Thông tin */}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800">{student.name}</h3>
                                        {student.meta.nickname && (
                                            <p className="text-indigo-600 font-medium text-sm mt-0.5">"{student.meta.nickname}"</p>
                                        )}
                                        <div className="flex items-center gap-4 mt-2 text-sm">
                                            {/* <span className="flex items-center gap-1 text-gray-600">
                                                <School className="w-4 h-4 text-green-600" />
                                                {student.meta.school}
                                            </span> */}
                                            <span className={`font-bold ${student.meta.gender === "Nam" ? "text-blue-600" : "text-pink-600"}`}>
                                                {student.meta.gender === "Nam" ? "♂" : "♀"} {student.meta.gender}
                                            </span>
                                        </div>
                                    </div>

                                    <ChevronRight className="w-7 h-7 text-indigo-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal Chi tiết - Full màn hình mobile style */}
                {selectedStudent && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
                        <div className="bg-white w-full max-w-md rounded-t-3xl overflow-hidden animate-slide-up max-h-[95vh]">
                            {/* Header gradient */}
                            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pt-10 pb-12 px-6 relative">
                                <button
                                    onClick={() => setSelectedStudent(null)}
                                    className="absolute top-4 right-4 bg-white/30 backdrop-blur-sm hover:bg-white/40 rounded-full p-2 transition-all"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>

                                <div className="flex flex-col items-center text-white">
                                    <div className={`w-32 h-32 ${selectedStudent.meta.gender === "Nam" ? "bg-blue-400" : "bg-pink-400"} rounded-full flex items-center justify-center text-white text-6xl font-bold shadow-2xl border-8 border-white/50`}>
                                        {selectedStudent.name.charAt(0)}
                                    </div>
                                    <h2 className="text-3xl font-bold mt-5">{selectedStudent.name}</h2>
                                    {selectedStudent.meta.nickname && (
                                        <p className="text-xl opacity-90 mt-1 italic">"{selectedStudent.meta.nickname}"</p>
                                    )}
                                </div>
                            </div>

                            {/* Nội dung */}
                            <div className="px-6 pb-8 mt-6">
                                <div className="bg-white rounded-3xl shadow-xl p-6 space-y-6 -mt-12 relative z-10">
                                    {selectedStudent.meta.studentCode && (
                                        <InfoRow icon={<User className="w-6 h-6 text-indigo-600" />} label="Mã học sinh" value={selectedStudent.meta.studentCode} />
                                    )}
                                    {selectedStudent.meta.school && (
                                        <InfoRow icon={<School className="w-6 h-6 text-green-600" />} label="Trường học" value={selectedStudent.meta.school} />
                                    )}
                                    {selectedStudent.meta.class && (
                                        <InfoRow icon={<School className="w-6 h-6 text-green-600" />} label="Lớp học" value={`Lớp ${selectedStudent.meta.class}`} />
                                    )}
                                    {selectedStudent.meta.birthday && (
                                        <InfoRow icon={<Calendar className="w-6 h-6 text-purple-600" />} label="Ngày sinh" value={selectedStudent.meta.birthday} />
                                    )}
                                    <InfoRow
                                        icon={selectedStudent.meta.gender === "Nam" ? <Mars className="w-8 h-8 text-blue-600" /> : <Venus className="w-8 h-8 text-pink-600" />}
                                        label="Giới tính"
                                        value={<span className={`text-2xl font-bold ${selectedStudent.meta.gender === "Nam" ? "text-blue-600" : "text-pink-600"}`}>{selectedStudent.meta.gender}</span>}
                                    />
                                    {studentAssignment?.assignment.pickupStop ? (
                                        <InfoRow
                                            icon={<MapPin className="w-6 h-6 text-green-600" />}
                                            label="Điểm đón"
                                            value={studentAssignment.assignment.pickupStop.name}
                                            onClick={() => { navigate(`${path.PARENT_STOP_POINT}?studentId=${selectedStudent.id}`); }}
                                        />
                                    ) : (
                                        <InfoRow
                                            icon={<MapPin className="w-6 h-6 text-green-600" />}
                                            label="Điểm đón"
                                            value={<span className="text-sm text-gray-500">Chưa có điểm đón</span>}
                                            onClick={() => { navigate(`${path.PARENT_STOP_POINT}?studentId=${selectedStudent.id}`); }}
                                        />
                                    )}
                                </div>

                                <div className="mt-8 text-center">
                                    <button
                                        onClick={() => setSelectedStudent(null)}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all"
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Animation cho modal 
            <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
            */}
        </>
    );
}

// Component nhỏ để tái sử dụng
function InfoRow({ icon, label, value, onClick }: { icon: React.ReactNode; label: string; value: React.ReactNode, onClick?: () => void }) {
    return (
        <div className="flex items-center gap-4 py-2">
            {icon}
            <div className="flex-1">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-semibold text-gray-800 text-lg">{value}</p>
            </div>

            {
                onClick && (<button onClick={onClick} className="text-indigo-500 hover:text-indigo-700 transition-all">
                    <ChevronRight className="w-5 h-5" />
                </button>)
            }



        </div>
    );
}
