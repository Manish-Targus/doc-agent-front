"use client";

import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
// --- Types ---
interface User {
  id: number;
  email: string;
  name: string;
  designation?: string;
  keywords: string[];
  is_active: boolean;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const fetchUser = async()=>{ await api.getUserList().then((data)=>{setUsers(data)}).catch((err)=>{console.error("Failed to fetch users:", err)});}
  const updateUser = async(id:number,updatedData:Partial<User>)=>{ await  api.updateUser({ data: {updatedData,id} }).then((data)=>{console.log("User updated:",data)}).catch((err)=>{console.error("Failed to update user:", err)});}
  useEffect(() => {
 
  fetchUser();
}, []);
  useEffect(() => {
    const mockData: User[] = [
      { id: 1, email: "admin@corp.com", name: "Sarah Jenkins", designation: "System Architect", keywords: ["Cloud", "Security"], is_active: true },
      { id: 2, email: "dev@corp.com", name: "Mike Ross", designation: "Frontend Lead", keywords: ["React", "Tailwind"], is_active: false },
    ];
    // setUsers(mockData);
  }, []);

  const handleUpdate = async (id: number, updatedData: Partial<User>) => {
   updateUser(id,updatedData);
    setUsers(users.map(u => u.id === id ? { ...u, ...updatedData } : u));
    setEditingUser(null);
    // Add your API fetch logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 p-4 md:p-10 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin <span className="text-yellow-500">Panel</span></h1>
            <p className="text-slate-500 mt-1">Manage users and permissions with glass-level clarity.</p>
          </div>
          <div className="px-6 py-3 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl shadow-sm text-sm font-semibold">
            ⚡ {users.length} Total Users
          </div>
        </div>

        {/* Main Glass Table Container */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-[0_8px_32px_0_rgba(255,230,0,0.1)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-yellow-400/20 text-yellow-900 text-sm uppercase tracking-wider">
                  <th className="p-6 font-bold">User</th>
                  <th className="p-6 font-bold">Designation</th>
                  <th className="p-6 font-bold">Keywords</th>
                  <th className="p-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {users.map(user => (
                  <tr key={user.id} className="group hover:bg-white/40 transition-all duration-300">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-yellow-900 shadow-inner">
                          {user.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-sm font-medium italic text-slate-600">
                      {user.designation || 'Staff'}
                    </td>
                    <td className="p-6">
                      <div className="flex flex-wrap gap-2">
                        {user.keywords.map(k => (
                          <span key={k} className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 text-yellow-700 text-[10px] font-bold uppercase rounded-full">
                            {k}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="px-4 py-2 bg-white/80 hover:bg-yellow-400 hover:text-yellow-900 transition-colors rounded-xl text-xs font-bold shadow-sm border border-white"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleUpdate(user.id, { is_active: !user.is_active })}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            user.is_active 
                            ? 'bg-slate-900 text-white hover:bg-slate-700' 
                            : 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300'
                          }`}
                        >
                          {user.is_active ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- Glass Modal --- */}
      {editingUser && (
        <div className="fixed inset-0 bg-yellow-900/10 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border border-white/80 relative overflow-hidden">
            {/* Decorative yellow glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-400/20 rounded-full blur-3xl" />
            
            <h2 className="text-2xl font-black mb-6 text-slate-900">Modify User</h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const keywordsStr = formData.get('keywords') as string;
              handleUpdate(editingUser.id, {
                name: formData.get('name') as string,
                designation: formData.get('designation') as string,
                keywords: keywordsStr.split(',').map(s => s.trim()).filter(s => s !== "")
              });
            }}>
              <div className="space-y-5">
                <div className="group">
                  <label className="text-[10px] font-black uppercase text-yellow-600 ml-1">Full Name</label>
                  <input name="name" defaultValue={editingUser.name} className="w-full bg-white/50 border-white focus:border-yellow-400 focus:ring-0 rounded-2xl px-4 py-3 mt-1 transition-all outline-none border-2" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-yellow-600 ml-1">Designation</label>
                  <input name="designation" defaultValue={editingUser.designation} className="w-full bg-white/50 border-white focus:border-yellow-400 focus:ring-0 rounded-2xl px-4 py-3 mt-1 transition-all outline-none border-2" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-yellow-600 ml-1">Expertise Keywords</label>
                  <input name="keywords" defaultValue={editingUser.keywords.join(', ')} className="w-full bg-white/50 border-white focus:border-yellow-400 focus:ring-0 rounded-2xl px-4 py-3 mt-1 transition-all outline-none border-2" />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 px-4 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                  Discard
                </button>
                <button type="submit" className="flex-1 px-4 py-3 bg-yellow-400 text-yellow-900 rounded-2xl font-black text-sm shadow-lg shadow-yellow-200 hover:scale-[1.02] active:scale-95 transition-all">
                  Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;