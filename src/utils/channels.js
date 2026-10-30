import i18n from '../i18n.js';

export const getGeneralChannelId = (channels) => {
  const general = channels.find((channel) => channel.name === 'general');
  return general?.id ?? channels[0]?.id ?? null;
};

export const validateChannelName = (name, channels, excludeChannelId = null) => {
  const trimmed = name?.trim() ?? '';

  if (trimmed.length < 3 || trimmed.length > 20) {
    return i18n.t('validation.channelLength');
  }

  const isDuplicate = channels.some(
    (channel) => channel.name === trimmed
      && String(channel.id) !== String(excludeChannelId),
  );

  if (isDuplicate) {
    return i18n.t('validation.channelUnique');
  }

  return null;
};
