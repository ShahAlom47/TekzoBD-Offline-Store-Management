"use client";

import { useForm } from "react-hook-form";
import PrimaryButton from "@/Components/CommonComponents/PrimaryButton";
import { toast, Toaster } from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/allApiRequest/userRequest/userRequest";

export type RegisterFormInputs = {
  fullName: string;
  phone: string;
  password: string;
};

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const onSubmit = async (data: RegisterFormInputs) => {
    setLoading(true);

    try {
      const res = await createUser(data);


      if (!res.success) {
        throw new Error(res.message || "Register failed");
      }

      toast.success("Account created successfully!");

      router.push("/login"); // redirect to login
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-blue-200 px-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-md bg-white/80 shadow-2xl rounded-2xl p-8 space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-black">Create Account</h1>
          <p className="text-gray-500 text-sm">Register for your POS system</p>
        </div>

        {/* Form */}
        <form
          className="space-y-5 text-black"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              {...register("fullName", { required: "Name is required" })}
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-xl border px-4 py-2"
            />
            {errors.fullName && (
              <p className="text-red-600 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              {...register("phone", { required: "Phone is required" })}
              type="text"
              placeholder="Enter phone"
              className="w-full rounded-xl border px-4 py-2"
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
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
              type="password"
              placeholder="Enter password"
              className="w-full rounded-xl border px-4 py-2"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <PrimaryButton type="submit" loading={loading}>
            Register
          </PrimaryButton>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          Already have an account? 
          <span
            onClick={() => router.push("/")}
            className="text-blue-600 cursor-pointer ml-1"
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
}
