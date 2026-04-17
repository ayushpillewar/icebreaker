import type { IScanner } from '../interfaces/IScanner';
import type { IAdvertiser } from '../interfaces/IAdvertiser';
import type { IConnector } from '../interfaces/IConnector';
import type { IMessageSender, IMessageReceiver } from '../interfaces/IMessaging';
import type { IUserRepository } from '../interfaces/IUserRepository';
import type { IPermissionService } from '../interfaces/IPermissionService';

import { MockScanner } from '../services/mock/MockScanner';
import { MockAdvertiser } from '../services/mock/MockAdvertiser';
import { MockConnector } from '../services/mock/MockConnector';
import { MockMessaging } from '../services/mock/MockMessaging';
import { AsyncStorageUserRepository } from '../services/AsyncStorageUserRepository';
import { NativePermissionService } from '../services/NativePermissionService';

/**
 * DIP: All consumers receive abstractions (interfaces), never concrete types.
 *
 * OCP: To switch to real BLE, replace the mock registrations below with
 *      BleScanner / BleAdvertiser / BleConnector / BleMessaging — zero
 *      changes needed in any hook, component, or screen.
 *
 * The container is a singleton; call ServiceContainer.getInstance().
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

  private constructor(useMock: boolean) {
    if (useMock) {
      const messaging = new MockMessaging();
      this.scanner = new MockScanner();
      this.advertiser = new MockAdvertiser();
      this.connector = new MockConnector();
      this.messageSender = messaging;
      this.messageReceiver = messaging;
    } else {
      // ── Real BLE wiring ────────────────────────────────────────────────
      // Requires a development build (not Expo Go).
      // Uncomment and import BleManager + concrete services when ready.
      
      const { BleManager } = require('react-native-ble-plx');
      const { BleScanner } = require('../services/ble/BleScanner');
      const { BleAdvertiser } = require('../services/ble/BleAdvertiser');
      const { BleConnector } = require('../services/ble/BleConnector');
      const { BleMessaging } = require('../services/ble/BleMessaging');
      
      const bleManager = new BleManager();
      const connector = new BleConnector(bleManager);
      const messaging = new BleMessaging(connector);
      this.scanner = new BleScanner(bleManager);
      this.advertiser = new BleAdvertiser();
      this.connector = connector;
      this.messageSender = messaging;
      this.messageReceiver = messaging;
      // ──────────────────────────────────────────────────────────────────
     // throw new Error('Real BLE mode: uncomment BLE wiring in ServiceContainer.ts');
    }

    this.userRepository = new AsyncStorageUserRepository();
    this.permissionService = new NativePermissionService();
  }

  /**
   * @param useMock  Pass `false` on a dev build to engage real BLE services.
   */
  static getInstance(useMock = true): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer(useMock);
    }
    return ServiceContainer.instance;
  }

  /** Reset the singleton — useful for testing */
  static reset(): void {
    ServiceContainer.instance = null;
  }
}
