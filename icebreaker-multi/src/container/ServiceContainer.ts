import type { IScanner } from '../interfaces/IScanner';
import type { IAdvertiser } from '../interfaces/IAdvertiser';
import type { IConnector } from '../interfaces/IConnector';
import type { IMessageSender, IMessageReceiver } from '../interfaces/IMessaging';
import type { IUserRepository } from '../interfaces/IUserRepository';
import type { IPermissionService } from '../interfaces/IPermissionService';

import { BleManager } from 'react-native-ble-plx';
import { BleScanner } from '../services/ble/BleScanner';
import { BleAdvertiser } from '../services/ble/BleAdvertiser';
import { BleConnector } from '../services/ble/BleConnector';
import { BleMessaging } from '../services/ble/BleMessaging';
import { AsyncStorageUserRepository } from '../services/AsyncStorageUserRepository';
import { NativePermissionService } from '../services/NativePermissionService';

/**
 * DIP: All consumers receive abstractions (interfaces), never concrete types.
 * Singleton that wires up the real BLE services.
 */
export class ServiceContainer {
  private static instance: ServiceContainer | null = null;

  readonly scanner: IScanner;
  readonly advertiser: IAdvertiser;
  readonly connector: IConnector;
  readonly messageSender: IMessageSender;
  readonly messageReceiver: IMessageReceiver;
  readonly userRepository: IUserRepository;
  readonly permissionService: IPermissionService;

  private constructor() {
    const bleManager = new BleManager();
    const connector = new BleConnector(bleManager);
    const messaging = new BleMessaging(connector);

    this.scanner = new BleScanner(bleManager);
    this.advertiser = new BleAdvertiser();
    this.connector = connector;
    this.messageSender = messaging;
    this.messageReceiver = messaging;
    this.userRepository = new AsyncStorageUserRepository();
    this.permissionService = new NativePermissionService();
  }

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  /** Reset the singleton — useful for testing */
  static reset(): void {
    ServiceContainer.instance = null;
  }
}
