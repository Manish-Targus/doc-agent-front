type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Next 5 pages from current
  const nextPages = Array.from(
    { length: 5 },
    (_, i) => page + i
  ).filter((p) => p <= totalPages);

  // Last 5 pages
  const lastPages = Array.from(
    { length: 5 },
    (_, i) => totalPages - 4 + i
  ).filter((p) => p > 0);

  // Avoid duplicates
  const pages = Array.from(new Set([...nextPages, ...lastPages]));

  return (
    <div className="sticky bottom-0 bg-[#0B0F14]/95 border-t border-[#1F2937] backdrop-blur z-20">
      <div className="flex justify-center items-center gap-2 py-4">

        {/* Prev */}
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="px-4 py-2 rounded-lg border border-[#1F2937] text-gray-300
            disabled:opacity-40 hover:border-[#76B900] hover:text-[#76B900]"
        >
          Prev
        </button>

        {/* Page Numbers */}
        {pages.map((p, idx) => {
          const showEllipsis =
            idx > 0 && p - pages[idx - 1] > 1;

          return (
            <span key={p} className="flex items-center gap-2">
              {showEllipsis && (
                <span className="text-gray-500 px-1">…</span>
              )}

              <button
                onClick={() => onPageChange(p)}
                className={`px-3 py-2 rounded-lg text-sm border transition
                  ${
                    p === page
                      ? "bg-[#76B900] text-black border-[#76B900]"
                      : "border-[#1F2937] text-gray-300 hover:border-[#76B900] hover:text-[#76B900]"
                  }`}
              >
                {p}
              </button>
            </span>
          );
        })}

        {/* Next */}
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-4 py-2 rounded-lg border border-[#1F2937] text-gray-300
            disabled:opacity-40 hover:border-[#76B900] hover:text-[#76B900]"
        >
          Next
        </button>

      </div>
    </div>
  );
}
