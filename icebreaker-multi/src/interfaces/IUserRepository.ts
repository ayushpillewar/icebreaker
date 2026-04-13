import type { User } from '../models/User';

/** ISP: only persistence of the local user profile */
export interface IUserRepository {
  getUser(): Promise<User | null>;
  saveUser(user: User): Promise<void>;
  clearUser(): Promise<void>;
}
