import { Bookmark } from "lucide-react";

export function BidTile({ data, setModal }: { data?: any; setModal?: any }) {
  const keywords = ["Electrical", "UPS", "Services"];
  return (
    <div
      className="
        group
        relative
        rounded-2xl
        p-5
        cursor-pointer
        border border-white/10
        bg-gradient-to-br from-white/10 via-white/5 to-white/10
        backdrop-blur-xl
        shadow-[0_8px_30px_rgba(0,0,0,0.35)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_12px_40px_rgba(250,204,21,0.25)]
        hover:border-yellow-400/40
      "
    >
      {/* Light reflection overlay */}
      <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition pointer-events-none" />

      {/* Header */}
      <div className="relative flex justify-between items-start mb-4">
        <div className="max-w-[75%]">
          <p className="text-[11px] text-gray-800 uppercase tracking-widest">
            Bid ID
          </p>

          <h4
            onClick={() =>
              setModal(
                `https://bidplus.gem.gov.in/showbidDocument/${data?.b_id_parent?.[0]||data?.b_id?.[0]}`
              )
            }
            className="
              mt-1
              text-lg
              font-semibold
              text-yellow-400
              hover:underline
              truncate
            "
          >
            {data?.b_bid_number?.[0] || "N/A"}
          </h4>
        </div>

        {/* Bookmark */}
        <button
          className="
            p-2
            rounded-lg
            bg-white/5
            border border-white/10
            text-gray-800
            hover:text-yellow-400
            hover:border-yellow-400/50
            hover:bg-yellow-400/10
            transition
          "
          aria-label="Bookmark bid"
        >
          <Bookmark size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="relative space-y-2 text-sm">
        <p className="text-gray-800">
          Department:
          <span className="ml-1  font-medium">
            {data?.ba_official_details_deptName?.[0] || "N/A"}
          </span>
        </p>

        <p className="line-clamp-2 text-gray-800">
          Items:
          <span className="ml-1  font-medium">
            {data?.bd_category_name?.[0] || "N/A"}
          </span>
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-3">
          {keywords.map((k, i) => (
            <span
              key={i}
              className="
                text-xs
                px-3
                py-1
                rounded-full
                border border-white/20
                bg-white/10
                text-yellow-300
                backdrop-blur-md
                font-medium
                transition
                group-hover:border-yellow-400/40
              "
            >
              {k}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom glow bar */}
      <span
        className="
          absolute
          bottom-0
          left-6
          right-6
          h-[2px]
          bg-gradient-to-r from-transparent via-yellow-400 to-transparent
          opacity-0
          group-hover:opacity-100
          transition
        "
      />
    </div>
  );
}
