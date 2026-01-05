import React, { useEffect, useState } from "react";
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
import { api } from '../../utils/api';
import ContentLoader from "react-content-loader";
import { Pagination } from "./utils/Pagination";

const SAMPLE_PDF_URL = "/GeM-Bidding-8557175.pdf"
export default function Dashboard() {
  const [collections, setCollections] = useState<Array<any>>([]);
  const [modal, setModal] = useState<string | false>(false);
  const [page,setPage]=useState(1);
  const [totalPages,setTotalPages]=useState(100);
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setCollections([]);
        const data = await api.getBids({page});
        setCollections(Array.isArray(data?.data) ? data.data : []);
        setTotalPages( Math.ceil((data?.totalPages || 0) ));
      } catch (error) {
        console.error(error);
      }
    };
    fetchCollections();
  }, [page]);

  return (
    <>
      <div className=" bg-[#0B0F14] p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-200 tracking-wide">
            Bids Dashboard
          </h2>
          <br />
          <h3 className=" capitalize text-center text-3xl text-gray-400">
           Saved tenders overview
          </h3>
        </div>

        {/* Grid */}
        <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 py-4">
          {collections?.length>0? collections.map((data, index) => (
            <BidTile key={index} data={data} setModal={setModal} />
          )):
         [...new Array(25)].map((_,i)=>(  <ContentLoader
      speed={1.2}
      width="100%"
      height={190}
      viewBox="0 0 350 190"
      backgroundColor="#1F2937"
      foregroundColor="#2B3441"
      
    >
      {/* Bid ID label */}
      <rect x="20" y="18" rx="4" ry="4" width="60" height="10" />

      {/* Bid number */}
      <rect x="20" y="35" rx="6" ry="6" width="180" height="16" />

      {/* Bookmark icon */}
      <rect x="300" y="20" rx="4" ry="4" width="20" height="20" />

      {/* Department */}
      <rect x="20" y="70" rx="4" ry="4" width="260" height="12" />

      {/* Items (2 lines) */}
      <rect x="20" y="92" rx="4" ry="4" width="300" height="12" />
      <rect x="20" y="110" rx="4" ry="4" width="240" height="12" />

      {/* Tags */}
      <rect x="20" y="140" rx="6" ry="6" width="60" height="22" />
      <rect x="90" y="140" rx="6" ry="6" width="50" height="22" />
      <rect x="150" y="140" rx="6" ry="6" width="70" height="22" />
    </ContentLoader>))
          }
        </div>
</div>
{/* GEMS */}
<div className="py-3">
  
     <h3 className=" capitalize text-center text-3xl text-gray-400 py-3">
           GEMS tenders overview
          </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
          {collections?.length>0? collections.map((data, index) => (
            <BidTile key={index} data={data} setModal={setModal} />
          )):
         [...new Array(25)].map((_,i)=>(  <ContentLoader
      speed={1.2}
      width="100%"
      height={190}
      viewBox="0 0 350 190"
      backgroundColor="#1F2937"
      foregroundColor="#2B3441"
      
    >
      {/* Bid ID label */}
      <rect x="20" y="18" rx="4" ry="4" width="60" height="10" />

      {/* Bid number */}
      <rect x="20" y="35" rx="6" ry="6" width="180" height="16" />

      {/* Bookmark icon */}
      <rect x="300" y="20" rx="4" ry="4" width="20" height="20" />

      {/* Department */}
      <rect x="20" y="70" rx="4" ry="4" width="260" height="12" />

      {/* Items (2 lines) */}
      <rect x="20" y="92" rx="4" ry="4" width="300" height="12" />
      <rect x="20" y="110" rx="4" ry="4" width="240" height="12" />

      {/* Tags */}
      <rect x="20" y="140" rx="6" ry="6" width="60" height="22" />
      <rect x="90" y="140" rx="6" ry="6" width="50" height="22" />
      <rect x="150" y="140" rx="6" ry="6" width="70" height="22" />
    </ContentLoader>))
          }
        </div>

</div>
<div className="py-3">
  
     <h3 className=" capitalize text-center text-3xl text-gray-400 py-3">
           Website2 tenders overview
          </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
          {collections?.length>0? collections.map((data, index) => (
            <BidTile key={index} data={data} setModal={setModal} />
          )):
         [...new Array(25)].map((_,i)=>(  <ContentLoader
      speed={1.2}
      width="100%"
      height={190}
      viewBox="0 0 350 190"
      backgroundColor="#1F2937"
      foregroundColor="#2B3441"
      
    >
      {/* Bid ID label */}
      <rect x="20" y="18" rx="4" ry="4" width="60" height="10" />

      {/* Bid number */}
      <rect x="20" y="35" rx="6" ry="6" width="180" height="16" />

      {/* Bookmark icon */}
      <rect x="300" y="20" rx="4" ry="4" width="20" height="20" />

      {/* Department */}
      <rect x="20" y="70" rx="4" ry="4" width="260" height="12" />

      {/* Items (2 lines) */}
      <rect x="20" y="92" rx="4" ry="4" width="300" height="12" />
      <rect x="20" y="110" rx="4" ry="4" width="240" height="12" />

      {/* Tags */}
      <rect x="20" y="140" rx="6" ry="6" width="60" height="22" />
      <rect x="90" y="140" rx="6" ry="6" width="50" height="22" />
      <rect x="150" y="140" rx="6" ry="6" width="70" height="22" />
    </ContentLoader>))
          }
        </div>

</div>
<div className="py-3">
  
     <h3 className=" capitalize text-center text-3xl text-gray-400 py-3">
           Website3 tenders overview
          </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
          {collections?.length>0? collections.map((data, index) => (
            <BidTile key={index} data={data} setModal={setModal} />
          )):
         [...new Array(25)].map((_,i)=>(  <ContentLoader
      speed={1.2}
      width="100%"
      height={190}
      viewBox="0 0 350 190"
      backgroundColor="#1F2937"
      foregroundColor="#2B3441"
      
    >
      {/* Bid ID label */}
      <rect x="20" y="18" rx="4" ry="4" width="60" height="10" />

      {/* Bid number */}
      <rect x="20" y="35" rx="6" ry="6" width="180" height="16" />

      {/* Bookmark icon */}
      <rect x="300" y="20" rx="4" ry="4" width="20" height="20" />

      {/* Department */}
      <rect x="20" y="70" rx="4" ry="4" width="260" height="12" />

      {/* Items (2 lines) */}
      <rect x="20" y="92" rx="4" ry="4" width="300" height="12" />
      <rect x="20" y="110" rx="4" ry="4" width="240" height="12" />

      {/* Tags */}
      <rect x="20" y="140" rx="6" ry="6" width="60" height="22" />
      <rect x="90" y="140" rx="6" ry="6" width="50" height="22" />
      <rect x="150" y="140" rx="6" ry="6" width="70" height="22" />
    </ContentLoader>))
          }
        </div>

</div>
      </div>


      {/* <Pagination page={page} totalPages={totalPages} onPageChange={setPage} /> */}
      {/* Modal */}
      <Modal isOpen={!!modal} onClose={() => setModal(false)}>
        <div className="w-[900px] h-screen bg-black rounded-xl overflow-hidden">
          {modal && <PdfViewer file={modal} />}
        </div>
      </Modal>
    </>
  );
}

