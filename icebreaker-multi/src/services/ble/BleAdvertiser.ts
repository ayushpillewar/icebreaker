import { Platform } from 'react-native';
import BLEAdvertiser from 'react-native-ble-advertiser';
import type { IAdvertiser } from '../../interfaces/IAdvertiser';
import type { User } from '../../models/User';
import { BLE_SERVICE_UUID, BLE_COMPANY_ID } from './constants';

/**
 * SRP: BLE peripheral advertising using react-native-ble-advertiser.
 * Encodes the user's display name in manufacturer-specific data so scanners
 * can display the IceBreaker name instead of the system Bluetooth device name.
 *
 * Android: fully functional via react-native-ble-advertiser.
 * iOS: not yet supported (requires a CBPeripheralManager native module).
 */
export class BleAdvertiser implements IAdvertiser {
  private _isAdvertising = false;

  get isAdvertising(): boolean {
    return this._isAdvertising;
  }

  async startAdvertising(user: User): Promise<void> {
    if (Platform.OS !== 'android') {
      // iOS peripheral advertising requires a CBPeripheralManager native module
      // which is not provided by react-native-ble-advertiser.
      console.warn('[BleAdvertiser] Advertising is only supported on Android for now.');
      return;
    }

    if (this._isAdvertising) {
      await BLEAdvertiser.stopBroadcast().catch(() => {});
      this._isAdvertising = false;
    }

    BLEAdvertiser.setCompanyId(BLE_COMPANY_ID);

    // Encode the user's display name (up to 20 bytes) as manufacturer payload.
    // BleScanner reads bytes[2..] after stripping the 2-byte company ID prefix.
    const nameBytes = Array.from(Buffer.from(user.name.slice(0, 20), 'utf8'));

    await BLEAdvertiser.broadcast(BLE_SERVICE_UUID, nameBytes, {
      advertiseMode: BLEAdvertiser.ADVERTISE_MODE_LOW_LATENCY,
      txPowerLevel: BLEAdvertiser.ADVERTISE_TX_POWER_HIGH,
      connectable: true,
      includeDeviceName: false,
      includeTxPowerLevel: false,
    });

    this._isAdvertising = true;
  }

  stopAdvertising(): void {
    if (Platform.OS === 'android' && this._isAdvertising) {
      BLEAdvertiser.stopBroadcast().catch(console.error);
    }
    this._isAdvertising = false;
  }
}
