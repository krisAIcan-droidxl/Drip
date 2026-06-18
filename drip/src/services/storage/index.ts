import AsyncStorage from '@react-native-async-storage/async-storage';

export type StorageKey =
  | 'onboarding.completed'
  | 'drips.saved'
  | 'drips.history'
  | 'drips.streak'
  | 'drips.daily'
  | 'user.preferences';

export async function getJson<T>(key: StorageKey, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function setJson<T>(key: StorageKey, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeValue(key: StorageKey): Promise<void> {
  await AsyncStorage.removeItem(key);
}
