'use client';

import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from './index';

export function ReduxProviders({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof makeStore> | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
