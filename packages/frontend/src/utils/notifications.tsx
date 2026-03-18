import { notifications } from '@mantine/notifications';

export const showErrorNotification = (title: string, error: any) => {
  let message = 'An unexpected error occurred';

  if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object') {
    if (error.message) {
      if (Array.isArray(error.message)) {
        message = error.message.join(', ');
      } else {
        message = error.message;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }
  }

  notifications.show({
    title: title,
    message: message,
    color: 'red',
    autoClose: 5000,
  });
};

export const showSuccessNotification = (message: string) => {
  notifications.show({
    message: message,
    color: 'green',
    autoClose: 5000,
  });
};
