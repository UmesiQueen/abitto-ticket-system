import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import humanizeList from "humanize-list";

export const humanize = (arr) => {
  return humanizeList(arr, { skipConjunction: true });
};
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
