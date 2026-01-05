import { Bookmark } from "lucide-react";

export function BidTile({ data, setModal }: { data?: any; setModal?: any }) {
  const keywords = ["Electrical", "UPS", "Services"];

  return (
    <div
      className="
        bg-black
        border border-[#1F2937]
        rounded-2xl
        p-5
        transition-all duration-300
        hover:border-[#76B900]
        hover:shadow-[0_0_0_1px_#76B900]
        hover:-translate-y-1
        cursor-pointer
        backdrop-blur-md bg-white/5

      "
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs text-gray-400">Bid ID</p>
          <h4
            onClick={() =>
              setModal(
                `https://bidplus.gem.gov.in/showbidDocument/${data?.b_id_parent?.[0]}`
              )
            }
            className="text-lg font-semibold text-[#76B900] hover:underline truncate max-w-[260px]"
          >
            {data?.b_bid_number?.[0] || "N/A"}
          </h4>
        </div>

        <Bookmark
          className="
            text-gray-500
            hover:text-[#76B900]
            transition
          "
        />
      </div>

      {/* Body */}
      <div className="space-y-3 text-sm text-gray-300">
        <p>
          <span className="text-gray-400">Department:</span>{" "}
          {data?.ba_official_details_deptName?.[0] || "N/A"}
        </p>

        <p className="line-clamp-2">
          <span className="text-gray-400">Items:</span>{" "}
          {data?.bd_category_name?.[0] || "N/A"}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {keywords.map((k, i) => (
            <span
              key={i}
              className="
                text-xs
                px-2 py-1
                rounded-md
                border border-[#1F2937]
                text-[#76B900]
                bg-[#0B0F14]
              "
            >
              {k}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
