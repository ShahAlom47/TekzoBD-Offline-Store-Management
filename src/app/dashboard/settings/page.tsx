"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/AuthContext";
import { getUserInfo } from "@/lib/allApiRequest/userRequest/userRequest";



export default function Settings() {
  const { user } = useUser();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", password: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["users", user?.phone || ""],
    queryFn:async () =>{
        const res = await  getUserInfo(user?.phone || "")
        console.log(res)
        return res;
    },
  });
console.log(data)
  if (isLoading) return <div className="p-6">Loading...</div>;

  const currentUser = data?.data;
  const users = data?.data?.users || [];

  const handleEdit = () => {
    setEditing(true);
    setForm({ name: currentUser.name, password: "" });
  };

  const handleSave = async () => {
    await fetch(`/api/users/${currentUser._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setEditing(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile Card */}
      <div className="bg-white shadow rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Profile</h2>
          {!editing && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-black text-white rounded"
            >
              Edit
            </button>
          )}
        </div>

        {!editing ? (
          <div className="space-y-2">
            <p><strong>Name:</strong> {currentUser?.name}</p>
            <p><strong>Role:</strong> {currentUser?.role}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="Name"
            />

            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="New Password"
            />

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Admin Only User List */}
      {currentUser?.role === "admin" && (
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">All Users</h2>

          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Role</th>
                </tr>
              </thead>
              {/* <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.role}</td>
                  </tr>
                ))}
              </tbody> */}
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
