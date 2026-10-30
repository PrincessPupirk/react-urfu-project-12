import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getChannels, getMessages } from '../api/http.js';
import {
  useAuth,
  useChannels,
  useChatUi,
  useMessages,
} from '../context/stores.jsx';
import { notifyError } from '../utils/notifications.js';

const useChatData = () => {
  const token = useAuth((state) => state.token);
  const setChannels = useChannels((state) => state.setChannels);
  const setMessages = useMessages((state) => state.setMessages);
  const setCurrentChannelId = useChatUi((state) => state.setCurrentChannelId);
  const currentChannelId = useChatUi((state) => state.currentChannelId);

  const channelsQuery = useQuery({
    queryKey: ['channels', token],
    queryFn: () => getChannels(token),
    enabled: Boolean(token),
  });

  const messagesQuery = useQuery({
    queryKey: ['messages', token],
    queryFn: () => getMessages(token),
    enabled: Boolean(token),
  });

  useEffect(() => {
    if (channelsQuery.data) {
      setChannels(channelsQuery.data);
    }
  }, [channelsQuery.data, setChannels]);

  useEffect(() => {
    if (messagesQuery.data) {
      setMessages(messagesQuery.data);
    }
  }, [messagesQuery.data, setMessages]);

  useEffect(() => {
    if (!channelsQuery.data?.length || currentChannelId) {
      return;
    }

    const generalChannel = channelsQuery.data.find(
      (channel) => channel.name === 'general',
    );

    setCurrentChannelId(generalChannel?.id ?? channelsQuery.data[0].id);
  }, [channelsQuery.data, currentChannelId, setCurrentChannelId]);

  const isError = channelsQuery.isError || messagesQuery.isError;

  useEffect(() => {
    if (isError) {
      notifyError('notifications.loadError');
    }
  }, [isError]);

  return {
    isLoading: channelsQuery.isLoading || messagesQuery.isLoading,
    isError,
  };
};

export default useChatData;
