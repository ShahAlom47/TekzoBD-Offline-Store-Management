"use client";

import { CustomTable } from "../CommonComponents/CustomTable";
import { User, UserRole } from "@/Interfaces/userInterfaces";
import { useConfirm } from "@/hook/useConfirm";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast/headless";
import { updateUser } from "@/lib/allApiRequest/userRequest/userRequest";

interface Props {
  users: User[];
  currentUser: User;
}

const UserTable = ({ users, currentUser }: Props) => {
  const { confirm, ConfirmModal } = useConfirm();
  const queryClient = useQueryClient();

  // ✅ Single API Call (role / status)
  const handleUpdate = async (
    userId: string,
    payload: { role?: UserRole; isActive?: boolean }
  ) => {
    const res = await updateUser(userId, payload);

    if (res?.success) {
      toast.success("Updated ✅");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } else {
      toast.error("Update failed ❌");
    }
  };

  // ✅ Toggle Active
  const handleToggleActive = async (user: User) => {
    const ok = await confirm({
      title: "Change Status",
      message: "Are you sure?",
      confirmText: "Yes",
      cancelText: "Cancel",
    });

    if (!ok) return;

    handleUpdate(user._id!.toString(), {
      isActive: !user.isActive,
    });
  };

  // ✅ Change Role
  const handleRoleChange = async (user: User, role: UserRole) => {
    handleUpdate(user._id!.toString(), { role });
  };

  // ✅ Columns
  const columns = [
    { header: "Name", accessor: "fullName" },
    { header: "Phone", accessor: "phone" },
    { header: "Role", accessor: "role" },
    { header: "Status", accessor: "status" },
  ];

  // ✅ Data (FundTable style)
  const data = users.map((user) => ({
    fullName: user.fullName,
    phone: user.phone,

    role:
      currentUser.role === "OWNER" ? (
        <select
          value={user.role}
          onChange={(e) =>
            handleRoleChange(user, e.target.value as UserRole)
          }
          className="border p-1 rounded"
        >
          {/* <option value="OWNER">OWNER</option> */}
          <option value="MANAGER">MANAGER</option>
          <option value="SALESMAN">SALESMAN</option>
          <option value="USER">USER</option>
        </select>
      ) : (
        <span>{user.role}</span>
      ),

    status:
      currentUser.role === "OWNER" ? (
        <button
          onClick={() => handleToggleActive(user)}
          className={`px-2 py-1 text-white rounded ${
            user.isActive ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </button>
      ) : (
        <span
          className={`px-2 py-1 rounded ${
            user.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
      ),
  }));

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">👤 Users</h2>

      <CustomTable columns={columns} data={data} />

      {ConfirmModal}
    </div>
  );
};

export default UserTable;


// owner select  hobe na and  oner  er role  desable  thakbe ...