import { Button, Group, Modal, Text } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { deleteChannel } from '../../api/http.js';
import {
  useAuth,
  useChannels,
  useChannelsStore,
  useChatUi,
  useMessages,
} from '../../context/stores.jsx';
import { getGeneralChannelId } from '../../utils/channels.js';
import { notifySuccess } from '../../utils/notifications.js';

function RemoveChannelModal() {
  const { t } = useTranslation();
  const channelsStore = useChannelsStore();
  const token = useAuth((state) => state.token);
  const channels = useChannels((state) => state.items);
  const removeChannel = useChannels((state) => state.removeChannel);
  const removeMessagesByChannelId = useMessages((state) => state.removeMessagesByChannelId);
  const modalType = useChatUi((state) => state.modalType);
  const modalChannelId = useChatUi((state) => state.modalChannelId);
  const closeModal = useChatUi((state) => state.closeModal);
  const currentChannelId = useChatUi((state) => state.currentChannelId);
  const setCurrentChannelId = useChatUi((state) => state.setCurrentChannelId);

  const channel = channels.find(
    (item) => String(item.id) === String(modalChannelId),
  );

  const mutation = useMutation({
    mutationFn: () => deleteChannel(token, modalChannelId),
    onSuccess: () => {
      removeMessagesByChannelId(modalChannelId);
      removeChannel(modalChannelId);

      if (String(currentChannelId) === String(modalChannelId)) {
        const remainingChannels = channelsStore.getState().items;
        setCurrentChannelId(getGeneralChannelId(remainingChannels));
      }

      notifySuccess('notifications.channelRemoved');
      closeModal();
    },
  });

  return (
    <Modal
      opened={modalType === 'removeChannel'}
      onClose={closeModal}
      title={t('modals.removeChannel.title')}
      centered
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate();
        }}
      >
        <Text mb="md">
          {t('modals.removeChannel.confirm', { name: channel?.name ?? '' })}
        </Text>
        <Group justify="flex-end">
          <Button
            type="button"
            variant="default"
            onClick={closeModal}
            disabled={mutation.isPending}
          >
            {t('modals.removeChannel.cancel')}
          </Button>
          <Button type="submit" color="red" loading={mutation.isPending}>
            {t('modals.removeChannel.submit')}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default RemoveChannelModal;
