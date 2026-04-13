import type { User } from '../models/User';

/** ISP: only advertising responsibility — no scanning, no messaging */
export interface IAdvertiser {
  startAdvertising(user: User): Promise<void>;
  stopAdvertising(): void;
  readonly isAdvertising: boolean;
}
