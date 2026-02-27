import numeral from "numeral";
import { DateTime } from "luxon";
import dayjs from "dayjs";

export function getAge(dob) {
  return dayjs().diff(dayjs(dob), "year");
}

export function formatRupiah(value) {
  return numeral(value).format("0,0.[.]00");
}

export function parseRupiah(value) {
  return numeral(value).value();
}

export function formatPercentage(value) {
  return numeral(value).format("0,0.[.]00%");
}

export function formatDate(date) {
  const options = { day: "numeric", month: "long", year: "numeric" };

  return new Date(date).toLocaleDateString("id-ID", options);
}

export function formatDateTime(date) {
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  return new Date(date).toLocaleDateString("id-ID", options);
}

export function formatToClientTimezone(date) {
  const originalDate = DateTime.fromISO(date, { zone: "utc" });

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return originalDate
    .setZone(timezone)
    .setLocale("id")
    .toFormat("dd LLLL yyyy, HH:mm");
}

export function ucfirst(string) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
}
export function calculateDays(start, end) {
  if (!start || !end) return 0;

  const startDate = new Date(start);
  const endDate = new Date(end);

  const diffTime = endDate - startDate;

  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
