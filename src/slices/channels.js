import { createStore } from 'zustand/vanilla';

export const createChannelsStore = () => createStore((set) => ({
  items: [],
  setChannels: (items) => set({ items }),
  addChannel: (channel) => set((state) => {
    if (state.items.some((item) => item.id === channel.id)) {
      return state;
    }

    return { items: [...state.items, channel] };
  }),
  updateChannel: (channel) => set((state) => ({
    items: state.items.map((item) => (
      item.id === channel.id ? channel : item
    )),
  })),
  removeChannel: (id) => set((state) => ({
    items: state.items.filter((item) => String(item.id) !== String(id)),
  })),
}));
