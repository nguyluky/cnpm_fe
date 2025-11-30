import { Search } from "lucide-react";
import { useApi } from "../../contexts/apiConetxt";
import type { RouteData } from "../../api/data-contracts";
import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { path } from "../../router";

export function ChooseRoutePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setFullScreen] = useState(false);

  const { api } = useApi();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const studentId = searchParams.get("studentId");
  const stopPointId = searchParams.get("stopPointId");
  //   ===== API lấy toàn bộ tuyến đường bị lỗi =====
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const results = await api.getAllRoutes({ stopId: stopPointId ?? undefined });
        const data = results?.data?.data?.data || [];
        console.log("API Response:", data);
        setRoutes(data as RouteData[]);
      } catch (err) {
        console.error("Failed to fetch routes", err);
      }
    };
    fetchRoutes();
  }, [api, stopPointId]);

  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!searchTerm.trim()) return; // Avoid empty searches
    setIsLoading(true);
    const filteredRoutes = routes.filter((route) =>
      (route.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setRoutes(filteredRoutes);
    setIsLoading(false);
  };

  const handleConfirmation = (routeId: string) => {
    console.log(
      "Navigating to:",
      `${path.PARENT_ASSIGN_ROUTE}?studentId=${studentId}&stopPointId=${stopPointId}&routeId=${routeId}`
    );
    navigate(
      `${path.PARENT_ASSIGN_ROUTE}?studentId=${studentId}&stopPointId=${stopPointId}&routeId=${routeId}`
    );
  };

  return (
    <>
      <div className="h-screen flex flex-col">
        <div
          className={`flex-1 ${
            isFullScreen ? "hidden" : "block"
          } transition-all`}
        >
          <div className="h-full bg-gray-200">
            {/* Replace with your map component */}
            <p className="text-center text-gray-500">Map Placeholder</p>
          </div>
        </div>

        <div
          className={`flex-1 rounded-t-2xl bg-white border-t border-gray-300 ${
            isFullScreen ? "h-full" : "block"
          } transition-all`}
        >
          <h2 className="text-xl font-bold mb-4 text-left mx-5 mt-4">
            Chọn tuyến đường
          </h2>
          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="ml-5 w-11/12 max-w-md bg-white bg-opacity-90 rounded-lg shadow-lg flex 
                    items-center
                    border border-slate-300
                    focus-within:border-blue-500"
          >
            <input
              type="text"
              placeholder="Tìm kiếm tuyến đường..."
              className="w-full py-2 rounded-lg outline-none px-4 bg-transparent text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm state only
            />
            <button
              type="submit"
              className="m-2 p-2 bg-blue-500 text-white rounded-lg"
            >
              <Search className="w-6 h-6" />
            </button>
          </form>

          {isLoading && (
            <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50">
              <div className="flex flex-col items-center">
                {" "}
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="mt-3 text-gray-700">Đang tải...</p>
              </div>
            </div>
          )}

          {/* List of routes */}
          <div
            className={`mt-4 px-4 ${
              isFullScreen ? "h-full" : "h-[40vh]"
            } overflow-y-auto`}
          >
            {routes.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Không tìm thấy tuyến đường phù hợp.
              </div>
            ) : (
              routes.map((route) => (
                <div
                  key={route.id}
                  className="flex items-center justify-between p-4 bg-white border-y border-gray-200"
                >
                  <div
                    className="min-w-0"
                    onClick={(e) => {
                      e.preventDefault();
                      handleConfirmation(route.id);
                    }}
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {route.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate whitespace-nowrap">
                      Thời gian hoạt động:{" "}
                      {route.metadata.OperationTime ?? "N/A"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
