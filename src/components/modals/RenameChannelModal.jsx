import { useEffect } from 'react';
import { Button, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { patchChannel } from '../../api/http.js';
import { useAuth, useChannels, useChatUi } from '../../context/stores.jsx';
import { validateChannelName } from '../../utils/channels.js';
import { filterProfanity } from '../../utils/profanityFilter.js';
import { notifySuccess } from '../../utils/notifications.js';

function RenameChannelModal() {
  const { t } = useTranslation();
  const token = useAuth((state) => state.token);
  const channels = useChannels((state) => state.items);
  const updateChannel = useChannels((state) => state.updateChannel);
  const modalType = useChatUi((state) => state.modalType);
  const modalChannelId = useChatUi((state) => state.modalChannelId);
  const closeModal = useChatUi((state) => state.closeModal);

  const channel = channels.find(
    (item) => String(item.id) === String(modalChannelId),
  );

  const form = useForm({
    initialValues: { name: '' },
    validate: {
      name: (value) => validateChannelName(value, channels, modalChannelId),
    },
  });

  const mutation = useMutation({
    mutationFn: (name) => patchChannel(
      token,
      modalChannelId,
      { name: filterProfanity(name.trim()) },
    ),
    onSuccess: (updatedChannel) => {
      updateChannel(updatedChannel);
      notifySuccess('notifications.channelRenamed');
      closeModal();
    },
  });

  useEffect(() => {
    if (modalType === 'renameChannel' && channel) {
      form.setValues({ name: channel.name });
      mutation.reset();
    }
  }, [modalType, channel?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (values) => {
    mutation.mutate(values.name);
  };

  return (
    <Modal
      opened={modalType === 'renameChannel'}
      onClose={closeModal}
      title={t('modals.renameChannel.title')}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label={t('channels.nameLabel')}
          placeholder={t('channels.namePlaceholder')}
          data-autofocus
          disabled={mutation.isPending}
          {...form.getInputProps('name')}
        />
        <Button type="submit" mt="md" loading={mutation.isPending}>
          {t('modals.renameChannel.submit')}
        </Button>
      </form>
    </Modal>
  );
}

export default RenameChannelModal;
