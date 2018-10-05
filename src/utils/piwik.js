/* global _paq */

import { SESSION } from '../components/user/UserService'

const VUE_APP_PIWIK_ENABLED = JSON.parse(process.env.VUE_APP_PIWIK_ENABLED)

export default {
  created () {
    this.startTracking()
  },
  mounted () {
    this.trackPage()
  },
  methods: {
    startTracking () {
      if (VUE_APP_PIWIK_ENABLED) {
        this.startGenerationTimeMs = (new Date()).getTime()
      }
    },

    trackPage () {
      document.title = this.title

      if (VUE_APP_PIWIK_ENABLED) {
        const timeMs = (new Date()).getTime() - this.startGenerationTimeMs
        trackPageView(this.$route.path, document.title, SESSION.username, timeMs)
      }
    }
  }
}

function trackPageView (url, title, user, generationTimeMs) {
  window._paq = window._paq || []

  _paq.push(['setCustomUrl', url])
  title && _paq.push(['setDocumentTitle', title])
  _paq.push(['setGenerationTimeMs', generationTimeMs])
  user && _paq.push(['setUserId', user])

  _paq.push(['enableLinkTracking'])
  _paq.push(['trackPageView'])
}
