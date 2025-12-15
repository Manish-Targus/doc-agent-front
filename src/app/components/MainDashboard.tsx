import React, { useState } from "react";
import { BidTile } from "./Dashboard/BidTile";
import { Modal } from "./Modal";
import SamplePdfViewer from "./SamplePdfViewer";
import PdfViewer from "./PdfViewer";

// export function DashboardLayout({ sidebar, content }: { sidebar: React.ReactNode; content: React.ReactNode }) {
//   return (
//     <div className="flex w-full h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="  w-full bg-white shadow-xl p-4 overflow-y-auto border-r border-gray-200">
//         {sidebar}
//       </aside>

//       {/* Main Content */}
//       {/* <main className="flex-1 p-6 overflow-y-auto">{content}</main> */}
//     </div>
//   );
// }


const SAMPLE_PDF_URL = "/GeM-Bidding-8557175.pdf"

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
        <div className=" w-full bg-white shadow-xl p-4  border-r border-gray-200">
          <h2 className="  text-xl font-bold mb-4">Bids</h2>
              <div className="grid grid-cols-4 gap-4 p-4  w-full h-screen ">

          {
            [...Array(10)].map((_, index) => (
              <div onClick={() => setIsModalOpen(true)} key={index} className="flex flex-row gap-2 mb-2">

                <BidTile  key={index} />
              </div>
            ))
          }
          </div>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-4">
          <PdfViewer file={SAMPLE_PDF_URL}  />
        </div>
      </Modal>
        </div>
      </>
   
  );
}
