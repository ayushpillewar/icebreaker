/** Custom UART-style BLE service for IceBreaker */
export const BLE_SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
export const BLE_TX_CHAR_UUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E'; // write to peer
export const BLE_RX_CHAR_UUID = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E'; // notify from peer

/** Company identifier used in manufacturer-specific advertisement data */
export const BLE_COMPANY_ID = 0x00e0;

export const PEER_LOST_TIMEOUT_MS = 30_000;
export const SCAN_RESPONSE_TIMEOUT_MS = 10_000;
