export interface MessageTemplate {
  header: {
    included: boolean,
    includedTemp: boolean,
    url: string,
  },
  body: {
    included: boolean,
    includedTemp: boolean,
    message: string,
    messageTemp: string
  },
  footer: {
    included: boolean,
    includedTemp: boolean,
    message: string,
  },
  buttons: {
    included: boolean,
    includedTemp: boolean,
    buttons: string[],
  }
}
