import {
  Grid3x3,
  List,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../../../components/uiItem/button";
import { Card } from "../../../components/uiItem/card";
import { useApi } from "../../../contexts/apiConetxt";
import { CreateStudentModal } from "./createStudent";
import { UpdateStudentModal } from "./updateStudent";

type ViewMode = "grid" | "list";

interface StudentMetadata {
  gender?: string;
  birthday?: string;
  school?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}

interface StudentData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  metadata: StudentMetadata;
}

export const GetAllStudent: React.FC = () => {
  const { api, securityData } = useApi();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updateStudentId, setUpdateStudentId] = useState<string | null>(null);
  const [updateStudentData, setUpdateStudentData] =
    useState<StudentData | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch students from API
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = securityData?.accessToken || "";
      const response = await fetch(
        `http://localhost:3000/api/students?page=${page}&limit=20&search=${
          searchTerm || ""
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.data?.data) {
          setStudents(data.data.data);
          setTotalPages(data.data.meta?.totalPages || 1);
        }
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [searchTerm, page]);

  // Handle successful student creation
  const handleCreateSuccess = () => {
    fetchStudents();
  };

  // Handle successful student update
  const handleUpdateSuccess = () => {
    fetchStudents();
  };

  // Open update modal
  const openUpdateModal = (student: StudentData) => {
    setUpdateStudentId(student.id);
    setUpdateStudentData(student);
    setShowUpdateModal(true);
  };

  // Handle delete student
  const handleDeleteStudent = async () => {
    if (!deleteStudentId) return;

    setLoading(true);
    try {
      const token = securityData?.accessToken || "";
      const response = await fetch(
        `http://localhost:3000/api/students/${deleteStudentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setShowDeleteModal(false);
        setDeleteStudentId(null);
        fetchStudents();
      } else {
        alert("Có lỗi xảy ra khi xóa học sinh");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Có lỗi xảy ra khi xóa học sinh");
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (studentId: string) => {
    setDeleteStudentId(studentId);
    setShowDeleteModal(true);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.metadata.school?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Search and Actions */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm tên, trường học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition ${
              viewMode === "grid"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Grid3x3 size={20} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition ${
              viewMode === "list"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <List size={20} />
          </button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white flex items-center gap-2"
          >
            <Plus size={18} />
            Thêm Học Sinh
          </Button>
        </div>
      </div>

      {/* Student List/Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-12">
          <User className="mx-auto text-gray-400" size={48} />
          <p className="mt-2 text-gray-600">Không tìm thấy học sinh nào</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => {
            const metadata = student.metadata || {};
            return (
              <Card
                key={student.id}
                className="p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <User className="text-white" size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-lg">{student.name}</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-gray-600">GIỚI TÍNH</span>
                        <p className="font-semibold">
                          {metadata.gender || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">NGÀY SINH</span>
                        <p className="font-semibold">
                          {metadata.birthday
                            ? formatDate(metadata.birthday)
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">
                          TRƯỜNG HỌC
                        </span>
                        <p className="font-semibold truncate">
                          {metadata.school || "N/A"}
                        </p>
                      </div>
                      {metadata.emergencyContact && (
                        <div>
                          <span className="text-xs text-gray-600">
                            LIÊN HỆ KHẨN CẤP
                          </span>
                          <p className="font-semibold text-sm">
                            {metadata.emergencyContact.name} -{" "}
                            {metadata.emergencyContact.relation}
                          </p>
                          <p className="text-xs text-gray-500">
                            {metadata.emergencyContact.phone}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatDate(student.createdAt)}
                      </span>
                      <div className="relative group">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={20} />
                        </button>
                        <div className="absolute right-0 top-6 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[120px]">
                          <button
                            onClick={() => openUpdateModal(student)}
                            className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 rounded-lg"
                          >
                            <Pencil size={16} />
                            Sửa
                          </button>
                          <button
                            onClick={() => openDeleteModal(student.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-lg"
                          >
                            <Trash2 size={16} />
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStudents.map((student) => {
            const metadata = student.metadata || {};
            return (
              <Card
                key={student.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <User className="text-white" size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-lg">{student.name}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <span className="text-xs text-gray-600">GIỚI TÍNH</span>
                        <p className="font-semibold">
                          {metadata.gender || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">NGÀY SINH</span>
                        <p className="font-semibold">
                          {metadata.birthday
                            ? formatDate(metadata.birthday)
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">
                          TRƯỜNG HỌC
                        </span>
                        <p className="font-semibold truncate">
                          {metadata.school || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">
                          LIÊN HỆ KHẨN CẤP
                        </span>
                        <p className="font-semibold text-sm">
                          {metadata.emergencyContact
                            ? `${metadata.emergencyContact.name} (${metadata.emergencyContact.relation})`
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openUpdateModal(student)}
                      className="text-blue-400 hover:text-blue-600 transition-colors"
                      title="Sửa học sinh"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(student.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Xóa học sinh"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            variant="outline"
          >
            Trước
          </Button>
          <span className="text-sm text-gray-600">
            Trang {page} / {totalPages}
          </span>
          <Button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            variant="outline"
          >
            Sau
          </Button>
        </div>
      )}

      {/* Add Student Modal */}
      <CreateStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Update Student Modal */}
      <UpdateStudentModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setUpdateStudentId(null);
          setUpdateStudentData(null);
        }}
        onSuccess={handleUpdateSuccess}
        studentId={updateStudentId}
        studentData={updateStudentData}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Xác nhận xóa học sinh
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa học sinh này? Hành động này không thể
              hoàn tác.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteStudentId(null);
                }}
                variant="outline"
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="button"
                onClick={handleDeleteStudent}
                className="bg-red-600 text-white hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Đang xóa..." : "Xóa"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllStudent;
