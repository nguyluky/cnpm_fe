import { useEffect, useRef, useState } from "react";

export interface AutoCompleteProps<T> {
    value: T | null;
    onChange: (value: T | null) => void;
    
    fetchData: (term: string) => Promise<T[]>;
    getDisplayValue: (item: T) => string;
    renderItem: (item: T, isSelected: boolean) => React.ReactNode;

    placeholder?: string;
    debounceMs?: number;
    rightSlot?: React.ReactNode;   // nút xóa, nút remove...
}

export function AutoComplete<T>({
    value,
    onChange,
    fetchData,
    getDisplayValue,
    renderItem,
    placeholder = "Nhập để tìm...",
    debounceMs = 400,
    rightSlot
}: AutoCompleteProps<T>) {

    const [term, setTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState("");
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(0);
    const [onFocus, setOnFocus] = useState(false);

    const listRef = useRef<HTMLUListElement>(null);

    // debounce
    useEffect(() => {
        const t = setTimeout(() => setDebouncedTerm(term), debounceMs);
        return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [term]);

    // call API khi debounceTerm thay đổi
    useEffect(() => {
        if (!debouncedTerm) {
            setData([]);
            return;
        }

        setLoading(true);
        fetchData(debouncedTerm)
            .then(setData)
            .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedTerm]);

    // scroll to selected item
    useEffect(() => {
        if (listRef.current) {
            const el = listRef.current.children[selectedItem] as HTMLElement;
            if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
    }, [selectedItem]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedItem(prev => data.length ? (prev + 1) % data.length : 0);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedItem(prev => data.length ? (prev - 1 + data.length) % data.length : 0);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (data.length > 0) {
                onChange(data[selectedItem]);
                setTerm("");
                setDebouncedTerm("");
            }
        }
    };

    if (value) {
        return (
            <div className="flex items-center justify-between border p-2 rounded-lg bg-gray-50 mb-2">
                <div>
                    <p className="font-medium">{getDisplayValue(value)}</p>
                </div>
                <div className="flex gap-1">
                    {rightSlot}
                    <button
                        onClick={() => onChange(null)}
                        className="p-2 text-gray-500 hover:text-gray-700"
                    >
                        ✏️
                    </button>
                </div>
            </div>
        );
    }

    return (
        <label className="flex items-center gap-2 border p-2 rounded-lg relative bg-white border-gray-300 mb-2">
            <input
                autoFocus
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setOnFocus(true)}
                onBlur={() => setOnFocus(false)}
                placeholder={placeholder}
                className="w-full border-0 outline-none"
            />

            {rightSlot}

            <div
                className={`absolute top-full left-0 right-0 bg-white border rounded-lg border-gray-300 shadow-lg max-h-60 overflow-y-auto z-10 mt-1 ${
                    onFocus ? "block" : "hidden"
                }`}
            >
                {term.length === 0 && (
                    <div className="p-4 text-center text-gray-500">Nhập để tìm...</div>
                )}

                {loading && (
                    <div className="p-4 text-center text-gray-500">Đang tải...</div>
                )}

                {!loading && data.length > 0 && (
                    <ul ref={listRef}>
                        {data.map((item, idx) => (
                            <li
                                key={idx}
                                className={`cursor-pointer ${
                                    selectedItem === idx ? "bg-gray-100" : ""
                                }`}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    onChange(item);
                                    setTerm("");
                                    setDebouncedTerm("");
                                }}
                            >
                                {renderItem(item, selectedItem === idx)}
                            </li>
                        ))}
                    </ul>
                )}

                {!loading && debouncedTerm && data.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                        Không có kết quả.
                    </div>
                )}
            </div>
        </label>
    );
}

