"use client";

import { useEffect, useState } from "react";
import {
  Home,
  LogOut,
  Edit,
  Save,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Menu,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BidTile } from "../components/Dashboard/BidTile";
import { api } from "../../utils/api";

interface UserProfile {
  name: string;
  email: string;
  designation: string;
  keywords: string[];
  role?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [viewAll, setViewAll] = useState(false);
  const [originalUser, setOriginalUser] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<UserProfile>({
    name: "",
    email: "",
    designation: "",
    keywords: [],
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isKeywordsExpanded, setIsKeywordsExpanded] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        const userProfile = {
          name: data.user.name,
          email: data.user.email,
          designation: data.user.designation,
          keywords: data.user.keywords || [],
        };
        setUser(userProfile);
        setOriginalUser(userProfile);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // Fallback to default values if API fails
        const defaultProfile = {
          name: "Error",
          email: "",
          designation: "",
          keywords: [""],
        };
        setUser(defaultProfile);
        setOriginalUser(defaultProfile);
      }
    };

    fetchProfile();
  }, []);

  // Save profile changes
  const saveProfile = async () => {
    if (!user.name.trim() || !user.designation.trim()) {
      alert("Name and designation are required!");
      return;
    }

    setIsSaving(true);
    try {
      await api.updateProfile({
        name: user.name,
        designation: user.designation,
        keywords: user.keywords,
      });

      setOriginalUser({ ...user });
      setEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save profile changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    if (originalUser) {
      setUser(originalUser);
    }
    setEditing(false);
    setNewKeyword("");
  };

  // Add keyword
  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    const trimmedKeyword = newKeyword.trim();
    if (user.keywords.includes(trimmedKeyword)) {
      alert("Keyword already exists!");
      return;
    }
    setUser({
      ...user,
      keywords: [...user.keywords, trimmedKeyword],
    });
    setNewKeyword("");
  };

  // Remove keyword
  const removeKeyword = (k: string) => {
    setUser({
      ...user,
      keywords: user.keywords.filter((x) => x !== k),
    });
  };

  // Handle Enter key for keyword input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addKeyword();
    }
  };

  const scroll = (dir: "left" | "right") => {
    document
      .getElementById("saved-bids-strip")
      ?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  // Dummy saved bids data
  const savedBids = new Array(9).fill(null).map((_, i) => ({
    b_bid_number: [`GEM/2024/B/${1300 + i}`],
    ba_official_details_deptName: ["Ministry of Power"],
    bd_category_name: ["Electrical Equipment"],
    b_id_parent: [1300 + i],
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <div className="relative bg-gradient-to-b from-yellow-50 to-white border-b border-gray-200">
        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden absolute top-6 left-4 z-50 p-2 rounded-md border border-gray-300 bg-white"
        >
          <Menu color="black" size={20} />
        </button>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-16 left-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg z-40 p-4">
            <button
              onClick={() => router.push("/")}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-yellow-300 bg-white text-yellow-700 text-sm hover:bg-yellow-50 transition mb-2"
            >
              <Home size={16} />
              Home
            </button>
            {user.role=="admin"&&<button
              onClick={() => router.replace("/admin-panel")}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md border-2 border-amber-500 bg-white text-gray-700 text-sm hover:bg-amber-50 transition-colors mb-2"
            >
              <LogOut size={16} className="text-amber-600" />
              <span className="font-medium">Admin Panel</span>
            </button>}
            <button
              onClick={() => {
                document.cookie = "access_token=; Max-Age=0; path=/";
                router.replace("/login");
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-100 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}

        {/* DESKTOP NAVIGATION */}
        <button
          onClick={() => router.push("/")}
          className="hidden lg:flex absolute top-6 left-6 items-center gap-2 px-3 py-1.5 rounded-md border border-yellow-300 bg-white text-yellow-700 text-sm hover:bg-yellow-50 transition"
        >
          <Home size={16} />
          Home
        </button>

        <div className="hidden lg:flex absolute top-6 right-6 items-center gap-3">
          <button
            onClick={() => router.replace("/admin-panel")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border-2 border-amber-500 bg-white text-gray-700 text-sm hover:bg-amber-50 transition-colors"
          >
            <LogOut size={16} className="text-amber-600" />
            <span className="font-medium">Admin Panel</span>
          </button>
          <button
            onClick={() => {
              document.cookie = "access_token=; Max-Age=0; path=/";
              router.replace("/login");
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-100 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* PROFILE CORE */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-6 lg:gap-8">
              {/* AVATAR */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white border-4 border-yellow-200 shadow flex items-center justify-center text-3xl sm:text-4xl font-semibold text-gray-700 shrink-0">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>

              {/* INFO */}
              <div className="space-y-4 text-center sm:text-left">
                <div>
                  {editing ? (
                    <input
                      className="text-black profile-input text-2xl sm:text-3xl lg:text-4xl font-semibold w-full max-w-md text-center sm:text-left"
                      value={user.name}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                      placeholder="Enter your name"
                    />
                  ) : (
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900">
                      {user.name}
                    </h1>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Designation</p>
                  {editing ? (
                    <input
                      className="text-black profile-input text-base sm:text-lg w-full max-w-md text-center sm:text-left"
                      value={user.designation}
                      onChange={(e) =>
                        setUser({ ...user, designation: e.target.value })
                      }
                      placeholder="Enter your designation"
                    />
                  ) : (
                    <p className="text-base sm:text-lg text-gray-700">{user.designation}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-600 text-sm sm:text-base break-all">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Email cannot be changed
                  </p>
                </div>
              </div>
            </div>

            {/* EDIT/SAVE/CANCEL BUTTONS */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 justify-center">
              {editing ? (
                <>
                  <button
                    onClick={saveProfile}
                    disabled={isSaving}
                    className="dense-btn bg-green-600 hover:bg-green-700 text-white border-green-700"
                  >
                    {isSaving ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </span>
                    ) : (
                      <>
                        <Save size={16} />
                        <span className="ml-2">Save Changes</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="dense-btn bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                  >
                    <X size={16} />
                    <span className="ml-2">Cancel</span>
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="dense-btn">
                  <Edit size={16} />
                  <span className="ml-2">Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KEYWORDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
        <div className="border border-yellow-300 bg-yellow-50 rounded-lg p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl text-yellow-800 font-semibold">
              Bid Preference Keywords
            </h2>
            {!editing && user.keywords.length === 0 && (
              <p className="text-yellow-600 text-sm sm:text-base">No keywords added yet</p>
            )}
            <button
              onClick={() => setIsKeywordsExpanded(!isKeywordsExpanded)}
              className="lg:hidden flex items-center gap-1 text-yellow-700 text-sm"
            >
              {isKeywordsExpanded ? "Show Less" : "Show All"}
              {isKeywordsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          <div className={`flex flex-wrap gap-3 ${!isKeywordsExpanded && "lg:block hidden"}`}>
            {user.keywords.map((k) => (
              <span
                key={k}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-yellow-400 bg-white text-yellow-700 font-medium text-sm sm:text-base"
              >
                {k}
                {editing && (
                  <X
                    size={14}
                    className="cursor-pointer hover:text-red-500 shrink-0"
                    onClick={() => removeKeyword(k)}
                  />
                )}
              </span>
            ))}
          </div>

          {editing && (
            <div className="mt-6 lg:mt-8 space-y-4">
              <p className="text-sm text-yellow-700">
                Add keywords for bid recommendations
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add keyword (e.g., 'Construction', 'IT Services')"
                  className="profile-input flex-1 max-w-md"
                />
                <button onClick={addKeyword} className="dense-btn sm:w-auto justify-center">
                  <Plus size={14} /> Add Keyword
                </button>
              </div>
              <div className="text-xs text-gray-500">
                Press Enter or click "Add Keyword" to save
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SAVED BIDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-8 lg:pb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Saved Bids
          </h2>

          <div className="flex gap-2 self-end sm:self-auto">
            {!viewAll && (
              <>
                <button
                  onClick={() => scroll("left")}
                  className="dense-btn px-2"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="dense-btn px-2"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            <button
              onClick={() => setViewAll(!viewAll)}
              className="dense-btn text-sm sm:text-base"
            >
              {viewAll ? "Collapse" : "View All"}
            </button>
          </div>
        </div>

        {!viewAll ? (
          <div
            id="saved-bids-strip"
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          >
            {savedBids.slice(0, 5).map((bid, i) => (
              <div key={i} className="min-w-[280px] sm:min-w-[300px]">
                <BidTile data={bid} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedBids.map((bid, i) => (
              <BidTile key={i} data={bid} />
            ))}
          </div>
        )}
      </div>

      {/* Add some custom styles */}
      <style jsx>{`
        .profile-input {
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          background: white;
          transition: border-color 0.2s;
          font-size: 1rem;
        }
        @media (min-width: 640px) {
          .profile-input {
            font-size: 1.125rem;
          }
        }
        .profile-input:focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }
        .dense-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          background: white;
          color: #374151;
          font-weight: 500;
          transition: all 0.2s;
          cursor: pointer;
          white-space: nowrap;
          font-size: 0.875rem;
        }
        @media (min-width: 640px) {
          .dense-btn {
            font-size: 1rem;
          }
        }
        .dense-btn:hover {
          background: #f9fafb;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}