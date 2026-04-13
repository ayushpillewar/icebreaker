import AsyncStorage from '@react-native-async-storage/async-storage';
import type { IUserRepository } from '../interfaces/IUserRepository';
import type { User } from '../models/User';

const USER_KEY = '@icebreaker/user';

/** SRP: only persists and retrieves the local user profile. */
export class AsyncStorageUserRepository implements IUserRepository {
  async getUser(): Promise<User | null> {
    const raw = await AsyncStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  }

  async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  async clearUser(): Promise<void> {
    await AsyncStorage.removeItem(USER_KEY);
  }
}
