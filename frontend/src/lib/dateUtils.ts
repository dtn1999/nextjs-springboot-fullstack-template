import {
  addDays,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
  isBefore,
  isSameMonth,
  isSameYear,
  isThisWeek,
  isYesterday,
  parseISO,
} from "date-fns";
import { ListingAvailability } from "@/server/types/domain";

export function formatDateRange(
  startDate?: string | null,
  endDate?: string | null
): string | null {
  if (!startDate || !endDate) return null;

  const start = parseISO(startDate);
  const end = parseISO(endDate);

  if (isSameMonth(start, end)) {
    return `${format(start, "MMMM d")} - ${format(end, "d")}`;
  }

  if (isSameYear(start, end)) {
    return `${format(start, "MMMM d")} - ${format(end, "MMMM d")}`;
  }

  return `${format(start, "MMMM d, yyyy")} - ${format(end, "MMMM d, yyyy")}`;
}

export function getDateDifferenceInDays(
  startDate: Date | null,
  endDate: Date | null
): number {
  if (!startDate || !endDate) return 0;

  return differenceInDays(endDate, startDate);
}

export function availabilitiesToDates(
  availabilities: ListingAvailability[]
): Date[] {
  const response: Date[] = [];

  for (const availability of availabilities) {
    const start = parseISO(availability.from);
    const end = parseISO(availability.to);

    let currentDate = start;
    console.log("Current ", currentDate);
    while (isBefore(currentDate, end)) {
      response.push(currentDate);
      currentDate = addDays(currentDate, 1);
      console.log("Current ", currentDate);
    }
  }

  return response;
}

export function formatBookingDetailsDate(
  dateStr: string | null | undefined
): string | null | undefined {
  if (!dateStr) {
    return dateStr;
  }
  const date = parseISO(dateStr);
  return format(date, "EEE dd MMMM, yyyy");
}

export function formatChatDate(dateStr: string): string {
  if (!dateStr) {
    throw new Error("Invalid date");
  }

  const date = parseISO(dateStr);

  const now = new Date();

  if (differenceInMinutes(now, date) < 1) {
    return "now";
  } else if (differenceInMinutes(now, date) < 60) {
    return `${differenceInMinutes(now, date)} mins ago`;
  } else if (differenceInHours(now, date) < 24) {
    return `${differenceInHours(now, date)} hours ago`;
  } else if (isYesterday(date)) {
    return "yesterday";
  } else if (isThisWeek(date)) {
    return format(date, "EEEE");
  } else {
    return format(date, "dd/MM/yyyy");
  }
}
