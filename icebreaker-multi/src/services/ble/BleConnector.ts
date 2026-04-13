import { BleManager, Device, Subscription } from 'react-native-ble-plx';
import type { IConnector } from '../../interfaces/IConnector';

/**
 * SRP: only manages GATT connection lifecycle.
 * DIP: BleManager injected; callers depend on IConnector.
 */
export class BleConnector implements IConnector {
  private devices = new Map<string, Device>();
  private dcSubscriptions = new Map<string, Subscription>();

  constructor(private readonly bleManager: BleManager) {}

  async connect(peerId: string): Promise<void> {
    const device = await this.bleManager.connectToDevice(peerId);
    await device.discoverAllServicesAndCharacteristics();
    this.devices.set(peerId, device);

    const sub = device.onDisconnected((_error, d) => {
      if (d) {
        this.devices.delete(d.id);
        this.dcSubscriptions.get(d.id)?.remove();
        this.dcSubscriptions.delete(d.id);
      }
    });
    this.dcSubscriptions.set(peerId, sub);
  }

  disconnect(peerId: string): void {
    this.bleManager.cancelDeviceConnection(peerId);
    this.devices.delete(peerId);
    this.dcSubscriptions.get(peerId)?.remove();
    this.dcSubscriptions.delete(peerId);
  }

  isConnected(peerId: string): boolean {
    return this.devices.has(peerId);
  }

  /** Package-internal helper consumed by BleMessaging */
  getDevice(peerId: string): Device | undefined {
    return this.devices.get(peerId);
  }
}
