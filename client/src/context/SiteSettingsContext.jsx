import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { siteSettingsService } from '../services/api';

const SiteSettingsContext = createContext();

export const SiteSettingsProvider = ({ children }) => {
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSiteStatus = useCallback(async () => {
    try {
      const response = await siteSettingsService.getStatus();
      if (response && response.data) {
        setIsLive(Boolean(response.data.isLive));
      }
      setError(null);
    } catch (err) {
      console.warn('[SiteSettings] Failed to fetch site status, using default:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSiteStatus();
  }, [fetchSiteStatus]);

  const toggleLive = async () => {
    try {
      const response = await siteSettingsService.toggleStatus();
      if (response && response.data) {
        setIsLive(Boolean(response.data.isLive));
        return response.data.isLive;
      }
    } catch (err) {
      console.error('[SiteSettings] Failed to toggle live status:', err);
      throw err;
    }
  };

  const updateLive = async (status) => {
    try {
      const response = await siteSettingsService.updateStatus(status);
      if (response && response.data) {
        setIsLive(Boolean(response.data.isLive));
        return response.data.isLive;
      }
    } catch (err) {
      console.error('[SiteSettings] Failed to update live status:', err);
      throw err;
    }
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        isLive,
        loading,
        error,
        refreshSiteStatus: fetchSiteStatus,
        toggleLive,
        updateLive,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
