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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BidTile } from "../components/Dashboard/BidTile";
import { api } from "../../utils/api";

interface UserProfile {
  name: string;
  email: string;
  designation: string;
  keywords: string[];
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
          name: "Manish Bohat",
          email: "manish@example.com",
          designation: "Procurement Analyst",
          keywords: ["Electrical", "UPS", "Services"],
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
      // Call your API to update the profile
      await api.updateProfile({
        name: user.name,
        designation: user.designation,
        keywords: user.keywords,
      });

      // Update original user data
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
        {/* HOME */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-md border border-yellow-300 bg-white text-yellow-700 text-sm hover:bg-yellow-50 transition"
        >
          <Home size={16} />
          Home
        </button>

        {/* LOGOUT */}
        <button
          onClick={() => {
            document.cookie = "access_token=; Max-Age=0; path=/";
            router.replace("/login");
          }}
          className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-100 transition"
        >
          <LogOut size={16} />
          Logout
        </button>

        {/* PROFILE CORE */}
        <div className="max-w-7xl mx-auto px-10 py-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* AVATAR */}
              <div className="w-40 h-40 rounded-full bg-white border-4 border-yellow-200 shadow flex items-center justify-center text-4xl font-semibold text-gray-700">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>

              {/* INFO */}
              <div className="space-y-4">
                <div>
                  {editing ? (
                    <input
                      className="text-black profile-input text-4xl font-semibold w-full max-w-md"
                      value={user.name}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                      placeholder="Enter your name"
                    />
                  ) : (
                    <h1 className="text-4xl font-semibold text-gray-900">
                      {user.name}
                    </h1>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Designation</p>
                  {editing ? (
                    <input
                      className="text-black profile-input text-lg w-full max-w-md"
                      value={user.designation}
                      onChange={(e) =>
                        setUser({ ...user, designation: e.target.value })
                      }
                      placeholder="Enter your designation"
                    />
                  ) : (
                    <p className="text-lg text-gray-700">{user.designation}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Email cannot be changed
                  </p>
                </div>
              </div>
            </div>

            {/* EDIT/SAVE/CANCEL BUTTONS */}
            <div className="flex flex-col gap-2">
              {editing ? (
                <>
                  <button
                    onClick={saveProfile}
                    disabled={isSaving}
                    className="dense-btn bg-green-600 hover:bg-green-700 text-white border-green-700"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
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
      <div className="max-w-7xl mx-auto px-10 py-12">
        <div className="border border-yellow-300 bg-yellow-50 rounded-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl text-yellow-800 font-semibold">
              Bid Preference Keywords
            </h2>
            {!editing && user.keywords.length === 0 && (
              <p className="text-yellow-600">No keywords added yet</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {user.keywords.map((k) => (
              <span
                key={k}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-400 bg-white text-yellow-700 font-medium"
              >
                {k}
                {editing && (
                  <X
                    size={14}
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => removeKeyword(k)}
                  />
                )}
              </span>
            ))}
          </div>

          {editing && (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-yellow-700">
                Add keywords for bid recommendations
              </p>
              <div className="flex gap-3">
                <input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add keyword (e.g., 'Construction', 'IT Services')"
                  className="profile-input flex-1 max-w-md"
                />
                <button onClick={addKeyword} className="dense-btn">
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
      <div className="max-w-7xl mx-auto px-10 pb-16">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Saved Bids
          </h2>

          <div className="flex gap-2">
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
              className="dense-btn"
            >
              {viewAll ? "Collapse" : "View All"}
            </button>
          </div>
        </div>

        {!viewAll ? (
          <div
            id="saved-bids-strip"
            className="flex gap-4 overflow-x-auto scrollbar-hide"
          >
            {savedBids.slice(0, 5).map((bid, i) => (
              <div key={i} className="min-w-[300px]">
                <BidTile data={bid} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        }
        .profile-input:focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }
        .dense-btn {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          background: white;
          color: #374151;
          font-weight: 500;
          transition: all 0.2s;
          cursor: pointer;
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