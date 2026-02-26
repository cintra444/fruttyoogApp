import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "@fruttyoog:user";
const LEGACY_TOKEN_KEY = "token";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  token: string;
  isAdmin: boolean;
};

export const loadStoredUser = async (): Promise<StoredUser | null> => {
  try {
    const raw = await AsyncStorage.getItem(USER_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw) as StoredUser;

    if (!data.id || !data.name || !data.email || !data.token) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
};

export const storeUser = async (user: StoredUser): Promise<void> => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  await AsyncStorage.setItem(LEGACY_TOKEN_KEY, user.token);
};

export const clearStoredUser = async (): Promise<void> => {
  await AsyncStorage.removeItem(USER_KEY);
  await AsyncStorage.removeItem(LEGACY_TOKEN_KEY);
};

export const getStoredToken = async (): Promise<string | null> => {
  const user = await loadStoredUser();
  if (user?.token) return user.token;

  const legacyToken = await AsyncStorage.getItem(LEGACY_TOKEN_KEY);
  return legacyToken ?? null;
};

export { USER_KEY };
