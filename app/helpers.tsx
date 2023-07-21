import { MessageTemplate } from './interfaces'

// debounce used for editing message
export const debounce = (fn: Function, ms = 200) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export const checkPendingChanges = (message: MessageTemplate): boolean => {
  if (message.header.included !== message.header.includedTemp) {
    return true
  }
  if (message.body.included !== message.body.includedTemp) {
    return true
  }
  if (message.footer.included !== message.footer.includedTemp) {
    return true
  }
  if (message.buttons.included !== message.buttons.includedTemp) {
    return true
  }
  if (message.body.message !== message.body.messageTemp) {
    return true;
  }
  return false;
}

// TODO: validate message variables
export const checkForError = (message: string): string => {
  return ''
}
