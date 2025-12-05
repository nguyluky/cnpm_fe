import { useEffect, useState } from 'react';
import { useApi } from '../../contexts/apiConetxt';
import type { GeoLocation, RouteData } from '../../api/data-contracts';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { path } from '../../router';
import { MapPin, Navigation, PersonStanding, AlertCircle, CheckCircle } from 'lucide-react';

interface StopPointData {
	id: string;
	name: string;
	location: GeoLocation;
}

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

export function ConfirmSelectionPage() {
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get("studentId");
    const stopPointId = searchParams.get("stopPointId");
    const routeId = searchParams.get("routeId");
	const { api } = useApi();
	const navigate = useNavigate();
	
	const [route, setRoute] = useState<RouteData | null>(null);
    const [stopPoint, setStopPoint] = useState<StopPointData>();
	const [direction, setDirection] = useState<"PICKUP" | "DROPOFF">("PICKUP");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const [success, setSuccess] = useState(false);
    const [student, setStudent] = useState<Student>();

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				// Fetch stop point details
				if (stopPointId) {
                    console.log("Fetching stop point with ID:", stopPointId);
					const response = await api.getStoppointById(stopPointId);
					setStopPoint(response?.data?.data as StopPointData);
				}

				// Fetch route details
				if (routeId) {
                    console.log("Fetching route with ID:", routeId);
					const routeResponse = await api.getRouteById(routeId);
					setRoute(routeResponse.data.data as RouteData);
				}

				// Fetch students
                if (studentId) {
                    console.log("Fetching student with ID:", studentId);
                    const studentsResponse = await api.getStudentsForParent();
                    const selectedStudent = studentsResponse.data?.data?.data.find((s: Student) => s.id === studentId);
                    setStudent(selectedStudent);
                }
			} catch (err) {
				console.error("Error fetching data:", err);
				setError("Không thể tải thông tin. Vui lòng thử lại.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stopPointId, routeId, api]);

	const handleConfirmation = async () => {
        if (!student) {
            setError("Không tìm thấy thông tin học sinh.");
            return;
        }

		if (!stopPointId || !routeId) {
			setError("Thiếu thông tin điểm dừng hoặc tuyến đường.");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			await api.updateStudentAssignmentForParent(
				student.id,
				{
					routeId: routeId,
					stopId: stopPointId,
					direction: direction,
				}
			);

			setSuccess(true);
			
			// Navigate back to student page after 2 seconds
			setTimeout(() => {
				navigate(path.PARENT_CHILD_INFO);
			}, 2000);
		} catch (err: any) {
			console.error("Error updating student assignment:", err);
			setError(err?.response?.data?.message || "Không thể xác nhận. Vui lòng thử lại.");
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading && !stopPoint && !route) {
		return (
			<div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50">
				<div className="flex flex-col items-center">
					<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
					<p className="mt-3 text-gray-700">Đang tải thông tin...</p>
				</div>
			</div>
		);
	}

	if (success) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center p-4">
				<div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
					<div className="mb-4 flex justify-center">
						<CheckCircle className="w-20 h-20 text-green-500" />
					</div>
					<h2 className="text-2xl font-bold text-gray-800 mb-2">Thành công!</h2>
					<p className="text-gray-600">Đã xác nhận lựa chọn cho học sinh.</p>
					<p className="text-sm text-gray-500 mt-4">Đang chuyển về trang thông tin học sinh...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pb-20">
			<div className="p-6">
				{/* Header */}
				<div className="text-center mb-6">
					<h1 className="text-3xl font-bold text-gray-800 mb-2">Xác nhận lựa chọn</h1>
					<p className="text-gray-600">Kiểm tra và xác nhận thông tin đăng ký</p>
				</div>

				{/* Error Message */}
				{error && (
					<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
						<AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
						<p className="text-red-700 text-sm">{error}</p>
					</div>
				)}

				{/* Stop Point Card */}
				{stopPoint && (
					<div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
						<div className="flex items-center gap-3 mb-4">
							<div className="bg-blue-100 p-3 rounded-full">
								<MapPin className="w-6 h-6 text-blue-600" />
							</div>
							<h2 className="text-xl font-bold text-gray-800">Điểm dừng</h2>
						</div>
						<div className="ml-12">
							<h3 className="text-lg font-semibold text-gray-800 mb-2">{stopPoint.name}</h3>
							<p className="text-sm text-gray-600">
                                {stopPoint.name}
							</p>
						</div>
					</div>
				)}

				{/* Route Card */}
				{route && (
					<div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
						<div className="flex items-center gap-3 mb-4">
							<div className="bg-purple-100 p-3 rounded-full">
								<Navigation className="w-6 h-6 text-purple-600" />
							</div>
							<h2 className="text-xl font-bold text-gray-800">Tuyến đường</h2>
						</div>
						<div className="ml-12">
							<h3 className="text-lg font-semibold text-gray-800 mb-2">{route.name}</h3>
							<div className="space-y-1">
								<p className="text-sm text-gray-600">
									<span className="font-medium">Thời gian hoạt động:</span> {route.metadata.OperationTime || "N/A"}
								</p>
								{route.metadata.Distance && (
									<p className="text-sm text-gray-600">
										<span className="font-medium">Khoảng cách:</span> {(route.metadata.Distance / 1000).toFixed(1)} km
									</p>
								)}
							</div>
						</div>
					</div>
				)}

				{/* Student Selection */}
				<div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
					<div className="flex items-center gap-3 mb-4">
						<div className="bg-green-100 p-3 rounded-full">
							<PersonStanding className="w-6 h-6 text-green-600" />
						</div>
						<h2 className="text-xl font-bold text-gray-800">Học sinh</h2>
					</div>
					<div className="ml-12">
                    {student ? (
                        <>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{student.name}</h3>
                            {student.meta?.studentCode && (
                                <p className="text-sm text-gray-600">Mã học sinh: {student.meta.studentCode}</p>
                            )}
                            {student.meta?.class && (
                                <p className="text-sm text-gray-600">Lớp: {student.meta.class}</p>
                            )}
                        </>
                    ) : (
                        <p className="text-sm text-gray-600">Không có thông tin học sinh.</p>
                    )}
					</div>
				</div>

				{/* Direction Selection */}
				<div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
					<h2 className="text-xl font-bold text-gray-800 mb-4">Loại hành trình</h2>
					<div className="grid grid-cols-2 gap-4">
						<button
							onClick={() => setDirection("PICKUP")}
							className={`p-4 rounded-lg border-2 transition-all ${
								direction === "PICKUP"
									? "border-blue-500 bg-blue-50 text-blue-700"
									: "border-gray-300 bg-white text-gray-700"
							}`}
						>
							<p className="font-semibold">Đón</p>
							<p className="text-xs mt-1">Đưa đón sáng</p>
						</button>
						<button
							onClick={() => setDirection("DROPOFF")}
							className={`p-4 rounded-lg border-2 transition-all ${
								direction === "DROPOFF"
									? "border-blue-500 bg-blue-50 text-blue-700"
									: "border-gray-300 bg-white text-gray-700"
							}`}
						>
							<p className="font-semibold">Trả</p>
							<p className="text-xs mt-1">Đưa đón chiều</p>
						</button>
					</div>
				</div>

				{/* Confirm Button */}
				<div className="space-y-3">
					<button
						onClick={handleConfirmation}
						disabled={isLoading || !student}
						className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
							isLoading || !student
								? "bg-gray-400 cursor-not-allowed"
								: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
						}`}
					>
						{isLoading ? (
							<div className="flex items-center justify-center gap-2">
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
								<span>Đang xử lý...</span>
							</div>
						) : (
							"Xác nhận đăng ký"
						)}
					</button>

					<button
						onClick={() => navigate(-1)}
						disabled={isLoading}
						className="w-full py-4 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
					>
						Quay lại
					</button>
				</div>
			</div>
		</div>
	);
}
