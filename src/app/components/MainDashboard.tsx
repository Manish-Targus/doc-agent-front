// Updated MainDashboard.tsx
import React, { useEffect, useState } from "react";
import { BidTile } from "./Dashboard/BidTile";
import { Modal } from "./Modal";
import PdfViewer from "./PdfViewer";
import ContentLoader from "react-content-loader";
import { api } from "../../utils/api";
import { Filters, FilterState } from "../components/Dashboard/Filters"; // Adjust path as needed

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
  const [filteredCollections, setFilteredCollections] = useState<any[]>([]);
  const [modal, setModal] = useState<string | false>(false);
  const [page, setPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setCollections([]);
        const data = await api.getBids({ page,byType:activeFilters?.byType||'',highBidValue:activeFilters?.highBidValue||'',bidStatusType:activeFilters?.bidStatusType||'' ,byEndDate:{from:activeFilters?.fromEndDate,to:activeFilters?.toEndDate}});
        const fetchedData = Array.isArray(data?.data) ? data.data : [];
        setCollections(fetchedData);
        setFilteredCollections(fetchedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCollections();
    console.log(activeFilters)
  }, [page,activeFilters]);

  // Apply filters when activeFilters change
  useEffect(() => {
    if (!activeFilters || collections.length === 0) {
      setFilteredCollections(collections);
      return;
    }

    let filtered = [...collections];

    // Apply bid type filters
    if (activeFilters.all) {
      // Show all if "All" is selected
    } else {
      const bidTypes = [
        { key: 'product', value: 'Product' },
        { key: 'service', value: 'Service' },
        { key: 'bidToRA', value: 'BidToRA' },
        { key: 'custom', value: 'Custom' },
        { key: 'boq', value: 'BOQ' },
        { key: 'rcbid', value: 'RCBid' },
      ];

      const selectedTypes = bidTypes.filter(type => 
        activeFilters[type.key as keyof FilterState]
      );

      if (selectedTypes.length > 0) {
        filtered = filtered.filter(item => 
          selectedTypes.some(type => 
            item.type?.toLowerCase() === type.value.toLowerCase() || 
            item.category?.toLowerCase() === type.value.toLowerCase()
          )
        );
      }
    }

    // Apply high value filter
    if (activeFilters.highValue) {
      filtered = filtered.filter(item => 
        item.value >= 20000000 || item.highValue === true
      );
    }

    // Apply ongoing bids filter
    if (activeFilters.ongoing_bids) {
      filtered = filtered.filter(item => 
        item.status === 'ongoing' || item.isActive === true
      );
    }

    // Apply bid status filters
    if (activeFilters.bidrastatus) {
      const statuses = [
        { key: 'tech_evaluated', value: 'Technical Evaluated' },
        { key: 'fin_evaluated', value: 'Financial Evaluated' },
        { key: 'bid_awarded', value: 'Awarded' },
      ];

      const selectedStatuses = statuses.filter(status => 
        activeFilters[status.key as keyof FilterState]
      );

      if (selectedStatuses.length > 0) {
        filtered = filtered.filter(item => 
          selectedStatuses.some(status => 
            item.status?.toLowerCase().includes(status.value.toLowerCase()) ||
            item.evaluationStatus?.toLowerCase().includes(status.value.toLowerCase())
          )
        );
      }
    }

    // Apply date filters
    if (activeFilters.fromEndDate) {
      const fromDate = new Date(activeFilters.fromEndDate);
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.endDate || item.closingDate);
        return itemDate >= fromDate;
      });
    }

    if (activeFilters.toEndDate) {
      const toDate = new Date(activeFilters.toEndDate);
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.endDate || item.closingDate);
        return itemDate <= toDate;
      });
    }

    setFilteredCollections(filtered);
  }, [activeFilters, collections]);

  const handleFilterChange = (filters: FilterState) => {
    setActiveFilters(filters);
  };
useEffect(() => {
    // Close filter sidebar on larger screens
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsFilterOpen(true);
      }
      else {        setIsFilterOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {

    console.log("Active Filters Updated:", activeFilters);
  }, [activeFilters]);
  return (
    <>
      <div className="min-h-screen px-6 py-8">
        {/* Header with Filter Toggle */}
        <header className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-serif tracking-tight">
                Bids Dashboard
              </h1>
              <p className="text-slate-400 mt-2 font-medium">
                Centralized tender monitoring & analysis
              </p>
            </div>

            {/* Filter Toggle for Mobile */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>

            {/* Profile */}
            <div className="absolute top-8 right-8">
              <ProfileDropdown />
            </div>
          </div>

          {/* Main Content with Sidebar */}
          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
              <Filters onFilterChange={handleFilterChange} />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Active Filters Summary */}
              {activeFilters && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-700">Active Filters:</h4>
                    <span className="text-sm text-blue-600">
                      {filteredCollections.length} results
                    </span>
                  </div>
                  {/* You can add more detailed filter summary here */}
                </div>
              )}

              {/* Sections */}
              <Section
                title="Saved Tenders Overview"
                collections={filteredCollections}
                setModal={setModal}
              />

              <Section
                title="GeM Tenders Overview"
                collections={filteredCollections}
                setModal={setModal}
              />

              <Section
                title="Website 2 Tenders Overview"
                collections={filteredCollections}
                setModal={setModal}
              />

              <Section
                title="Website 3 Tenders Overview"
                collections={filteredCollections}
                setModal={setModal}
              />

              {/* Pagination */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 mx-1 bg-gray-100 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 mx-1 bg-blue-600 text-white rounded-lg">
                  {page}
                </span>
                <button
                  onClick={() => setPage(prev => prev + 1)}
                  className="px-4 py-2 mx-1 bg-gray-100 rounded-lg"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </header>
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

// ProfileDropdown component remains the same...
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