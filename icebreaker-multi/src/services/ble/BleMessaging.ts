import { Subscription } from 'react-native-ble-plx';
import type { IMessageSender, IMessageReceiver, MessageReceivedCallback } from '../../interfaces/IMessaging';
import type { Message } from '../../models/Message';
import { BLE_SERVICE_UUID, BLE_TX_CHAR_UUID, BLE_RX_CHAR_UUID } from './constants';
import type { BleConnector } from './BleConnector';

const uid = (): string =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

const toBase64 = (text: string): string => Buffer.from(text, 'utf8').toString('base64');
const fromBase64 = (b64: string): string => Buffer.from(b64, 'base64').toString('utf8');

/**
 * SRP: only handles GATT read/write/notify for messaging.
 * DIP: depends on BleConnector (injected) and IMessageSender/IMessageReceiver interfaces.
 *
 * Architecture note: peer devices need a GATT server (peripheral manager) to RECEIVE
 * messages via notifications. This central-side implementation writes to the TX
 * characteristic of a connected peripheral and monitors its RX characteristic.
 */
export class BleMessaging implements IMessageSender, IMessageReceiver {
  private callbacks: MessageReceivedCallback[] = [];
  private monitorSubscriptions = new Map<string, Subscription>();

  constructor(private readonly connector: BleConnector) {}

  async sendMessage(peerId: string, text: string): Promise<void> {
    const device = this.connector.getDevice(peerId);
    if (!device) throw new Error(`[BleMessaging] Not connected to peer ${peerId}`);

    const payload = JSON.stringify({ id: uid(), text, ts: Date.now() });
    await device.writeCharacteristicWithResponseForService(
      BLE_SERVICE_UUID,
      BLE_TX_CHAR_UUID,
      toBase64(payload),
    );
  }

  onMessageReceived(callback: MessageReceivedCallback): () => void {
    this.callbacks = [...this.callbacks, callback];
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }

  /** Call after connecting to a peer to start listening for incoming messages */
  subscribeToIncoming(peerId: string): void {
    const device = this.connector.getDevice(peerId);
    if (!device || this.monitorSubscriptions.has(peerId)) return;

    const sub = device.monitorCharacteristicForService(
      BLE_SERVICE_UUID,
      BLE_RX_CHAR_UUID,
      (error, characteristic) => {
        if (error || !characteristic?.value) return;
        try {
          const raw = JSON.parse(fromBase64(characteristic.value)) as {
            id: string;
            text: string;
            ts: number;
          };
          const message: Message = {
            id: raw.id,
            peerId,
            text: raw.text,
            direction: 'received',
            timestamp: new Date(raw.ts),
          };
          this.callbacks.forEach((cb) => cb(message));
        } catch {
          // malformed payload — ignored
        }
      },
    );
    this.monitorSubscriptions.set(peerId, sub);
  }

  unsubscribeFromIncoming(peerId: string): void {
    this.monitorSubscriptions.get(peerId)?.remove();
    this.monitorSubscriptions.delete(peerId);
  }
}
