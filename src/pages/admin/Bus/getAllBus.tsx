import {
  ArrowRight,
  Bus as BusIcon,
  Calendar,
  Camera,
  Grid3x3,
  List,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import type { BusData } from "../../../api/data-contracts";
import { Button } from "../../../components/uiItem/button";
import { Card } from "../../../components/uiItem/card";
import { useApi } from "../../../contexts/apiConetxt";
import { CreateBusModal } from "./createBus";
import { UpdateBusModal } from "./UpdateBus";

type ViewMode = "grid" | "list";

interface BusMetadata {
  color?: string;
  brand?: string;
  madeYear?: number;
  camera?: boolean;
}

export const Bus: React.FC = () => {
  const { api } = useApi();
  const [buses, setBuses] = useState<BusData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteBusId, setDeleteBusId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updateBusId, setUpdateBusId] = useState<string | null>(null);
  const [updateBusData, setUpdateBusData] = useState<BusData | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Fetch buses from API
  const fetchBuses = async () => {
    setLoading(true);
    try {
      const response = await api.getAllBuses({
        search: searchTerm || undefined,
        page: 1,
        limit: 100,
      });
      if (response.data?.data?.data) {
        setBuses(response.data.data.data);
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, [searchTerm]);

  // Handle successful bus creation
  const handleCreateSuccess = () => {
    fetchBuses();
  };

  // Handle successful bus update
  const handleUpdateSuccess = () => {
    fetchBuses();
  };

  // Open update modal
  const openUpdateModal = (bus: BusData) => {
    setUpdateBusId(bus.id);
    setUpdateBusData(bus);
    setShowUpdateModal(true);
  };

  // Handle delete bus
  const handleDeleteBus = async () => {
    if (!deleteBusId) return;

    setLoading(true);
    try {
      await api.deleteABus(deleteBusId);
      setShowDeleteModal(false);
      setDeleteBusId(null);
      fetchBuses();
    } catch (error) {
      console.error("Error deleting bus:", error);
      alert("Có lỗi xảy ra khi xóa xe");
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (busId: string) => {
    setDeleteBusId(busId);
    setShowDeleteModal(true);
  };

  // Get metadata with type safety
  const getMetadata = (bus: BusData): BusMetadata => {
    return (bus.metadata || {}) as BusMetadata;
  };

  // Get bus color for display
  const getBusColor = (bus: BusData): string => {
    const metadata = getMetadata(bus);
    return metadata.color || "#3b82f6"; // Default blue
  };

  // Format ID for display - hiển thị đầy đủ ID
  const formatId = (id: string): string => {
    return id;
  };

  // Filter buses based on search term
  const filteredBuses = buses.filter((bus) => {
    const metadata = getMetadata(bus);
    const searchLower = searchTerm.toLowerCase();
    return (
      bus.licensePlate.toLowerCase().includes(searchLower) ||
      metadata.brand?.toLowerCase().includes(searchLower) ||
      metadata.color?.toLowerCase().includes(searchLower)
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
            placeholder="Tìm kiếm biển số, hãng xe..."
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
            Thêm Xe Mới
          </Button>
        </div>
      </div>

      {/* Bus List/Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      ) : filteredBuses.length === 0 ? (
        <div className="text-center py-12">
          <BusIcon className="mx-auto text-gray-400" size={48} />
          <p className="mt-2 text-gray-600">Không tìm thấy xe nào</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuses.map((bus) => {
            const metadata = getMetadata(bus);
            const busColor = getBusColor(bus);
            return (
              <Card
                key={bus.id}
                className="p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: busColor }}
                  >
                    <BusIcon className="text-white" size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-lg border-2 border-black px-2 py-1 rounded">
                        {bus.licensePlate}
                      </span>
                      <span className="text-xs text-gray-500 truncate">
                        {formatId(bus.id)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-gray-600">HÃNG XE</span>
                        <p className="font-semibold">
                          {metadata.brand || "N/A"}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-xs text-gray-600">NĂM SX</span>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} className="text-gray-400" />
                            <span className="font-semibold">
                              {metadata.madeYear || "N/A"}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <span className="text-xs text-gray-600">
                            SỨC CHỨA
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-linear-to-r from-blue-500 to-cyan-500"
                                style={{
                                  width: `${(bus.capacity / 50) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold whitespace-nowrap">
                              {bus.capacity} chỗ
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div
                        className={`px-3 py-1 rounded flex items-center gap-1 text-xs font-semibold ${
                          metadata.camera
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <Camera size={12} />
                        {metadata.camera ? "REC" : "NO CAM"}
                      </div>
                      <div className="relative group">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={20} />
                        </button>
                        <div className="absolute right-0 top-6 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[120px]">
                          <button
                            onClick={() => openUpdateModal(bus)}
                            className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 rounded-lg"
                          >
                            <Pencil size={16} />
                            Sửa
                          </button>
                          <button
                            onClick={() => openDeleteModal(bus.id)}
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
          {filteredBuses.map((bus) => {
            const metadata = getMetadata(bus);
            const busColor = getBusColor(bus);
            return (
              <Card
                key={bus.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: busColor }}
                  >
                    <BusIcon className="text-white" size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-lg border-2 border-black px-2 py-1 rounded">
                        {bus.licensePlate}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatId(bus.id)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-xs text-gray-600">HÃNG XE</span>
                        <p className="font-semibold">
                          {metadata.brand || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">NĂM SX</span>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="font-semibold">
                            {metadata.madeYear || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">SỨC CHỨA</span>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-linear-to-r from-blue-500 to-cyan-500"
                              style={{ width: `${(bus.capacity / 50) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold whitespace-nowrap">
                            {bus.capacity} chỗ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded flex items-center gap-1 text-xs font-semibold ${
                      metadata.camera
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <Camera size={12} />
                    {metadata.camera ? "REC" : "NO CAM"}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openUpdateModal(bus)}
                      className="text-blue-400 hover:text-blue-600 transition-colors"
                      title="Sửa xe"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(bus.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Xóa xe"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Bus Modal */}
      <CreateBusModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Update Bus Modal */}
      <UpdateBusModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setUpdateBusId(null);
          setUpdateBusData(null);
        }}
        onSuccess={handleUpdateSuccess}
        busId={updateBusId}
        busData={updateBusData}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Xác nhận xóa xe</h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa xe này? Hành động này không thể hoàn
              tác.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteBusId(null);
                }}
                variant="outline"
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="button"
                onClick={handleDeleteBus}
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

export default Bus;
