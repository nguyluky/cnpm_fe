import React, { useState } from "react";
import { Button } from "../../components/uiItem/button";
import { Search, Plus, Pen, Delete } from "lucide-react";

export const Student = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editForm, editShowForm] = useState(false);
  const [deleteForm, deleteShowForm] = useState(false);

  const students = [
    {
      name: "Nguyễn Minh Khang",
      class: "6A",
      driver: "Nguyễn Văn X",
      phone: "0901234567",
      pickupPoint: "Bến xe Bến Thành",
      bus: "29A-12345",
      status: "Hoạt động",
    },
    {
      name: "Lê Thị Mai",
      class: "6A",
      driver: "Nguyễn Văn X",
      phone: "0901234567",
      pickupPoint: "Bến xe Bến Thành",
      bus: "29A-12345",
      status: "Hoạt động",
    },
    {
      name: "Trần Văn Nam",
      class: "6A",
      driver: "Nguyễn Văn X",
      phone: "0901234567",
      pickupPoint: "Bến xe Bến Thành",
      bus: "29A-12345",
      status: "Hoạt động",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-2/5">
          <input
            type="text"
            placeholder="Tìm kiếm học sinh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded-lg focus:outline-non"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <Button variant="default" 
        className="bg-indigo-500 text-white flex items-center w-50 h-10"
         onClick={() => setShowForm(true)}>
          <Plus className="mr-2" size={18} /> Thêm học sinh mới
        </Button>
        {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[600px] animate-scale-in">

            <h2 className="text-xl font-semibold mb-4">
              Thêm học sinh mới
            </h2>

            <div className="flex gap-4 mb-4">
              
            <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Họ tên
            </label>
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              className="border rounded p-2 w-full mb-4"
            />
            <label className="text-sm font-medium text-gray-700 mb-1">
              Tên phụ huynh
            </label>
            <input
              type="text"
              placeholder="Nguyễn Văn B"
              className="border rounded p-2 w-full mb-4"
            />
             </div>


             <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Lớp
            </label>
            <input
              type="text"
              placeholder="Lớp 6A"
              className="border rounded p-2 w-full mb-4"
            />
            <label className="text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              placeholder="0987654321"
              className="border rounded p-2 w-full mb-4"
            />
             </div>
            </div>
            <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  placeholder="Địa chỉ nhà"
                  className="border rounded p-2 w-full mb-4"
                />
            </div>
            <div className="flex gap-4 mb-4">
              
            <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Địa điểm đến
            </label>
            <input
              type="text"
              placeholder="Bến xe bến thành"
              className="border rounded p-2 w-full mb-4"
            />
             </div>


             <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Xe Bus
            </label>
            <select
              className="border rounded p-2 w-full mb-4"
              defaultValue=""
            >
              <option value="" disabled>Chọn xe bus</option>
              <option value="xe1">29A-12345 - Tuyến 1 - Quận 1</option>
              <option value="xe2">Xe Bus 02</option>
              <option value="xe3">Xe Bus 03</option>
            </select>
             </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <Button  onClick={() => setShowForm(false)}>
                Hủy
              </Button>
              <Button className="bg-indigo-600 text-white">
                Thêm học sinh
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-lg shadow p-4 border border-blue-200  text-sm">
        <h2 className="text-xl font-semibold mb-4">Danh sách học sinh (3)</h2>
        <table className="w-full text-left leading-relaxed">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 whitespace-nowrap text-[#95999F] ">Họ tên</th>
              <th className="py-2 px-4 whitespace-nowrap text-[#95999F] ">Lớp</th>
              <th className="py-2 px-4 whitespace-nowrap text-[#95999F] ">Phụ huynh</th>
              <th className="py-2 px-4 whitespace-nowrap text-[#95999F] ">SĐT</th>
              <th className="py-2 px-4 whitespace-nowrap text-[#95999F] ">Điểm đón</th>
              <th className="py-2 px-4 whitespace-nowrap text-[#95999F] ">Xe Bus</th>
              <th className="py-2 px-4 whitespace-nowrap text-[#95999F] ">Trạng thái</th>
              <th className="py-2 px-4 whitespace-nowrap text-[#95999F] ">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4 whitespace-nowrap font-bold">{student.name}</td>
                <td className="py-2 px-4 whitespace-nowrap">{student.class}</td>
                <td className="py-2 px-4 whitespace-nowrap">{student.driver}</td>
                <td className="py-2 px-4 whitespace-nowrap">{student.phone}</td>
                <td className="py-2 px-4 whitespace-nowrap">{student.pickupPoint}</td>
                <td className="py-2 px-4 whitespace-nowrap">
                <div className="  px-3 py-2 rounded-lg shadow-sm font-bold inline-block">
                  {student.bus}
                </div>
              </td>
                <td className="py-2 px-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-[#D3FDCB] text-[#38B76A] rounded-full text-xs font-semibold">
                    {student.status}
                  </span>
                </td>

                <td className="py-2 px-4 flex space-x-4 ">
                    <Button variant="default" 
                     className="bg-gray-700  border"
                     onClick={() => editShowForm(true)}>
                    
                     <Pen className="mr-2" size={18} />
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    
                  </Button>
                  <Button variant="default" 
                     className="bg-gray-700  border"
                     onClick={() => deleteShowForm(true)}>
                    
                     <Delete className="mr-2" size={18} />
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    
                  </Button>
                </td>
              </tr>
            ))}
                  {editForm && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-40">
                <div className="bg-white p-6 rounded-xl shadow-lg w-[600px] animate-scale-in">

                  <h2 className="text-xl font-semibold mb-4">
                    Sửa học sinh 
                  </h2>

                  <div className="flex gap-4 mb-4">
                    
                  <div className="flex flex-col w-1/2">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="border rounded p-2 w-full mb-4"
                  />
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Tên phụ huynh
                  </label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn B"
                    className="border rounded p-2 w-full mb-4"
                  />
                  </div>


                  <div className="flex flex-col w-1/2">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Lớp
                  </label>
                  <input
                    type="text"
                    placeholder="Lớp 6A"
                    className="border rounded p-2 w-full mb-4"
                  />
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    placeholder="0987654321"
                    className="border rounded p-2 w-full mb-4"
                  />
                  </div>
                  </div>
                  <div className="flex flex-col w-full">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        placeholder="Địa chỉ nhà"
                        className="border rounded p-2 w-full mb-4"
                      />
                  </div>
                  <div className="flex gap-4 mb-4">
                    
                  <div className="flex flex-col w-1/2">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Địa điểm đến
                  </label>
                  <input
                    type="text"
                    placeholder="Bến xe bến thành"
                    className="border rounded p-2 w-full mb-4"
                  />
                  </div>


                  <div className="flex flex-col w-1/2">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Xe Bus
                  </label>
                  <select
                    className="border rounded p-2 w-full mb-4"
                    defaultValue=""
                  >
                    <option value="" disabled>Chọn xe bus</option>
                    <option value="xe1">29A-12345 - Tuyến 1 - Quận 1</option>
                    <option value="xe2">Xe Bus 02</option>
                    <option value="xe3">Xe Bus 03</option>
                  </select>
                  </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-2">
                    <Button  onClick={() => editShowForm(false)}>
                      Hủy
                    </Button>
                    <Button className="bg-indigo-600 text-white">
                      Sửa học sinh
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {deleteForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[303px] animate-scale-in">

            <h2 className="text-xl font-semibold mb-4">
              Bạn có chắc chắn xóa học sinh 
            </h2>

            {/* Buttons */}
            <div className="flex  justify-center  gap-2">
              <Button className="text-white"
              onClick={() => deleteShowForm(false)}>
                Hủy
              </Button>
              <Button  
              className="bg-red-600 text-white"
                >
                 Xóa
              </Button>

            </div>
          </div>
        </div>
      )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Student