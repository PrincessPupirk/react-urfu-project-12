import { useEffect } from 'react';
import { Button, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { postChannel } from '../../api/http.js';
import { useAuth, useChannels, useChatUi } from '../../context/stores.jsx';
import { validateChannelName } from '../../utils/channels.js';
import { filterProfanity } from '../../utils/profanityFilter.js';
import { notifySuccess } from '../../utils/notifications.js';

function AddChannelModal() {
  const { t } = useTranslation();
  const token = useAuth((state) => state.token);
  const channels = useChannels((state) => state.items);
  const addChannel = useChannels((state) => state.addChannel);
  const modalType = useChatUi((state) => state.modalType);
  const closeModal = useChatUi((state) => state.closeModal);
  const setCurrentChannelId = useChatUi((state) => state.setCurrentChannelId);

  const form = useForm({
    initialValues: { name: '' },
    validate: {
      name: (value) => validateChannelName(value, channels),
    },
  });

  const mutation = useMutation({
    mutationFn: (name) => postChannel(token, { name: filterProfanity(name.trim()) }),
    onSuccess: (channel) => {
      addChannel(channel);
      setCurrentChannelId(channel.id);
      notifySuccess('notifications.channelCreated');
      form.reset();
      closeModal();
    },
  });

  useEffect(() => {
    if (modalType === 'addChannel') {
      form.reset();
      mutation.reset();
    }
  }, [modalType]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (values) => {
    mutation.mutate(values.name);
  };

  return (
    <Modal
      opened={modalType === 'addChannel'}
      onClose={closeModal}
      title={t('modals.addChannel.title')}
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
          {t('modals.addChannel.submit')}
        </Button>
      </form>
    </Modal>
  );
}

export default AddChannelModal;
