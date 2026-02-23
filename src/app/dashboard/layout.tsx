"use client"
import { useUser } from "@/context/AuthContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useUser();
  return (
    <div className="flex">
          {user && (
      <>
        <p>{user.fullName} ({user.role})</p>
        <button onClick={logout}>Logout</button>
      </>
    )}
      <aside className="w-64">Sidebar</aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}