import type { IAdvertiser } from '../../interfaces/IAdvertiser';
import type { User } from '../../models/User';

/**
 * SRP: BLE peripheral advertising.
 *
 * NOTE: react-native-ble-plx is a central-only library. Full peripheral/advertising
 *       mode requires a native module (e.g. react-native-ble-advertiser for Android,
 *       or a custom Swift CBPeripheralManager for iOS).
 *
 *       This stub is provided so the architecture compiles end-to-end; swap in
 *       a real native implementation without changing any callers (OCP).
 */
export class BleAdvertiser implements IAdvertiser {
  private _isAdvertising = false;

  get isAdvertising(): boolean {
    return this._isAdvertising;
  }

  async startAdvertising(user: User): Promise<void> {
    await Promise.resolve();
    this._isAdvertising = true;
    console.warn(
      `[BleAdvertiser] Peripheral advertising for "${user.name}" requires a native module.` +
        ' Use MockAdvertiser in development or integrate react-native-ble-advertiser.',
    );
  }

  stopAdvertising(): void {
    this._isAdvertising = false;
  }
}
