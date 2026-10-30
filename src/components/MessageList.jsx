import { ScrollArea, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useChannels, useChatUi, useMessages } from '../context/stores.jsx';
import { filterProfanity } from '../utils/profanityFilter.js';

function MessageList() {
  const { t } = useTranslation();
  const messages = useMessages((state) => state.items);
  const channels = useChannels((state) => state.items);
  const currentChannelId = useChatUi((state) => state.currentChannelId);

  const currentChannel = channels.find(
    (channel) => String(channel.id) === String(currentChannelId),
  );

  const channelMessages = messages.filter(
    (message) => String(message.channelId) === String(currentChannelId),
  );

  return (
    <>
      {currentChannel && (
        <Title order={3} p="md" className="channel-title">
          {t('chat.channelPrefix', { name: filterProfanity(currentChannel.name) })}
        </Title>
      )}
      <ScrollArea className="messages-scroll">
        <Stack gap="sm" p="md">
          {channelMessages.map((message) => (
            <div key={message.id} className="message-item">
              <Text fw={700} size="sm" className="message-username">
                {message.username}
              </Text>
              <Text size="sm" className="message-body">
                {filterProfanity(message.body)}
              </Text>
            </div>
          ))}
          {!channelMessages.length && (
            <Text c="dimmed" size="sm">
              {t('chat.noMessages')}
            </Text>
          )}
        </Stack>
      </ScrollArea>
    </>
  );
}

export default MessageList;
