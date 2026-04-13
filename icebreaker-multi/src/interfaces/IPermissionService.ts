/** ISP: only Bluetooth permission management */
export interface IPermissionService {
  requestBluetoothPermissions(): Promise<boolean>;
  hasBluetoothPermissions(): Promise<boolean>;
}
