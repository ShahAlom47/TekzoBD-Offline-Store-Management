import React, { useState } from "react";

const mockUsers = [
  { id: 1, name: "Admin User", role: "admin" },
  { id: 2, name: "Staff One", role: "staff" },
];

export default function User() {
  const [users, setUsers] = useState(mockUsers);
  const [name, setName] = useState("");
  const [role, setRole] = useState("staff");

  const addUser = () => {
    if (!name) return;
    const newUser = {
      id: Date.now(),
      name,
      role,
    };
    setUsers([...users, newUser]);
    setName("");
    setRole("staff");
  };

  const deleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const changeRole = (id, newRole) => {
    setUsers(
      users.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      {/* Add User */}
      <div className="bg-white shadow rounded-2xl p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New User</h2>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="User name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-1/3"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={addUser}
            className="bg-black text-white px-4 py-2 rounded hover:opacity-80"
          >
            Add User
          </button>
        </div>
      </div>

      {/* User List */}
      <div className="bg-white shadow rounded-2xl p-4">
        <h2 className="text-lg font-semibold mb-4">All Users</h2>

        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-3">{user.name}</td>

                  <td className="p-3">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        changeRole(user.id, e.target.value)
                      }
                      className="border px-2 py-1 rounded"
                    >
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
