import React, { useState } from "react";
import { Button } from "../../../components/uiItem/button";
import { useApi } from "../../../contexts/apiConetxt";

interface BusMetadata {
  color?: string;
  brand?: string;
  madeYear?: number;
  camera?: boolean;
}

interface CreateBusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateBusModal: React.FC<CreateBusModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { api } = useApi();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    licensePlate: "",
    capacity: 0,
    metadata: {
      color: "",
      brand: "",
      madeYear: 0,
      camera: false,
    } as BusMetadata,
  });

  // Reset form when modal closes
  const resetForm = () => {
    setFormData({
      licensePlate: "",
      capacity: 0,
      metadata: {
        color: "",
        brand: "",
        madeYear: 0,
        camera: false,
      },
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createANewBus({
        licensePlate: formData.licensePlate,
        capacity: formData.capacity,
        metadata: formData.metadata as any,
      });
      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating bus:", error);
      alert("Có lỗi xảy ra khi tạo xe mới");
    } finally {
      setLoading(false);
    }
  };

  // Handle close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl animate-scale-in">
        <h2 className="text-xl font-semibold mb-4">Thêm Xe Mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Biển số xe */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Biển số xe <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="51A-123.42"
                value={formData.licensePlate}
                onChange={(e) =>
                  setFormData({ ...formData, licensePlate: e.target.value })
                }
                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sức chứa */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Sức chứa <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="40"
                value={formData.capacity || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: parseInt(e.target.value) || 0,
                  })
                }
                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Hãng xe */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Hãng xe
              </label>
              <input
                type="text"
                placeholder="Thaco"
                value={formData.metadata.brand || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metadata: {
                      ...formData.metadata,
                      brand: e.target.value,
                    },
                  })
                }
                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Màu sắc */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Màu sắc
              </label>
              <input
                type="text"
                placeholder="Blue"
                value={formData.metadata.color || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metadata: {
                      ...formData.metadata,
                      color: e.target.value,
                    },
                  })
                }
                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Năm sản xuất */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Năm sản xuất
              </label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                placeholder="2020"
                value={formData.metadata.madeYear || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metadata: {
                      ...formData.metadata,
                      madeYear: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Camera */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Camera
              </label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={formData.metadata.camera || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metadata: {
                        ...formData.metadata,
                        camera: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-gray-600">Có camera</span>
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
              {loading ? "Đang tạo..." : "Thêm Xe"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBusModal;
