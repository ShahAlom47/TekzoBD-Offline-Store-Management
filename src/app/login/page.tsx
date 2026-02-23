"use client";

import { useForm } from "react-hook-form";
import PrimaryButton from "@/Components/CommonComponents/PrimaryButton";
import { toast, Toaster } from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/allApiRequest/userRequest/userRequest";
import { useUser } from "@/context/AuthContext";

type LoginFormInputs = {
  phone: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();

  const {
    register,
    handleSubmit,
  
    formState: { errors },
  } = useForm<LoginFormInputs>({  defaultValues: {
      phone: "01773133145",
      password: "123456789",
    },});

const onSubmit = async (data: LoginFormInputs) => {
setLoading(true);

try {
  const res = await loginUser(data.phone, data.password);

  if (!res.success) {
    throw new Error(res.message || "Login failed");
  }

  // 🔥 Important
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // setUser((res.data as any).user);

    toast.success("Login successful!");
    router.push("/dashboard");

  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Something went wrong!";
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-red-200 px-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-white/80 shadow-2xl rounded-2xl p-8 space-y-6">
        
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
        <form
          className="space-y-5 text-black"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone 
            </label>
            <input
              {...register("phone", { required: "Phone is required" })}
              type="text"
              placeholder="Enter your phone"
              className="w-full rounded-xl border border-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              {...register("password", { required: "Password is required" })}
              type="text"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <PrimaryButton type="submit" loading={loading}>
            Login
          </PrimaryButton>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pt-4 border-t">
          © {new Date().getFullYear()} TekzoBd
        </div>
      </div>
    </div>
  );
}