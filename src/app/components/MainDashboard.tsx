import React, { useEffect, useState } from "react";
import { BidTile } from "./Dashboard/BidTile";
import { Modal } from "./Modal";
import PdfViewer from "./PdfViewer";
import ContentLoader from "react-content-loader";
import { api } from "../../utils/api";

const SkeletonCard = () => (
  <ContentLoader
    speed={1.2}
    width="100%"
    height={190}
    viewBox="0 0 350 190"
    backgroundColor="#1F2937"
    foregroundColor="#2B3441"
  >
    <rect x="20" y="18" rx="4" ry="4" width="60" height="10" />
    <rect x="20" y="35" rx="6" ry="6" width="180" height="16" />
    <rect x="300" y="20" rx="4" ry="4" width="20" height="20" />
    <rect x="20" y="70" rx="4" ry="4" width="260" height="12" />
    <rect x="20" y="92" rx="4" ry="4" width="300" height="12" />
    <rect x="20" y="110" rx="4" ry="4" width="240" height="12" />
    <rect x="20" y="140" rx="6" ry="6" width="60" height="22" />
    <rect x="90" y="140" rx="6" ry="6" width="50" height="22" />
    <rect x="150" y="140" rx="6" ry="6" width="70" height="22" />
  </ContentLoader>
);

const Section = ({
  title,
  collections,
  setModal
}: {
  title: string;
  collections: any[];
  setModal: (v: any) => void;
}) => (
  <section className="mt-14">
    <h3 className="text-center text-2xl font-semibold text-black tracking-wide mb-6">
      {title}
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
      {collections.length > 0
        ? collections.map((data, index) => (
            <BidTile key={index} data={data} setModal={setModal} />
          ))
        : [...Array(25)].map((_, i) => <SkeletonCard key={i} />)}
    </div>
  </section>
);

export default function MainDashboard() {
  const [collections, setCollections] = useState<any[]>([]);
  const [modal, setModal] = useState<string | false>(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setCollections([]);
        const data = await api.getBids({ page });
        setCollections(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCollections();
  }, [page]);

  return (
    <>
      <div className="min-h-screen px-6 py-8">
        {/* Header */}
    <header className="mb-10 flex items-center justify-between">
  <div className="text-center w-full">
    <h1 className="text-3xl font-serif tracking-tight">
      Bids Dashboard
    </h1>
    <p className="text-slate-400 mt-2 font-medium">
      Centralized tender monitoring & analysis
    </p>
  </div>

  {/* Profile */}
  <div className="absolute top-8 right-8">
    <ProfileDropdown />
  </div>
</header>

        {/* Sections */}
        <Section
          title="Saved Tenders Overview"
          collections={collections}
          setModal={setModal}
        />

        <Section
          title="GeM Tenders Overview"
          collections={collections}
          setModal={setModal}
        />

        <Section
          title="Website 2 Tenders Overview"
          collections={collections}
          setModal={setModal}
        />

        <Section
          title="Website 3 Tenders Overview"
          collections={collections}
          setModal={setModal}
        />
      </div>

      {/* Modal */}
      <Modal isOpen={!!modal} onClose={() => setModal(false)}>
        <div className="w-[900px] h-screen bg-black rounded-xl overflow-hidden">
          {modal && <PdfViewer file={modal} />}
        </div>
      </Modal>
    </>
  );
}
import { User, LogOut } from "lucide-react";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const [hoveringList, setHoveringList] = useState(false);

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    closeMenu();
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
     document.cookie.split(";").forEach(cookie => {
    const name = cookie.split("=")[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        // setOpen(false);
        setHoveringList(false);
      }}
    >
      {/* Avatar */}
      <div
        className="
          w-11 h-11 rounded-full
          bg-gradient-to-br from-yellow-400 to-yellow-200
          flex items-center justify-center
          cursor-pointer shadow-md
          transition-all duration-300
          hover:scale-110 hover:shadow-yellow-300/60
        "
      >
        <span className="text-black font-bold text-sm">M</span>
      </div>

      {/* Dropdown */}
      <div
        className={`
          absolute right-0 mt-4 w-36
          bg-white rounded-2xl border border-gray-200
          shadow-xl z-50
          transform transition-all duration-300 ease-out
          ${open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-3 pointer-events-none"}
        `}
        onMouseEnter={() => setHoveringList(true)}
        onMouseLeave={() => {setHoveringList(false)
          setOpen(false);
        }}
      >
        <div className="flex flex-col p-2 gap-1">
          {/* Profile */}
          <a href="/profile" className={`
              flex items-center justify-center h-11 rounded-xl
              transition-all duration-300
              ${hoveringList ? "opacity-40" : "opacity-100"}
              hover:opacity-100 hover:bg-gray-100
              hover:scale-105
              `}>

          <button
            onClick={closeMenu}
            
              >
            <User size={18} className="text-gray-700" />
          </button>
            </a>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`
              flex items-center justify-center h-11 rounded-xl
              transition-all duration-300
              ${hoveringList ? "opacity-40" : "opacity-100"}
              hover:opacity-100 hover:bg-red-50
              hover:scale-105
            `}
          >
            <LogOut size={18} className="text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

