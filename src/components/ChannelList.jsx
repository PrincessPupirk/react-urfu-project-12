import {
  Button,
  Group,
  Menu,
  ScrollArea,
  Stack,
  Title,
} from '@mantine/core';
import { IconDots } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useChannels, useChatUi } from '../context/stores.jsx';
import { filterProfanity } from '../utils/profanityFilter.js';

function ChannelList() {
  const { t } = useTranslation();
  const channels = useChannels((state) => state.items);
  const currentChannelId = useChatUi((state) => state.currentChannelId);
  const setCurrentChannelId = useChatUi((state) => state.setCurrentChannelId);
  const openModal = useChatUi((state) => state.openModal);

  return (
    <aside className="channels-panel">
      <Group justify="space-between" mb="md" wrap="nowrap">
        <Title order={4}>{t('channels.title')}</Title>
        <Button
          variant="subtle"
          size="compact-sm"
          aria-label={t('channels.add')}
          onClick={() => openModal('addChannel')}
        >
          {t('channels.add')}
        </Button>
      </Group>
      <ScrollArea className="channels-scroll">
        <Stack gap="xs">
          {channels.map((channel) => {
            const channelLabel = t('chat.channelPrefix', {
              name: filterProfanity(channel.name),
            });
            const isActive = String(channel.id) === String(currentChannelId);

            return (
              <Group key={channel.id} gap={4} wrap="nowrap" align="center">
                <Button
                  className="channel-link"
                  variant={isActive ? 'filled' : 'subtle'}
                  fullWidth
                  justify="flex-start"
                  style={{ flex: 1, minWidth: 0 }}
                  onClick={() => setCurrentChannelId(channel.id)}
                >
                  {channelLabel}
                </Button>
                {channel.removable ? (
                  <Menu position="bottom-end" withinPortal>
                    <Menu.Target>
                      <Button
                        variant="subtle"
                        size="compact-xs"
                        aria-label={t('channels.manage')}
                      >
                        <IconDots size={16} />
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        onClick={() => openModal('renameChannel', channel.id)}
                      >
                        {t('channels.rename')}
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        onClick={() => openModal('removeChannel', channel.id)}
                      >
                        {t('channels.remove')}
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                ) : null}
              </Group>
            );
          })}
        </Stack>
      </ScrollArea>
    </aside>
  );
}

export default ChannelList;
