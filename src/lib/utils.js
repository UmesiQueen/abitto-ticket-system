import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import humanizeList from "humanize-list";
import { toast } from "sonner";

export const humanize = (arr) => {
  return humanizeList(arr, { skipConjunction: true });
};

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const isValidUrl = (urlString) => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
    "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

export const customError = (error, customMsg) => {
  if (
    error.code !== "ERR_NETWORK" ||
    error.code !== "ERR_INTERNET_DISCONNECTED" ||
    error.code !== "ECONNABORTED"
  ) { toast.error(customMsg); }
}
