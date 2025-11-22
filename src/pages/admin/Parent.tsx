import { useState } from "react";
import { Button } from "../../components/uiItem/button";
import { Search, Plus, Pen, Trash, Eye } from "lucide-react";

type Child = { id: string; name: string; className: string };
type ParentRecord = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  children: Child[];
};

export const Parent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState<ParentRecord | null>(null);
  const [showDelete, setShowDelete] = useState<ParentRecord | null>(null);
  const [showChildren, setShowChildren] = useState<ParentRecord | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // mock parents data (25 entries)
  const initialParents: ParentRecord[] = [
    { id: "p1", name: "Nguyễn Văn A", phone: "0901000001", email: "a@example.com", address: "Quận 1", children: [{ id: 'c1', name: 'Nguyễn Minh Khang', className: '6A' }] },
    { id: "p2", name: "Trần Thị B", phone: "0901000002", email: "b@example.com", address: "Quận 3", children: [{ id: 'c2', name: 'Lê Thị Mai', className: '7B' }] },
    { id: "p3", name: "Lê Văn C", phone: "0901000003", email: "c@example.com", address: "Quận 5", children: [{ id: 'c3', name: 'Trần Văn Nam', className: '8C' }] },
    { id: "p4", name: "Phạm Thị D", phone: "0901000004", email: "d@example.com", address: "Quận 2", children: [] },
    { id: "p5", name: "Võ Hoàng E", phone: "0901000005", email: "e@example.com", address: "Quận 4", children: [{ id: 'c4', name: 'Phạm Thị Hồng', className: '7B' }] },
    { id: "p6", name: "Ngô Thị F", phone: "0901000006", email: "f@example.com", address: "Quận 6", children: [] },
    { id: "p7", name: "Đỗ Minh G", phone: "0901000007", email: "g@example.com", address: "Quận 7", children: [] },
    { id: "p8", name: "Lương Thùy H", phone: "0901000008", email: "h@example.com", address: "Quận 8", children: [] },
    { id: "p9", name: "Hà Quốc I", phone: "0901000009", email: "i@example.com", address: "Quận 9", children: [] },
    { id: "p10", name: "Bùi Thuỳ J", phone: "0901000010", email: "j@example.com", address: "Quận 10", children: [] },
    { id: "p11", name: "Trịnh Bá K", phone: "0901000011", email: "k@example.com", address: "Quận 11", children: [] },
    { id: "p12", name: "Nguyễn Thị L", phone: "0901000012", email: "l@example.com", address: "Quận 12", children: [] },
    { id: "p13", name: "Lê Văn M", phone: "0901000013", email: "m@example.com", address: "Thủ Đức", children: [] },
    { id: "p14", name: "Phan Mỹ N", phone: "0901000014", email: "n@example.com", address: "Bình Thạnh", children: [] },
    { id: "p15", name: "Vũ Ngọc O", phone: "0901000015", email: "o@example.com", address: "Tân Bình", children: [] },
    { id: "p16", name: "Hoàng Minh P", phone: "0901000016", email: "p@example.com", address: "Tân Phú", children: [] },
    { id: "p17", name: "Đặng Thị Q", phone: "0901000017", email: "q@example.com", address: "Bình Tân", children: [] },
    { id: "p18", name: "Mai Quốc R", phone: "0901000018", email: "r@example.com", address: "Gò Vấp", children: [] },
    { id: "p19", name: "Trần Thùy S", phone: "0901000019", email: "s@example.com", address: "Phú Nhuận", children: [] },
    { id: "p20", name: "Nguyễn Khánh T", phone: "0901000020", email: "t@example.com", address: "Quận 2", children: [] },
    { id: "p21", name: "Phùng Văn U", phone: "0901000021", email: "u@example.com", address: "Quận 3", children: [] },
    { id: "p22", name: "Ngô Thị V", phone: "0901000022", email: "v@example.com", address: "Quận 4", children: [] },
    { id: "p23", name: "Bạch Văn W", phone: "0901000023", email: "w@example.com", address: "Quận 5", children: [] },
    { id: "p24", name: "Lâm Thị X", phone: "0901000024", email: "x@example.com", address: "Quận 6", children: [] },
    { id: "p25", name: "Đoàn Văn Y", phone: "0901000025", email: "y@example.com", address: "Quận 7", children: [] },
  ];

  const [parents, setParents] = useState<ParentRecord[]>(initialParents);

  const filtered = parents.filter((p) =>
    `${p.name} ${p.phone} ${p.email} ${p.address}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  if (currentPage > totalPages) setCurrentPage(totalPages);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayed = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id: string) => {
    setParents((s) => s.filter((p) => p.id !== id));
    setShowDelete(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-2/5">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm phụ huynh..."
            className="w-full p-2 pl-10 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <Button className="bg-indigo-500 text-white flex items-center w-50 h-10" onClick={() => setShowAdd(true)}>
          <Plus className="mr-2" size={18} /> Thêm phụ huynh
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 border border-blue-200 text-sm">
        <h2 className="text-xl font-semibold mb-4">Quản lý phụ huynh ({parents.length})</h2>
        <table className="w-full text-left leading-relaxed">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-[#95999F]">Họ tên</th>
              <th className="py-2 px-4 text-[#95999F]">SĐT</th>
              <th className="py-2 px-4 text-[#95999F]">Email</th>
              <th className="py-2 px-4 text-[#95999F]">Địa chỉ</th>
              <th className="py-2 px-4 text-[#95999F]">Số con</th>
              <th className="py-2 px-4 text-[#95999F]">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="py-2 px-4 font-medium">{p.name}</td>
                <td className="py-2 px-4">{p.phone}</td>
                <td className="py-2 px-4">{p.email}</td>
                <td className="py-2 px-4">{p.address}</td>
                <td className="py-2 px-4">{p.children.length}</td>
                <td className="py-2 px-4 flex gap-2">
                  <Button onClick={() => setShowChildren(p)} className="bg-sky-600 text-white">
                    <Eye size={16} />
                  </Button>
                  <Button onClick={() => setShowEdit(p)} className="bg-gray-700 text-white">
                    <Pen size={16} />
                  </Button>
                  <Button onClick={() => setShowDelete(p)} className="bg-red-600 text-white">
                    <Trash size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination bottom-right */}
        <div className="flex justify-end mt-4">
          <div className="inline-flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`px-3 py-1 rounded border ${n === currentPage ? 'bg-sky-600 text-white' : 'hover:bg-gray-100'}`}
              >
                {n}
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

      {/* Add modal (simple local form) */}
      {showAdd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[600px]">
            <h3 className="text-lg font-semibold mb-4">Thêm phụ huynh</h3>
            {/* simple inputs, not fully validated */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input placeholder="Họ tên" className="border p-2 rounded" />
              <input placeholder="Số điện thoại" className="border p-2 rounded" />
              <input placeholder="Email" className="border p-2 rounded" />
              <input placeholder="Địa chỉ" className="border p-2 rounded" />
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setShowAdd(false)}>Hủy</Button>
              <Button className="bg-indigo-600 text-white" onClick={() => setShowAdd(false)}>Thêm</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {showEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[600px]">
            <h3 className="text-lg font-semibold mb-4">Sửa phụ huynh</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input defaultValue={showEdit.name} className="border p-2 rounded" />
              <input defaultValue={showEdit.phone} className="border p-2 rounded" />
              <input defaultValue={showEdit.email} className="border p-2 rounded" />
              <input defaultValue={showEdit.address} className="border p-2 rounded" />
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setShowEdit(null)}>Hủy</Button>
              <Button className="bg-indigo-600 text-white" onClick={() => setShowEdit(null)}>Lưu</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {showDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[360px]">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
            <p className="mb-4">Bạn có chắc muốn xóa phụ huynh <strong>{showDelete.name}</strong> không?</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setShowDelete(null)}>Hủy</Button>
              <Button className="bg-red-600 text-white" onClick={() => handleDelete(showDelete.id)}>Xóa</Button>
            </div>
          </div>
        </div>
      )}

      {/* Children viewer */}
      {showChildren && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[480px]">
            <h3 className="text-lg font-semibold mb-4">Con của {showChildren.name}</h3>
            {showChildren.children.length === 0 ? (
              <p>Không có con đăng ký</p>
            ) : (
              <ul className="space-y-2">
                {showChildren.children.map((c) => (
                  <li key={c.id} className="p-2 border rounded">{c.name} — {c.className}</li>
                ))}
              </ul>
            )}
            <div className="flex justify-end mt-4">
              <Button onClick={() => setShowChildren(null)}>Đóng</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parent;
