"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type User = {
  _id: string;
  fullName: string;
  phone: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const pathname = usePathname();


  useEffect(() => {

    const fetchUser = async () => {

      try {

        const res = await fetch("/api/user/me");

        const data = await res.json();

        if (data.success) {

          setUser(data.user);

        } else {

          setUser(null);

        }

      } catch {

        setUser(null);

      } finally {

        setLoading(false);

      }

    };

    fetchUser();

  }, []);


  // ✅ redirect logic
  useEffect(() => {

    if (!loading && !user && pathname.startsWith("/dashboard")) {

      router.push("/");

    }

  }, [user, loading, pathname, router]);


  const logout = async () => {

    await fetch("/api/user/logout", { method: "POST" });

    setUser(null);

    router.push("/");

  };


  return (

    <AuthContext.Provider value={{ user, loading, setUser, logout }}>

      {children}

    </AuthContext.Provider>

  );

};


export const useUser = () => {

  const context = useContext(AuthContext);

  if (!context) throw new Error("useUser must be used inside AuthProvider");

  return context;

};