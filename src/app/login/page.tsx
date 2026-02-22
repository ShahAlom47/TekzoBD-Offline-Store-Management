"use client";

import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6">
        
        {/* Store Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-black">
            TekzoBd
          </h1>
          <p className="text-gray-500 text-sm">
            Offline Shop Management Login
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-5">
          
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone / Username
            </label>
            <input
              type="text"
              placeholder="Enter your phone"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pt-4 border-t">
          © {new Date().getFullYear()} TekzoBd
        </div>

      </div>
    </div>
  );
}