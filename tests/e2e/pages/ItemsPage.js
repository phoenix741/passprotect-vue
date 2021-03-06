'use strict'

const WAIT_TIMEOUT = 20000

module.exports = {
  elements: {
    search: '.search-input input',

    addButton: '#items-add-button',
    addTextButton: '#items-add-text-button',
    addCardButton: '#items-add-card-button',
    addPasswordButton: '#items-add-password-button'
  },
  commands: [{
    checkPageShown () {
      this
        .waitForElementVisible('@search', WAIT_TIMEOUT)
      return this.api
    },

    add () {
      this.api.pause(500)
      this
        .waitForElementVisible('@addButton', WAIT_TIMEOUT)
        .click('@addButton')
      return this.api
    },

    checkButton () {
      this
        .waitForElementVisible('@addTextButton', WAIT_TIMEOUT)
        .waitForElementVisible('@addCardButton', WAIT_TIMEOUT)
        .waitForElementVisible('@addPasswordButton', WAIT_TIMEOUT)
      return this.api
    },

    addText () {
      this.add()
      this.checkButton()
      this
        .waitForElementVisible('@addTextButton', WAIT_TIMEOUT)
        .click('@addTextButton')
      return this.api
    },

    addPassword () {
      this.add()
      this.checkButton()
      this
        .waitForElementVisible('@addPasswordButton', WAIT_TIMEOUT)
        .click('@addPasswordButton')
      return this.api
    },

    addCard () {
      this.add()
      this.checkButton()
      this
        .waitForElementVisible('@addCardButton', WAIT_TIMEOUT)
        .click('@addCardButton')
      return this.api
    },

    search (search) {
      this
        .waitForElementVisible('@search', WAIT_TIMEOUT)
        .setValue('@search', search)
      return this.api
    },

    assertItem (indice, title, type) {
      this
        .waitForElementPresent(`#items-list > div:nth-child(${indice}) .line-title`, WAIT_TIMEOUT)
        .assert.containsText(`#items-list > div:nth-child(${indice}) .line-title`, title)
      return this.api
    },

    assertItemWithGroup (indice, group, title, type) {
      this
        .waitForElementVisible('@search', WAIT_TIMEOUT)
        .waitForElementPresent(`#items-list > div:nth-child(${indice}).v-subheader`, WAIT_TIMEOUT)

        .assert.containsText(`#items-list > div:nth-child(${indice}).v-subheader`, group)
        .assertItem(indice + 1, title, type)
      return this.api
    },

    selectItem (indice) {
      this
        .waitForElementVisible('@search', WAIT_TIMEOUT)

        .click(`#items-list > div:nth-child(${indice}) .line-title`)
      return this.api
    }
  }]
}
