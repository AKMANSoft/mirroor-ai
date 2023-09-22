import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCookie(name: string) {
  const cookieString = document.cookie;
  const cookies = cookieString.split('; ');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split('=');
    const cookieName = cookie[0];
    const cookieValue = cookie[1];

    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }

  return null; // Cookie with the given name not found
}

export function formatMinutes(minutes: number) {
  return minutes < 10 ? `0${minutes}` : minutes;
}

export function formatSeconds(seconds: number) {
  return seconds < 10 ? `0${seconds}` : seconds;
}