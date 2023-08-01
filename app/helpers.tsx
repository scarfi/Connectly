import { MessageTemplate } from './interfaces'
import { SubmissionTemplate } from './types'

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

export const deepCopy = (obj: {[key: string]: any}) => {
  return JSON.parse(JSON.stringify(obj));
}

export const buildMessagePayload = (message: MessageTemplate): SubmissionTemplate => {
    const componentsList: any[] = [];
    const template: SubmissionTemplate = {
      name: 'Message Example',
      language: 'en',
      components: [],
      namespace: '',
    }
    Object.entries(message).forEach(entry => {
      const [key, value] = entry
      if (key === 'name') {
        template.name = value;
        return;
      }
      const included = value.included;
      console.log('value', value)
      if (included) {
        const componentObject: {[key: string]: any} = {
          type: key,
        }
        if (key === 'header') {
          componentObject.url = value.url;
        } else if (key === 'body') {
          componentObject.parameters = [];
          componentObject.message = value.message;
        } else if (key === 'footer') {
          componentObject.message = value.message;
        } else if (key === 'buttons') {
          componentObject.buttons = value.buttons;
        }
        componentsList.push(componentObject)
      }
    })
    template.components = componentsList;
    return template
}
// if (typeof window !== undefined) {
//   window.buildPayload = buildMessagePayload;
// }
