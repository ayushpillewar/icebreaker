import type { IPermissionService } from '../../interfaces/IPermissionService';

/**
 * SRP: only responsible for simulating Bluetooth permissions.
 * Always returns granted — no real hardware needed in mock/dev mode.
 */
export class MockPermissionService implements IPermissionService {
  async hasBluetoothPermissions(): Promise<boolean> {
    return true;
  }

  async requestBluetoothPermissions(): Promise<boolean> {
    return true;
  }
}
