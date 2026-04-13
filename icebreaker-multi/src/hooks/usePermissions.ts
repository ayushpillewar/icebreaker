import { useCallback, useEffect, useState } from 'react';
import { useServices } from '../container/ServiceProvider';

type PermissionState = 'unknown' | 'granted' | 'denied';

/** SRP: only tracks and requests Bluetooth permissions. */
export function usePermissions() {
  const { permissionService } = useServices();
  const [state, setState] = useState<PermissionState>('unknown');

  useEffect(() => {
    permissionService.hasBluetoothPermissions().then((ok) => {
      setState(ok ? 'granted' : 'denied');
    });
  }, [permissionService]);

  const request = useCallback(async () => {
    const granted = await permissionService.requestBluetoothPermissions();
    setState(granted ? 'granted' : 'denied');
    return granted;
  }, [permissionService]);

  return { permissionState: state, requestPermissions: request };
}
