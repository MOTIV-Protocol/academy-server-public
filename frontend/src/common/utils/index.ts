import { getUser } from '@api';
import Framework7 from 'framework7';
import jwt_decode from 'jwt-decode';

export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export const getCurrentUserFromToken = async (token: string) => {
  try {
    const { user_id } = jwt_decode(token) as { user_id: string | number };
    const { data } = await getUser(+user_id);
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export interface Toast {
  openToast: () => void;
  openIconToast: (icon: string) => void;
  setToastText: (text: string) => Toast;
}
export const toast = (() => {
  let instance: Toast;
  // public
  function init(f7: Framework7) {
    const textToast = f7.toast.create({
      text: 'text',
      position: 'center',
      closeTimeout: 2000,
    });
    const iconToast = f7.toast.create({
      text: '',
      icon: `<i class="f7-icons">exclamationmark_triangle</i>`,
      position: 'center',
      closeTimeout: 2000,
    });
    return {
      openToast: () => {
        textToast.open();
      },
      openIconToast: (icon: string) => {
        iconToast.$el.find('.toast-icon').html(`<i class="f7-icons">${icon}</i>`);
        iconToast.open();
      },
      setToastText: (text: string) => {
        textToast.$el.find('.toast-text').text(text);
        iconToast.$el.find('.toast-text').text(text);
        return instance;
      },
    } as Toast;
  }
  return {
    get: (): Toast => instance,
    set(f7: Framework7) {
      if (!instance) instance = init(f7);
    },
  };
})();
