import alt, { AbstractStoreModel } from '../../../alt';

import toastActions from './ToastActions';

export interface IToast {
  text: string,
  action?: any
}

export interface IToastStoreState {
  toasts: IToast[],
  queued: Array<IToast>
}

class ToastStore extends AbstractStoreModel<IToastStoreState> implements IToastStoreState {
  toasts: IToast[];
  queued: Array<IToast>;

  constructor() {
    super();

    this.toasts = [];
    this.queued = Array<IToast>();

    this.bindListeners({
      addToast: toastActions.addToast,
      removeToast: toastActions.removeToast,
    });
  }

  addToast(toast: IToast): void {
    if (this.toasts.length === 0) {
      this.toasts.push(toast);
    } else {
      this.queued.push(toast);
    }
  }

  removeToast(): void {
    if (this.queued.length > 0) {
      this.toasts = this.queued.splice(0, 1);
    } else if (this.toasts.length > 0) {
      const [, ...toasts] = this.toasts;
      this.toasts = toasts;
    }
  }
}

const toastStore = alt.createStore<IToastStoreState>(ToastStore, "ToastStore");

export default toastStore;
