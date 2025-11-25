import React, { useState, useEffect } from "react";
import { Button } from "../../../components/uiItem/button";
import { useApi } from "../../../contexts/apiConetxt";

type StopPointLike = {
  id: string;
  name: string;
  location?: { latitude: number; longitude: number };
  meta?: any;
};

interface CreateRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateRouteModal: React.FC<CreateRouteModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { api } = useApi();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    distance: "",
    operationTime: "",
    color: "#3B82F6",
  });

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<StopPointLike[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedStops, setSelectedStops] = useState<StopPointLike[]>([]);
  const [startPointId, setStartPointId] = useState<string | null>(null);
  const [endPointId, setEndPointId] = useState<string | null>(null);
  const [allStopPoints, setAllStopPoints] = useState<StopPointLike[]>([]);
  const [startQuery, setStartQuery] = useState("");
  const [startSuggestions, setStartSuggestions] = useState<StopPointLike[]>([]);
  const [endQuery, setEndQuery] = useState("");
  const [endSuggestions, setEndSuggestions] = useState<StopPointLike[]>([]);

  const reset = () => {
    setForm({ name: "", distance: "", operationTime: "", color: "#3B82F6" });
    setQuery("");
    setSelectedStops([]);
    setStartPointId(null);
    setEndPointId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare payload for API
      const selectedStart = allStopPoints.find(p => p.id === startPointId) || selectedStops.find(s => s.id === startPointId) || selectedStops[0];
      const selectedEnd = allStopPoints.find(p => p.id === endPointId) || selectedStops.find(s => s.id === endPointId) || selectedStops[selectedStops.length - 1];
      const startLocation = selectedStart?.location || { latitude: 0, longitude: 0 };
      const endLocation = selectedEnd?.location || { latitude: 0, longitude: 0 };
      const stopPointIds = selectedStops.map(s => s.id);

      const meta: any = {
        Distance: form.distance || undefined,
        OperationTime: form.operationTime || undefined,
        Color: form.color || undefined,
      };

      await api.createANewRoute({
        name: form.name,
        startLocation,
        endLocation,
        meta,
        stopPointIds,
      });

      reset();
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Create route error", err);
      alert("Có lỗi khi tạo tuyến");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setSearchLoading(true);
      try {
        const res = await api.getAllStoppoints();
        const stoppoints = res?.data?.data?.data || [];
        setAllStopPoints(stoppoints);
      } catch (err) {
        console.error('Failed to load stoppoints', err);
        if (mounted) setAllStopPoints([]);
      } finally {
        if (mounted) setSearchLoading(false);
      }
    };

    if (isOpen) load();
    return () => { mounted = false; };
  }, [api, isOpen]);

  // Synchronous search helper and handlers (no useEffect)
  const searchStopPointsByName = (q: string) => {
    if (!q || q.trim().length === 0) return [] as StopPointLike[];
    const qq = q.toLowerCase();
    return allStopPoints.filter(p => (p.name || '').toLowerCase().includes(qq));
  };

  const handleQueryInput = (val: string) => {
    setQuery(val);
    if (!val || val.trim().length === 0) {
      setSuggestions([]);
      return;
    }
    setSuggestions(searchStopPointsByName(val));
  };

  const handleStartInput = (val: string) => {
    setStartQuery(val);
    setStartPointId(null);
    if (!val || val.trim().length === 0) {
      setStartSuggestions([]);
      return;
    }
    setStartSuggestions(searchStopPointsByName(val));
  };

  const handleEndInput = (val: string) => {
    setEndQuery(val);
    setEndPointId(null);
    if (!val || val.trim().length === 0) {
      setEndSuggestions([]);
      return;
    }
    setEndSuggestions(searchStopPointsByName(val));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Tạo tuyến đường mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Tên tuyến <span className="text-red-500">*</span></label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="border rounded p-2 w-full" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Màu tuyến</label>
              <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-20 h-10 p-0 border rounded" />
            </div>

            {/* Điểm bắt đầu (tìm trong allStopPoints) */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Điểm bắt đầu</label>
              <div className="relative">
                <div className="flex">
                  <input
                      value={startQuery || (startPointId ? (allStopPoints.find(p => p.id === startPointId)?.name || '') : '')}
                      onChange={e => handleStartInput(e.target.value)}
                      placeholder="Tìm điểm bắt đầu..."
                      className="w-full px-3 py-2 border rounded"
                    />
                  {startPointId && (
                    <button type="button" onClick={() => { setStartPointId(null); setStartQuery(''); }} className="ml-2 px-2 py-1 border rounded">✕</button>
                  )}
                </div>
                {startQuery.trim().length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
                    {startSuggestions.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500">Không tìm thấy</div>
                    ) : (
                      startSuggestions.map((p) => (
                        <button key={p.id} type="button" onClick={() => { setStartPointId(p.id); setStartQuery(''); setStartSuggestions([]); }} className="w-full text-left px-3 py-2 hover:bg-gray-50">
                          <div className="font-medium text-sm">{p.name}</div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Điểm kết thúc (tìm trong allStopPoints) */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Điểm kết thúc</label>
              <div className="relative">
                <div className="flex">
                  <input
                    value={endQuery || (endPointId ? (allStopPoints.find(p => p.id === endPointId)?.name || '') : '')}
                    onChange={e => handleEndInput(e.target.value)}
                    placeholder="Tìm điểm kết thúc..."
                    className="w-full px-3 py-2 border rounded"
                  />
                  {endPointId && (
                    <button type="button" onClick={() => { setEndPointId(null); setEndQuery(''); }} className="ml-2 px-2 py-1 border rounded">✕</button>
                  )}
                </div>
                {endQuery.trim().length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
                    {endSuggestions.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500">Không tìm thấy</div>
                    ) : (
                      endSuggestions.map((p) => (
                        <button key={p.id} type="button" onClick={() => { setEndPointId(p.id); setEndQuery(''); setEndSuggestions([]); }} className="w-full text-left px-3 py-2 hover:bg-gray-50">
                          <div className="font-medium text-sm">{p.name}</div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* description field removed as requested */}

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Khoảng cách (km)</label>
              <input value={form.distance} onChange={e => setForm(f => ({ ...f, distance: e.target.value }))} className="border rounded p-2 w-full" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Thời gian dự kiến (phút)</label>
              <input value={form.operationTime} onChange={e => setForm(f => ({ ...f, operationTime: e.target.value }))} className="border rounded p-2 w-full" />
            </div>

            

            {/* stop point combobox */}
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1">Tìm điểm dừng</label>
              <div className="relative">
                <input value={query} onChange={e => handleQueryInput(e.target.value)} placeholder="Tìm theo tên điểm dừng..." className="w-full px-3 py-2 border rounded" />
                {query.trim().length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
                    {searchLoading ? (
                      <div className="p-3 text-sm text-gray-500">Đang tìm...</div>
                    ) : suggestions.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500">Không tìm thấy</div>
                    ) : (
                      suggestions.map((p) => (
                        <button key={p.id} type="button" onClick={() => {
                          const exists = selectedStops.find(s => s.id === p.id);
                          if (!exists) {
                            const stopObj: StopPointLike = { id: p.id, name: p.name || '', location: p.location || { latitude: 0, longitude: 0 }, meta: p.meta || {} };
                            setSelectedStops(s => [...s, stopObj]);
                          }
                          setQuery("");
                        }} className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-start gap-2">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{p.name}</div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {selectedStops.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedStops.map(s => (
                    <div key={s.id} className="px-3 py-1 bg-gray-100 border rounded-full text-sm flex items-center gap-2">
                      <span className="font-medium">{s.name}</span>
                      <button type="button" onClick={() => setSelectedStops(prev => prev.filter(x => x.id !== s.id))} className="text-gray-500 hover:text-gray-800">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => { reset(); onClose(); }} disabled={loading}>Hủy</Button>
            <Button type="submit" className="bg-indigo-600 text-white" disabled={loading}>{loading ? 'Đang tạo...' : 'Tạo tuyến'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRouteModal;