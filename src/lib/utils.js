import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

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
  // Only show toast for network-related errors or if it's not a GET request
  const isGetRequest = error?.config?.method?.toLowerCase() === 'get';
  // For GET requests that aren't network errors, don't show any toast
  if (isGetRequest) {
    return;
  }
  // Check if the error is a timeout error
  if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
    return toast.error("Request timed out. Please try again later.");
  }
  if (
    error.code === "ERR_NETWORK" ||
    error.code === "ERR_INTERNET_DISCONNECTED"
  ) {
    return toast.error(
      "Network error", { description: "Please check your internet connection and try again." }
    );
  }
  return toast.error(customMsg);
}
