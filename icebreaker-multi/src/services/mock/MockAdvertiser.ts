import type { IAdvertiser } from '../../interfaces/IAdvertiser';
import type { User } from '../../models/User';

/**
 * SRP: only responsible for simulating BLE advertising.
 * LSP: substitutable wherever IAdvertiser is expected.
 */
export class MockAdvertiser implements IAdvertiser {
  private _isAdvertising = false;

  get isAdvertising(): boolean {
    return this._isAdvertising;
  }

  async startAdvertising(user: User): Promise<void> {
    await Promise.resolve(); // simulate async work
    this._isAdvertising = true;
    console.log(`[MockAdvertiser] Now advertising as "${user.name}"`);
  }

  stopAdvertising(): void {
    this._isAdvertising = false;
    console.log('[MockAdvertiser] Stopped advertising');
  }
}
