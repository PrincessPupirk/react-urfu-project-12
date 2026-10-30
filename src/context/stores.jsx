import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createAuthStore } from '../slices/auth.js';
import { createChannelsStore } from '../slices/channels.js';
import { createChatUiStore } from '../slices/chatUi.js';
import { createMessagesStore } from '../slices/messages.js';

export const StoresContext = createContext(null);

export const createStores = () => ({
  auth: createAuthStore(),
  channels: createChannelsStore(),
  messages: createMessagesStore(),
  chatUi: createChatUiStore(),
});

export const hydrateAuthFromStorage = (authStore) => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  if (token && username) {
    authStore.setState({ token, username });
  }
};

const useStores = () => {
  const stores = useContext(StoresContext);

  if (!stores) {
    throw new Error('StoresContext.Provider is missing');
  }

  return stores;
};

export const useAuth = (selector) => useStore(useStores().auth, selector);
export const useAuthStore = () => useStores().auth;

export const useChannels = (selector) => useStore(useStores().channels, selector);
export const useChannelsStore = () => useStores().channels;

export const useMessages = (selector) => useStore(useStores().messages, selector);
export const useMessagesStore = () => useStores().messages;

export const useChatUi = (selector) => useStore(useStores().chatUi, selector);
export const useChatUiStore = () => useStores().chatUi;
