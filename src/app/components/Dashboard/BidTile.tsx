import { Bookmark, Save } from "lucide-react";

export function BidTile() {
    let keywords = ["Electrical", "UPS", "Services"];
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mb-4 cursor-pointer transform transition duration-300 hover:scale-[1.02]">
      <div className="flex justify-between items-center mb-3">
        {/* <div>
          <p className="text-gray-600 text-sm">Bid No.</p>
          <a className="text-blue-600 font-semibold hover:underline" href="#" target="_blank">
            GEM/2025/B/6560163
          </a>
        </div>

        <div>
          <p className="text-gray-600 text-sm">RA No.</p>
          <a className="text-blue-600 font-semibold hover:underline" href="#" target="_blank">
            GEM/2025/R/587302
          </a>
        </div> */}

<div>

        <h4>

            <span className="text-gray-600 text-sm">Bid Title: </span>
            <span className="text-yellow-600 font-semibold hover:underline">Online UPS (V2) - ----</span>
        </h4>
</div>
<div>
    <Bookmark className="text-gray-500 hover:text-gray-800" />
</div>
      </div>

      <div className="border-t pt-3 text-sm text-gray-700">
        <p><strong>Items:</strong> Custom Bid for Services - ----</p>
        <p><strong>Quantity:</strong> 1</p>
        <p><strong>Department:</strong> Ministry of Steel / Steel Authority of India Limited</p>
       
        <div className="flex justify-evenly gap-2 mt-2 text-sm bg-gray-50 p-2 rounded-lg">
           {keywords.map((keyword, index) => (
        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs" key={index}>{keyword} </span>    ))} 

        </div>
      </div>
    </div>
  );
}