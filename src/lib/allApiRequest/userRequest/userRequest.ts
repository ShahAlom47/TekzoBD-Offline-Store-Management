

import { request } from "../apiRequests";

export const loginUser = async (phone: string, password: string) => {
  return request("POST", "/user/login", { phone, password });
}

export const getUserInfo = async (phone: string) => {
  try {
    const res = await fetch(`/api/user/user-info/${phone}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // 🔥 always fresh data
    });
    console.log(res)

    if (!res.ok) {
      throw new Error("Failed to fetch user info");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("getUserInfo error:", error);
    throw error;
  }
};



