import { useEffect } from 'react';
import {
  useChannels,
  useChannelsStore,
  useChatUi,
  useChatUiStore,
  useMessages,
} from '../context/stores.jsx';
import { getGeneralChannelId } from '../utils/channels.js';
import { notifyError } from '../utils/notifications.js';

const useChatSocket = (socket) => {
  const channelsStore = useChannelsStore();
  const chatUiStore = useChatUiStore();
  const addChannel = useChannels((state) => state.addChannel);
  const updateChannel = useChannels((state) => state.updateChannel);
  const removeChannel = useChannels((state) => state.removeChannel);
  const addMessage = useMessages((state) => state.addMessage);
  const updateMessage = useMessages((state) => state.updateMessage);
  const removeMessage = useMessages((state) => state.removeMessage);
  const removeMessagesByChannelId = useMessages((state) => state.removeMessagesByChannelId);
  const setSocketConnected = useChatUi((state) => state.setSocketConnected);
  const setCurrentChannelId = useChatUi((state) => state.setCurrentChannelId);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => {
      setSocketConnected(false);
      notifyError('notifications.networkError');
    };

    const handleRemoveMessage = ({ id }) => removeMessage(id);

    const handleRemoveChannel = ({ id }) => {
      const { currentChannelId } = chatUiStore.getState();

      removeMessagesByChannelId(id);
      removeChannel(id);

      if (String(currentChannelId) === String(id)) {
        const channels = channelsStore.getState().items;
        setCurrentChannelId(getGeneralChannelId(channels));
      }
    };

    setSocketConnected(socket.connected);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('newMessage', addMessage);
    socket.on('renameMessage', updateMessage);
    socket.on('removeMessage', handleRemoveMessage);
    socket.on('newChannel', addChannel);
    socket.on('renameChannel', updateChannel);
    socket.on('removeChannel', handleRemoveChannel);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('newMessage', addMessage);
      socket.off('renameMessage', updateMessage);
      socket.off('removeMessage', handleRemoveMessage);
      socket.off('newChannel', addChannel);
      socket.off('renameChannel', updateChannel);
      socket.off('removeChannel', handleRemoveChannel);
    };
  }, [
    socket,
    channelsStore,
    chatUiStore,
    addChannel,
    updateChannel,
    removeChannel,
    addMessage,
    updateMessage,
    removeMessage,
    removeMessagesByChannelId,
    setSocketConnected,
    setCurrentChannelId,
  ]);
};

export default useChatSocket;
