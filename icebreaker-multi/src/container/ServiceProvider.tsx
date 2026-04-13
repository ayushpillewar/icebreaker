import React, { createContext, useContext, type ReactNode } from 'react';
import { ServiceContainer } from './ServiceContainer';

const ServiceContext = createContext<ServiceContainer | null>(null);

interface Props {
  children: ReactNode;
  useMock?: boolean;
}

/**
 * Wraps the app and provides the DI container to all children via context.
 * Consuming components call useServices() — they never import concrete classes.
 */
export function ServiceProvider({ children, useMock = true }: Props) {
  const container = ServiceContainer.getInstance(useMock);
  return <ServiceContext.Provider value={container}>{children}</ServiceContext.Provider>;
}

export function useServices(): ServiceContainer {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error('useServices must be used inside <ServiceProvider>');
  return ctx;
}
