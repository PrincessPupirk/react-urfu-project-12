import { useState } from 'react';
import { Alert, Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { postMessage } from '../api/http.js';
import { useAuth, useChatUi, useMessages } from '../context/stores.jsx';
import { filterProfanity } from '../utils/profanityFilter.js';

function MessageForm() {
  const { t } = useTranslation();
  const token = useAuth((state) => state.token);
  const username = useAuth((state) => state.username);
  const currentChannelId = useChatUi((state) => state.currentChannelId);
  const socketConnected = useChatUi((state) => state.socketConnected);
  const addMessage = useMessages((state) => state.addMessage);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      body: '',
    },
    validate: {
      body: (value) => (
        value.trim().length > 0 ? null : t('validation.messageRequired')
      ),
    },
  });

  const handleSubmit = async (values) => {
    if (!token || !currentChannelId || !username) {
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const message = await postMessage(token, {
        body: filterProfanity(values.body.trim()),
        channelId: currentChannelId,
        username,
      });

      addMessage(message);
      form.reset();
    } catch {
      setSubmitError(t('messages.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="message-form"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      {!socketConnected && (
        <Alert color="yellow" mb="sm">
          {t('messages.socketWarning')}
        </Alert>
      )}
      {submitError && (
        <Alert color="red" mb="sm">
          {submitError}
        </Alert>
      )}
      <TextInput
        placeholder={t('messages.newPlaceholder')}
        aria-label={t('messages.newAriaLabel')}
        disabled={isSubmitting}
        {...form.getInputProps('body')}
      />
      <Button type="submit" mt="sm" loading={isSubmitting}>
        {t('messages.submit')}
      </Button>
    </form>
  );
}

export default MessageForm;
