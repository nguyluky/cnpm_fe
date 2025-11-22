import { useState } from "react";
import { Button } from "../../components/uiItem/button";
import { Search, Plus, Pen, Delete, Eye } from "lucide-react";

type Student = {
  id: string;
  name: string;
  class: string;
  driver: string;
  phone: string;
  pickupPoint: string;
  bus: string;
  status: string;
};

export const Student = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editForm, editShowForm] = useState(false);
  const [deleteForm, deleteShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const students: Student[] = [
    { id: 'S001', name: "Nguyễn Minh Khang", class: "6A", driver: "Nguyễn Văn X", phone: "0901234001", pickupPoint: "Bến xe Bến Thành", bus: "29A-12345", status: "Hoạt động" },
    { id: 'S002', name: "Lê Thị Mai", class: "6A", driver: "Nguyễn Văn X", phone: "0901234002", pickupPoint: "Công viên 23/9", bus: "29A-12345", status: "Hoạt động" },
    { id: 'S003', name: "Trần Văn Nam", class: "6A", driver: "Nguyễn Văn Y", phone: "0901234003", pickupPoint: "Chợ Bến Thành", bus: "29B-67890", status: "Hoạt động" },
    { id: 'S004', name: "Phạm Thị Hồng", class: "7B", driver: "Trần Văn B", phone: "0901234004", pickupPoint: "Trường THCS ABC", bus: "29A-12345", status: "Hoạt động" },
    { id: 'S005', name: "Võ Hoàng Long", class: "7B", driver: "Lê Văn C", phone: "0901234005", pickupPoint: "Công viên Tao Đàn", bus: "29B-67890", status: "Tạm dừng" },
    { id: 'S006', name: "Ngô Thị Lan", class: "8C", driver: "Phan Văn D", phone: "0901234006", pickupPoint: "Cầu Ánh Sao", bus: "30C-11111", status: "Hoạt động" },
    { id: 'S007', name: "Đỗ Minh Tú", class: "6B", driver: "Nguyễn Văn X", phone: "0901234007", pickupPoint: "Bến xe Miền Đông", bus: "29A-12345", status: "Hoạt động" },
    { id: 'S008', name: "Lương Thùy Chi", class: "6C", driver: "Trần Văn B", phone: "0901234008", pickupPoint: "Chợ Tân Định", bus: "29B-67890", status: "Hoạt động" },
    { id: 'S009', name: "Hà Quốc Đại", class: "7A", driver: "Lê Văn C", phone: "0901234009", pickupPoint: "Công viên 23/9", bus: "30C-11111", status: "Hoạt động" },
    { id: 'S010', name: "Bùi Thuỳ Dung", class: "7C", driver: "Phan Văn D", phone: "0901234010", pickupPoint: "Trường THPT XYZ", bus: "29A-12345", status: "Hoạt động" },
    { id: 'S011', name: "Trịnh Bá Sơn", class: "8A", driver: "Nguyễn Văn Z", phone: "0901234011", pickupPoint: "Bến xe Bến Thành", bus: "29B-67890", status: "Hoạt động" },
    { id: 'S012', name: "Nguyễn Thị Hạnh", class: "8B", driver: "Nguyễn Văn X", phone: "0901234012", pickupPoint: "Công viên Tao Đàn", bus: "30C-11111", status: "Tạm dừng" },
    { id: 'S013', name: "Lê Văn Phúc", class: "6A", driver: "Trần Văn B", phone: "0901234013", pickupPoint: "Chợ Bến Thành", bus: "29A-12345", status: "Hoạt động" },
    { id: 'S014', name: "Phan Mỹ Linh", class: "6B", driver: "Lê Văn C", phone: "0901234014", pickupPoint: "Cầu Ánh Sao", bus: "29B-67890", status: "Hoạt động" },
    { id: 'S015', name: "Vũ Ngọc Ánh", class: "7B", driver: "Phan Văn D", phone: "0901234015", pickupPoint: "Trường THCS ABC", bus: "30C-11111", status: "Hoạt động" },
    { id: 'S016', name: "Hoàng Minh Đức", class: "8C", driver: "Nguyễn Văn Z", phone: "0901234016", pickupPoint: "Bến xe Miền Đông", bus: "29A-12345", status: "Hoạt động" },
    { id: 'S017', name: "Đặng Thị Phương", class: "7A", driver: "Nguyễn Văn X", phone: "0901234017", pickupPoint: "Chợ Tân Định", bus: "29B-67890", status: "Hoạt động" },
    { id: 'S018', name: "Mai Quốc Huy", class: "6C", driver: "Lê Văn C", phone: "0901234018", pickupPoint: "Trường THPT XYZ", bus: "30C-11111", status: "Hoạt động" },
    { id: 'S019', name: "Trần Thùy Vy", class: "8B", driver: "Phan Văn D", phone: "0901234019", pickupPoint: "Bến xe Bến Thành", bus: "29A-12345", status: "Hoạt động" },
    { id: 'S020', name: "Nguyễn Khánh Duy", class: "7C", driver: "Nguyễn Văn Z", phone: "0901234020", pickupPoint: "Cầu Ánh Sao", bus: "29B-67890", status: "Tạm dừng" },
  ];

  const totalPages = Math.max(1, Math.ceil(students.length / itemsPerPage));

  // ensure current page is valid if students length changes
  if (currentPage > totalPages) setCurrentPage(totalPages);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedStudents = students.slice(startIndex, endIndex);

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
        <h2 className="text-xl font-semibold mb-4">Danh sách học sinh ({students.length})</h2>
        <table className="w-full text-left leading-relaxed table-fixed">
          <colgroup>
            <col style={{ width: '12.5%' }} />
            <col style={{ width: '12.5%' }} />
            <col style={{ width: '12.5%' }} />
            <col style={{ width: '12.5%' }} />
            <col style={{ width: '12.5%' }} />
            <col style={{ width: '12.5%' }} />
            <col style={{ width: '12.5%' }} />
            <col style={{ width: '12.5%' }} />
          </colgroup>
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-[#95999F]">Họ tên</th>
              <th className="py-2 px-4 text-[#95999F]">Lớp</th>
              <th className="py-2 px-4 text-[#95999F]">Phụ huynh</th>
              <th className="py-2 px-4 text-[#95999F]">SĐT</th>
              <th className="py-2 px-4 text-[#95999F]">Điểm đón</th>
              <th className="py-2 px-4 text-[#95999F]">Xe Bus</th>
              <th className="py-2 px-4 text-[#95999F]">Trạng thái</th>
              <th className="py-2 px-4 text-[#95999F]">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {displayedStudents.map((student, idx) => (
              <tr key={startIndex + idx} className="border-b">
                <td className="py-2 px-4 truncate font-bold">{student.name}</td>
                <td className="py-2 px-4 truncate">{student.class}</td>
                <td className="py-2 px-4 truncate">{student.driver}</td>
                <td className="py-2 px-4 truncate">{student.phone}</td>
                <td className="py-2 px-4 truncate">{student.pickupPoint}</td>
                <td className="py-2 px-4 truncate">
                  <div className="px-3 py-2 rounded-lg shadow-sm font-bold inline-block truncate max-w-full">
                    {student.bus}
                  </div>
                </td>
                <td className="py-2 px-4 truncate">
                  <span className="px-2 py-1 bg-[#D3FDCB] text-[#38B76A] rounded-full text-xs font-semibold">
                    {student.status}
                  </span>
                </td>

                <td className="py-2 px-4 flex space-x-4 justify-end">
                  <Button variant="default" 
                      className="bg-gray-700  border"
                      onClick={() => editShowForm(true)}>
                     <Pen className="mr-2" size={18} />
                  </Button>
                  <Button variant="default" 
                     className="bg-gray-700  border"
                     onClick={() => deleteShowForm(true)}>
                     <Delete className="mr-2" size={18} />
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
        {/* Pagination controls */}
        <div className="flex justify-end mt-4">
          <div className="inline-flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              Prev
            </button>

            {/* page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1 rounded border ${p === currentPage ? 'bg-sky-600 text-white' : 'hover:bg-gray-100'}`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Student