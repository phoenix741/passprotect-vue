import { SESSION } from '@/components/user/UserService'
import AnalyticsMixin from '@/utils/piwik'
import { shallowMount } from '@vue/test-utils'
import Router from 'vue-router'

let MyVue = {
  mixins: [AnalyticsMixin],
  template: '<div></div>',
  data () {
    return {
      title: 'title'
    }
  }
}

describe('piwik.js', () => {
  describe('Piwik not enabled', () => {
    it('Test a vue without piwik activated', () => {
      shallowMount(MyVue)

      expect(document.title).toBe('title')
      expect(window._paq).toBe(undefined)
    })
  })

  describe('Piwik enabled', () => {
    const RealDate = Date

    function mockDate (isoDate) {
      global.Date = class extends RealDate {
        constructor () {
          return new RealDate(isoDate)
        }
      }
    }

    beforeEach(() => {
      process.env.VUE_APP_PIWIK_ENABLED = true
      mockDate(new Date(2011, 9, 1).getTime())
    })

    afterEach(() => {
      global.Date = RealDate
      process.env.VUE_APP_PIWIK_ENABLED = false
      delete window._paq
      delete SESSION.username
    })

    it('Test a vue without piwik activated', () => {
      const mockRouter = new Router({ routes: [] })
      mockRouter.push('/')

      SESSION.username && delete SESSION.username
      shallowMount(MyVue, { router: mockRouter })
      expect(document.title).toBe('title')
      expect(window._paq).toEqual([
        ['setCustomUrl', '/'],
        ['setDocumentTitle', 'title'],
        ['setGenerationTimeMs', 0],
        ['enableLinkTracking'],
        ['trackPageView']
      ])
    })

    it('Test with a username', () => {
      const mockRouter = new Router({ routes: [] })
      mockRouter.push('/')

      SESSION.username = 'myusername'
      shallowMount(MyVue, { router: mockRouter })
      expect(document.title).toBe('title')
      expect(window._paq).toEqual([
        ['setCustomUrl', '/'],
        ['setDocumentTitle', 'title'],
        ['setGenerationTimeMs', 0],
        ['setUserId', 'myusername'],
        ['enableLinkTracking'],
        ['trackPageView']
      ])
    })
  })
})
