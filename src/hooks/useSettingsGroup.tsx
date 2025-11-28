import { useState, useCallback } from 'react';

export const useSettingsGroup = () => {
  const [groupLoading, setGroupLoading] = useState<Record<string, boolean>>({});
  const [itemLoading, setItemLoading] = useState<Record<string, boolean>>({});

  const setItemLoadingState = useCallback((itemId: string, loading: boolean) => {
    setItemLoading(prev => ({ ...prev, [itemId]: loading }));
  }, []);

  const getGroupLoading = useCallback((groupName: string) => {
    return groupLoading[groupName] || false;
  }, [groupLoading]);

  const getItemLoading = useCallback((itemId: string) => {
    return itemLoading[itemId] || false;
  }, [itemLoading]);

  return {
    groupLoading,
    itemLoading,
    setItemLoadingState,
    getGroupLoading,
    getItemLoading,
  };
};

