export const cardTypeMapping = {
  card: {
    label: 'list.type.card',
    icon: 'credit_card',
    color: 'red',
    fields: {
      group: '',
      type: '',
      nameOnCard: '',
      cardNumber: '',
      cvv: '',
      expiry: '',
      code: '',
      logo: '',
      notes: ''
    }
  },
  password: {
    label: 'list.type.password',
    icon: 'fingerprint',
    color: 'blue',
    fields: {
      group: '',
      username: '',
      password: '',
      siteUrl: '',
      logo: '',
      notes: ''
    }
  },
  text: {
    label: 'list.type.text',
    icon: 'text_fields',
    color: 'green',
    fields: {
      group: '',
      text: '',
      logo: '',
      notes: ''
    }
  }
}

export let encryptLine

export function setEncryptLineHandler (handler) {
  encryptLine = handler
}

export let decryptLine

export function setDecryptLineHandler (handler) {
  decryptLine = handler
}

export let generate

export function setGenerateHandler (handler) {
  generate = handler
}
