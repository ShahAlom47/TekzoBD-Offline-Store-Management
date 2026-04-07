import { OverviewFilter } from "@/Interfaces/overviewInterface";
import { request } from "../apiRequests";

// 🔹 Params type for Overview API
interface ParamsType {
  filter: OverviewFilter;
  searchTrim?: string;
  status?: string;
}

export const getOverview = async (params: ParamsType) => {
  const { filter, searchTrim, status } = params;
  //  console.log(filter)

  const queryParams = new URLSearchParams();

  // 🔹 Convert filter to startDate / endDate
  const now = new Date();

  let startDate: string | undefined;
  let endDate: string | undefined;

 if (filter.type === "today") {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  startDate = start.toISOString();
  endDate = end.toISOString();
  console.log(start, end, 'today');
} else if (filter.type === "week") {
  const start = new Date();
  const day = start.getDay(); // Sunday = 0
  start.setDate(start.getDate() - day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  startDate = start.toISOString();
  endDate = end.toISOString();
  console.log(start, end, 'week');
} else if (filter.type === "month") {
  
    const start = new Date(filter.month + "-01");
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    startDate = start.toISOString();
    endDate = end.toISOString();
    console.log(start, end, 'month');
 
} else if (filter.type === "custom") {
  startDate = filter.startDate;
  endDate = filter.endDate;
  console.log(startDate, endDate, 'custom');
} else if (filter.type === "all") {
  startDate = undefined;
  endDate = undefined;
  console.log('All selected');
}

  if (startDate) queryParams.set("startDate", startDate);
  if (endDate) queryParams.set("endDate", endDate);
  if (searchTrim) queryParams.set("searchTrim", searchTrim);
  if (status) queryParams.set("status", status);

  const url = `/overview?${queryParams.toString()}`;

  return request("GET", url);
};