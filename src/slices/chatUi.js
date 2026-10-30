import { createStore } from 'zustand/vanilla';

export const createChatUiStore = () => createStore((set) => ({
  currentChannelId: null,
  modalType: null,
  modalChannelId: null,
  socketConnected: true,
  setCurrentChannelId: (currentChannelId) => set({ currentChannelId }),
  openModal: (modalType, modalChannelId = null) => set({ modalType, modalChannelId }),
  closeModal: () => set({ modalType: null, modalChannelId: null }),
  setSocketConnected: (socketConnected) => set({ socketConnected }),
}));
