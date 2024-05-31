import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import humanizeList from "humanize-list";
import { formatValue } from "react-currency-input-field";

export const humanize = (arr) => {
  return humanizeList(arr, { skipConjunction: true });
};

export const getTicketCost = (passenger, trip_type) => {
  return formatValue({
    value: String(
      Number(passenger) * (trip_type === "One-Way Trip" ? 8500 : 17000)
    ),
  });
};

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
