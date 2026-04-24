declare module 'react-native-ble-advertiser' {
  interface BroadcastOptions {
    advertiseMode?: number;
    txPowerLevel?: number;
    connectable?: boolean;
    includeDeviceName?: boolean;
    includeTxPowerLevel?: boolean;
  }

  interface BLEAdvertiserModule {
    /** Advertise mode: balanced */
    ADVERTISE_MODE_BALANCED: number;
    /** Advertise mode: low latency (fast) */
    ADVERTISE_MODE_LOW_LATENCY: number;
    /** Advertise mode: low power */
    ADVERTISE_MODE_LOW_POWER: number;
    /** TX power: high */
    ADVERTISE_TX_POWER_HIGH: number;
    /** TX power: low */
    ADVERTISE_TX_POWER_LOW: number;
    /** TX power: medium */
    ADVERTISE_TX_POWER_MEDIUM: number;
    /** TX power: ultra low */
    ADVERTISE_TX_POWER_ULTRA_LOW: number;

    /**
     * Set the company identifier for manufacturer-specific data.
     * Must be called before broadcast().
     */
    setCompanyId(companyId: number): void;

    /**
     * Start BLE advertising.
     * @param uid        Service UUID to advertise
     * @param payload    Manufacturer-specific data bytes (after company ID)
     * @param options    Advertise options
     */
    broadcast(uid: string, payload: number[], options: BroadcastOptions): Promise<string>;

    /** Stop BLE advertising */
    stopBroadcast(): Promise<void>;
  }

  const BLEAdvertiser: BLEAdvertiserModule;
  export default BLEAdvertiser;
}
