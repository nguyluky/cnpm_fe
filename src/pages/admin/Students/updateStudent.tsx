import React, { useEffect, useState } from "react";
import { Button } from "../../../components/uiItem/button";
import { useApi } from "../../../contexts/apiConetxt";

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

interface UpdateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  studentId: string | null;
  studentData: StudentData | null;
}

export const UpdateStudentModal: React.FC<UpdateStudentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  studentId,
  studentData,
}) => {
  const { api, securityData } = useApi();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    metadata: {
      gender: "",
      birthday: "",
      school: "",
      emergencyContact: {
        name: "",
        phone: "",
        relation: "",
      },
    } as StudentMetadata,
  });

  // Load student data when modal opens
  useEffect(() => {
    if (isOpen && studentData) {
      const metadata = studentData.metadata || {};
      setFormData({
        name: studentData.name || "",
        metadata: {
          gender: metadata.gender || "",
          birthday: metadata.birthday || "",
          school: metadata.school || "",
          emergencyContact: {
            name: metadata.emergencyContact?.name || "",
            phone: metadata.emergencyContact?.phone || "",
            relation: metadata.emergencyContact?.relation || "",
          },
        },
      });
    }
  }, [isOpen, studentData]);

  // Reset form when modal closes
  const resetForm = () => {
    setFormData({
      name: "",
      metadata: {
        gender: "",
        birthday: "",
        school: "",
        emergencyContact: {
          name: "",
          phone: "",
          relation: "",
        },
      },
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return;

    setLoading(true);
    try {
      const token = securityData?.accessToken || "";
      const response = await fetch(
        `http://localhost:3000/api/students/${studentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            metadata: {
              gender: formData.metadata.gender || undefined,
              birthday: formData.metadata.birthday || undefined,
              school: formData.metadata.school || undefined,
              emergencyContact: formData.metadata.emergencyContact?.name
                ? {
                    name: formData.metadata.emergencyContact.name,
                    phone: formData.metadata.emergencyContact.phone,
                    relation: formData.metadata.emergencyContact.relation,
                  }
                : undefined,
            },
          }),
        }
      );

      if (response.ok) {
        resetForm();
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        alert(error.message || "Có lỗi xảy ra khi cập nhật học sinh");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Có lỗi xảy ra khi cập nhật học sinh");
    } finally {
      setLoading(false);
    }
  };

  // Handle close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !studentId || !studentData) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Cập nhật Học Sinh</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Tên học sinh */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Tên học sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Nguyễn Văn A"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Giới tính */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Giới tính
              </label>
              <select
                value={formData.metadata.gender || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metadata: {
                      ...formData.metadata,
                      gender: e.target.value,
                    },
                  })
                }
                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            {/* Ngày sinh */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Ngày sinh
              </label>
              <input
                type="date"
                value={formData.metadata.birthday || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metadata: {
                      ...formData.metadata,
                      birthday: e.target.value,
                    },
                  })
                }
                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Trường học */}
            <div className="flex flex-col col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Trường học
              </label>
              <input
                type="text"
                placeholder="Tiểu học thị trấn A"
                value={formData.metadata.school || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metadata: {
                      ...formData.metadata,
                      school: e.target.value,
                    },
                  })
                }
                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Liên hệ khẩn cấp */}
            <div className="col-span-2 border-t pt-4 mt-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Liên hệ khẩn cấp
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Tên người liên hệ
                  </label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn B"
                    value={formData.metadata.emergencyContact?.name || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        metadata: {
                          ...formData.metadata,
                          emergencyContact: {
                            ...formData.metadata.emergencyContact,
                            name: e.target.value,
                            phone:
                              formData.metadata.emergencyContact?.phone || "",
                            relation:
                              formData.metadata.emergencyContact?.relation ||
                              "",
                          },
                        },
                      })
                    }
                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    placeholder="0909123456"
                    value={formData.metadata.emergencyContact?.phone || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        metadata: {
                          ...formData.metadata,
                          emergencyContact: {
                            ...formData.metadata.emergencyContact,
                            name:
                              formData.metadata.emergencyContact?.name || "",
                            phone: e.target.value,
                            relation:
                              formData.metadata.emergencyContact?.relation ||
                              "",
                          },
                        },
                      })
                    }
                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Quan hệ
                  </label>
                  <input
                    type="text"
                    placeholder="Ba, Mẹ, Ông, Bà..."
                    value={formData.metadata.emergencyContact?.relation || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        metadata: {
                          ...formData.metadata,
                          emergencyContact: {
                            ...formData.metadata.emergencyContact,
                            name:
                              formData.metadata.emergencyContact?.name || "",
                            phone:
                              formData.metadata.emergencyContact?.phone || "",
                            relation: e.target.value,
                          },
                        },
                      })
                    }
                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white"
              disabled={loading}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStudentModal;
