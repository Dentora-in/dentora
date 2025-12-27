import { toastService } from "./toast";

const isBrowser = typeof window !== "undefined";

const serialize = <T>(value: T): string => {
  try {
    return JSON.stringify(value);
  } catch {
    throw new Error("Serialization failed");
  }
};

const deserialize = <T>(value: string): T | null => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const setItem = <T>(key: string, value: T): boolean => {
  if (!isBrowser) return false;

  try {
    const serialized = serialize(value);
    localStorage.setItem(`Dentora@${key}`, serialized);
    return true;
  } catch (error) {
    console.error(`[localStorage:setItem] ${key}`, error);

    // Storage quota / private mode / disabled storage
    toastService.error(`Unable to save data. Please try again.`);

    return false;
  }
};

export const getItem = <T>(key: string): T | null => {
  if (!isBrowser) return null;

  try {
    const item = localStorage.getItem(`Dentora@${key}`);
    if (!item) return null;

    return deserialize<T>(item);
  } catch (error) {
    console.error(`[localStorage:getItem] ${key}`, error);
    return null;
  }
};

export const removeItem = (key: string): boolean => {
  if (!isBrowser) return false;

  try {
    localStorage.removeItem(`Dentora@${key}`);
    return true;
  } catch (error) {
    console.error(`[localStorage:removeItem] ${key}`, error);
    toastService.error(`Failed to remove saved data.`);
    return false;
  }
};

export const clearStorage = (): boolean => {
  if (!isBrowser) return false;

  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error(`[localStorage:clear]`, error);
    toastService.error(`Failed to clear storage.`);
    return false;
  }
};
