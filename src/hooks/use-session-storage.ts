import { useState, useEffect, useCallback } from 'react';

// Generic hook for session storage
export function useSessionStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to sessionStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // Save to session storage
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove value from session storage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing sessionStorage value for key "${key}":`, error);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [key]);

  return [storedValue, setValue, removeValue] as const;
}

// Specific hook for menu view persistence
export interface MenuViewState {
  view: 'menu-list' | 'menu-detail';
  selectedMenuId: string | null;
}

export function useMenuViewStorage(pageKey: string) {
  const [viewState, setViewState, removeViewState] = useSessionStorage<MenuViewState>(`menu-view-state-${pageKey}`, {
    view: 'menu-list',
    selectedMenuId: null,
  });

  const setMenuListView = useCallback(() => {
    setViewState({
      view: 'menu-list',
      selectedMenuId: null,
    });
  }, [setViewState]);

  const setMenuDetailView = useCallback((menuId: string) => {
    setViewState({
      view: 'menu-detail',
      selectedMenuId: menuId,
    });
  }, [setViewState]);

  const clearViewState = useCallback(() => {
    removeViewState();
  }, [removeViewState]);

  // Debug function to log current view state
  const debugViewState = useCallback(() => {
    console.log(`[${pageKey}] View State:`, viewState);
  }, [viewState, pageKey]);

  return {
    viewState,
    setMenuListView,
    setMenuDetailView,
    clearViewState,
    debugViewState,
  };
}

// Utility function to clear all menu view states
export function clearAllMenuViewStates() {
  if (typeof window !== 'undefined') {
    // Clear all menu view state keys
    const keysToRemove = [];
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const key = window.sessionStorage.key(i);
      if (key && key.startsWith('menu-view-state-')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => window.sessionStorage.removeItem(key));
  }
} 