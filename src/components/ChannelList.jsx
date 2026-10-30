import {
  Button,
  Group,
  Menu,
  NavLink,
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
          {channels.map((channel) => (
            <NavLink
              key={channel.id}
              className="channel-link"
              label={t('chat.channelPrefix', { name: filterProfanity(channel.name) })}
              active={String(channel.id) === String(currentChannelId)}
              onClick={() => setCurrentChannelId(channel.id)}
              variant="filled"
              rightSection={channel.removable ? (
                <Menu position="bottom-end" withinPortal>
                  <Menu.Target>
                    <Button
                      variant="subtle"
                      size="compact-xs"
                      aria-label={t('channels.manage')}
                      onClick={(event) => event.stopPropagation()}
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
            />
          ))}
        </Stack>
      </ScrollArea>
    </aside>
  );
}

export default ChannelList;
