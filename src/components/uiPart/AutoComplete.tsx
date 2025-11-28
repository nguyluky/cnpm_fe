import { useEffect, useRef, useState } from "react";

export interface AutoCompleteProps<T> {
    value: T | null;
    onChange: (value: T | null) => void;
    
    fetchData: (term: string) => Promise<T[]>;
    renderDisplay: (item: T) => React.ReactNode;
    renderItem: (item: T, isSelected: boolean) => React.ReactNode;
    autoFocus?: boolean;

    placeholder?: string;
    debounceMs?: number;
    rightSlot?: React.ReactNode;   // nút xóa, nút remove...
}

export function AutoComplete<T>({
    value,
    onChange,
    fetchData,
    renderDisplay,
    renderItem,
    placeholder = "Nhập để tìm...",
    debounceMs = 400,
    rightSlot,
    autoFocus = false,
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
            <div className="flex items-center justify-between border p-2 rounded-lg bg-gray-50 border-gray-300 mb-2">
                <div>
                    <p className="font-medium">{renderDisplay(value)}</p>
                </div>
                <div className="flex gap-1">
                    {rightSlot}
                </div>
            </div>
        );
    }

    return (
        <label className="flex items-center gap-2 border p-2 rounded-lg relative bg-white border-gray-300 mb-2">
            <input
                autoFocus={autoFocus}
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
                                    // dùng onMouseDown để tránh bị blur trước khi onClick
                                    e.preventDefault();
                                    e.stopPropagation();
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

