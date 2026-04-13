import { User } from "@/Interfaces/userInterfaces";
import { useState } from "react";

export function ProfileCard({ currentUser }: { currentUser: User }) {
  const [editing, setEditing] = useState<"none" | "name" | "password">("none");

  const [name, setName] = useState(currentUser?.fullName || "");
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // 👉 Name Save
  const handleNameSave = async () => {
    // TODO: API call
    // await updateName({ userId: currentUser._id, fullName: name });

    setEditing("none");
  };

  // 👉 Password Save
  const handlePasswordSave = async () => {
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      alert("Old & New password required");
      return;
    }

    // TODO: API call
    // await updatePassword({
    //   userId: currentUser._id,
    //   oldPassword: passwordForm.oldPassword,
    //   newPassword: passwordForm.newPassword,
    // });

    setPasswordForm({ oldPassword: "", newPassword: "" });
    setEditing("none");
  };

  return (
    <div className="bg-white shadow rounded-2xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Profile</h2>
      </div>

      {/* Name Section */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <p><strong>Name:</strong> {currentUser?.fullName}</p>

          {editing !== "name" && (
            <button
              onClick={() => {
                setEditing("name");
                setName(currentUser?.fullName || "");
              }}
              className="text-sm bg-black text-white px-3 py-1 rounded"
            >
              Edit
            </button>
          )}
        </div>

        {editing === "name" && (
          <div className="space-y-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <div className="flex gap-2">
              <button
                onClick={handleNameSave}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditing("none")}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Password Section */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <p><strong>Password:</strong> ********</p>

          {editing !== "password" && (
            <button
              onClick={() => setEditing("password")}
              className="text-sm bg-black text-white px-3 py-1 rounded"
            >
              Change
            </button>
          )}
        </div>

        {editing === "password" && (
          <div className="space-y-2">
            <input
              type="password"
              placeholder="Old Password"
              value={passwordForm.oldPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  oldPassword: e.target.value,
                })
              }
              className="border p-2 rounded w-full"
            />

            <input
              type="password"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
              className="border p-2 rounded w-full"
            />

            <div className="flex gap-2">
              <button
                onClick={handlePasswordSave}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Update
              </button>
              <button
                onClick={() => setEditing("none")}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Role */}
      <p className="text-sm text-gray-600">
        <strong>Role:</strong> {currentUser?.role}
      </p>
    </div>
  );
}