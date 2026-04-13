import React from "react";
import { User } from "@/Interfaces/userInterfaces";
import { CustomTable } from "../CommonComponents/CustomTable";

interface Props {
  users: User[];
}

const UserTable = ({ users }: Props) => {
  const columns = [
    {
      header: "Name",
      accessor: "fullName",
    },
    {
      header: "Phone",
      accessor: "phone",
    },
    {
      header: "Role",
      accessor: "role",
    },
  ];

  return (
    <div className="bg-white shadow rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">All Users</h2>

      <CustomTable columns={columns} data={users} />
    </div>
  );
};

export default UserTable;