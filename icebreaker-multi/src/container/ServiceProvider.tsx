import React, { createContext, useContext, type ReactNode } from 'react';
import { ServiceContainer } from './ServiceContainer';

const ServiceContext = createContext<ServiceContainer | null>(null);

/**
 * Wraps the app and provides the DI container to all children via context.
 * Consuming components call useServices() — they never import concrete classes.
 */
export function ServiceProvider({ children }: { children: ReactNode }) {
  const container = ServiceContainer.getInstance();
  return <ServiceContext.Provider value={container}>{children}</ServiceContext.Provider>;
}

export function useServices(): ServiceContainer {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error('useServices must be used inside <ServiceProvider>');
  return ctx;
}
