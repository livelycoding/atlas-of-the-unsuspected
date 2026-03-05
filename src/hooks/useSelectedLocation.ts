import { useState, useCallback } from 'react';

export function useSelectedLocation() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const select = useCallback((id: string) => {
    setSelectedId(prev => prev === id ? null : id);
  }, []);

  const clear = useCallback(() => {
    setSelectedId(null);
  }, []);

  return { selectedId, select, clear };
}
