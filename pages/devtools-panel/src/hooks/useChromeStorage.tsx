// src/hooks/useChromeStorage.tsx
import { useState, useEffect } from 'react';

// Type definitions for clarity
type ChromeStorageData = {
  customDomain: string;
  persistEvents: boolean;
  theme: string;
  eventList: string[];
};

const defaultStorageData: ChromeStorageData = {
  customDomain: 'fun.com',
  persistEvents: false,
  theme: 'light', // or whatever default
  eventList: [],
};

export const useChromeStorage = () => {
  const [storageData, setStorageData] = useState<ChromeStorageData>(defaultStorageData);

  // Load data from chrome.storage.local when the hook mounts
  useEffect(() => {
    chrome.storage.local.get(['customDomain', 'persistEvents', 'theme', 'eventList'], result => {
      setStorageData({
        customDomain: result.customDomain || '',
        persistEvents: result.persistEvents ?? false,
        theme: result.theme || 'light',
        eventList: result.eventList || [],
      });
    });
  }, []);

  // Setters for each field
  const setCustomDomain = (domain: string) => {
    console.log('Setting custom domain:', domain);
    chrome.storage.local.set({ customDomain: domain }, () => {
      setStorageData(prev => ({ ...prev, customDomain: domain }));
    });
  };

  const setPersistEvents = (persist: boolean) => {
    chrome.storage.local.set({ persistEvents: persist }, () => {
      setStorageData(prev => ({ ...prev, persistEvents: persist }));
    });
  };

  const setTheme = (theme: string) => {
    chrome.storage.local.set({ theme }, () => {
      setStorageData(prev => ({ ...prev, theme }));
    });
  };

  const setEventList = (events: string[]) => {
    chrome.storage.local.set({ eventList: events }, () => {
      setStorageData(prev => ({ ...prev, eventList: events }));
    });
  };

  return {
    storageData,
    setCustomDomain,
    setPersistEvents,
    setTheme,
    setEventList,
  };
};
