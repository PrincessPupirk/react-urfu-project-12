import { notifications } from '@mantine/notifications';
import i18n from '../i18n.js';

export const notifyError = (key, values = {}) => {
  notifications.show({
    color: 'red',
    message: i18n.t(key, values),
  });
};

export const notifySuccess = (key, values = {}) => {
  notifications.show({
    color: 'green',
    message: i18n.t(key, values),
  });
};

export default notifications;
