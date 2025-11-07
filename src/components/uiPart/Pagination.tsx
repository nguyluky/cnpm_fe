
interface PaginationProps {
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    pageSize?: number;
    onPageSizeChange?: (size: number) => void;
}

export function Pagination({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    pageSize = 10,
    onPageSizeChange
}: PaginationProps) {
    return <div className="flex items-center justify-between gap-x-4">
        <nav className="flex justify-end items-center gap-x-1" aria-label="Pagination">
            <button type="button" onClick={() => {
                if (onPageChange && currentPage > 1) {
                    onPageChange(currentPage - 1);
                }
            }} className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none" aria-label="Previous">
                <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"></path>
                </svg>
                <span className="sr-only">Previous</span>
            </button>
            <div className="flex items-center gap-x-1">
                <span className="min-h-9.5 min-w-9.5 flex justify-center items-center border border-gray-200 text-gray-800 py-2 px-3 text-sm rounded-lg focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none ">{currentPage}</span>
                <span className="min-h-9.5 flex justify-center items-center text-gray-500 py-2 px-1.5 text-sm ">of</span>
                <span className="min-h-9.5 flex justify-center items-center text-gray-500 py-2 px-1.5 text-sm ">{
                    totalPages
                }</span>
            </div>
            <button type="button" onClick={() => {
                if (onPageChange && currentPage < totalPages) {
                    onPageChange(currentPage + 1);
                }
            }} className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none" aria-label="Next">
                <span className="sr-only">Next</span>
                <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"></path>
                </svg>
            </button>
        </nav>
        {
            // page size selector
        }
        <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 " value={pageSize} onChange={(e) => {
            if (onPageSizeChange) {
                onPageSizeChange(Number(e.target.value));
            }
        }}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
        </select>
    </div>;
}
