import { REDIRECT_PATH_PARAM } from "../constants";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateLinkWithRedirectTo(
  link: string,
  redirectTo?: string | null,
) {
  if (!redirectTo) {
    return link;
  }

  return `${link}?${REDIRECT_PATH_PARAM}=${redirectTo}`;
}
