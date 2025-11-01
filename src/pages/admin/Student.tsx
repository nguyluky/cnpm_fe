import React, { useState } from "react";
import { Button } from "../../components/uiItem/button";
import { Search, Plus } from "lucide-react";

export const Student = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
        <Button variant="default" className="bg-indigo-500 text-white flex items-center w-50 h-10">
          <Plus className="mr-2" size={18} /> Thêm học sinh mới
        </Button>
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

                <td className="py-2 px-4 flex space-x-4">
                  <button className="text-gray-600 hover:text-gray-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    </svg>
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

