"use client"; 

import { useEffect, useState } from 'react';

export function useClient(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []); 

  return isClient;
}