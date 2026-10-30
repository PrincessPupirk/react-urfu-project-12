import { createStore } from 'zustand/vanilla';

export const createMessagesStore = () => createStore((set) => ({
  items: [],
  setMessages: (items) => set({ items }),
  addMessage: (message) => set((state) => {
    if (state.items.some((item) => item.id === message.id)) {
      return state;
    }

    return { items: [...state.items, message] };
  }),
  updateMessage: (message) => set((state) => ({
    items: state.items.map((item) => (
      item.id === message.id ? message : item
    )),
  })),
  removeMessage: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  })),
  removeMessagesByChannelId: (channelId) => set((state) => ({
    items: state.items.filter(
      (item) => String(item.channelId) !== String(channelId),
    ),
  })),
}));
