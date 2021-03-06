'use strict'

const WAIT_TIMEOUT = 5000

module.exports = {
  elements: {
    card: '.detail-card',

    form: 'form',

    label: '#label-input',
    notes: '#notes-input',
    groupSelect: '#group-select .v-icon',
    emptyMenu: '#empty-item',
    groupInput: '#new-group',
    groupBtn: '#create-group',

    text: '#text-input',

    username: '#username-input',
    password: '#password-input',
    passwordProgress: '.password-input .v-progress-linear',
    passwordVisibility: '.password-input .v-input__icon--append',
    siteurl: '#siteurl-input',

    nameOnCard: '#name-on-card-input',
    cardNumber: '#card-number-input',
    cvv: '#cvv-input',
    expiry: '#expiry-input',
    code: '#code-input',
    typeOfCard: '#type-of-card-select',

    button: '#detail-button'
  },
  commands: [{
    setGroup (group) {
      this
        .waitForElementVisible('@groupSelect', WAIT_TIMEOUT)
        .click('@groupSelect')
        .waitForElementVisible('@emptyMenu', WAIT_TIMEOUT)
        .click('@emptyMenu')
        .waitForElementVisible('@groupInput', WAIT_TIMEOUT)
        .setValue('@groupInput', group)
        .click('@groupBtn')
      return this.api
    },

    fillInText (label, text, notes) {
      this
        .waitForElementVisible('@label', WAIT_TIMEOUT)
        .setValue('@label', label)
        .waitForElementVisible('@text', WAIT_TIMEOUT)
        .setValue('@text', text)
        .waitForElementVisible('@notes', WAIT_TIMEOUT)
        .setValue('@notes', notes)
      return this.api
    },

    showPassword () {
      this
        .waitForElementVisible('@passwordVisibility', WAIT_TIMEOUT)
        .click('@passwordVisibility')
      return this.api
    },

    fillInPassword (label, username, password, siteUrl, notes) {
      this
        .waitForElementVisible('@label', WAIT_TIMEOUT)
        .setValue('@label', label)
        .waitForElementVisible('@username', WAIT_TIMEOUT)
        .setValue('@username', username)
        .waitForElementVisible('@password', WAIT_TIMEOUT)
        .setValue('@password', password)
        .waitForElementVisible('@siteurl', WAIT_TIMEOUT)
        .setValue('@siteurl', siteUrl)
        .waitForElementVisible('@notes', WAIT_TIMEOUT)
        .setValue('@notes', notes)
      return this.api
    },

    assertPasswordProgression (password, progression) {
      this
        .waitForElementVisible('@password', WAIT_TIMEOUT)

      this.api.execute('document.getElementById(\'password-input\').value = \'\'')

      this
        .setValue('@password', password)
        .assert.attributeEquals('@passwordProgress', 'aria-valuenow', String(progression), `Password ${password} should show a progress of ${progression}`)
      return this.api
    },

    fillInCard (label, nameOnCard, cardNumber, cvv, expiry, code, notes) {
      this
        .waitForElementVisible('@label', WAIT_TIMEOUT)
        .setValue('@label', label)
        .waitForElementVisible('@nameOnCard', WAIT_TIMEOUT)
        .setValue('@nameOnCard', nameOnCard)
        .waitForElementVisible('@cardNumber', WAIT_TIMEOUT)
        .setValue('@cardNumber', cardNumber)
        .waitForElementVisible('@cvv', WAIT_TIMEOUT)
        .setValue('@cvv', cvv)
        .waitForElementVisible('@expiry', WAIT_TIMEOUT)
        .setValue('@expiry', expiry)
        .waitForElementVisible('@code', WAIT_TIMEOUT)
        .setValue('@code', code)
        .waitForElementVisible('@notes', WAIT_TIMEOUT)
        .setValue('@notes', notes)
        .waitForElementVisible('@typeOfCard', WAIT_TIMEOUT)
        .click('@typeOfCard')
        .click('.v-menu__content .v-list__tile')
      return this.api
    },

    submit () {
      this
        .waitForElementVisible('@button', WAIT_TIMEOUT)
        .click('@button')
      return this.api
    }
  }]
}
