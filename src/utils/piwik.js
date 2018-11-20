/* global _paq */

export default {
  created () {
    this.piwikEnable = JSON.parse(process.env.VUE_APP_PIWIK_ENABLED)
    this.startTracking()
  },
  mounted () {
    this.trackPage()
  },
  methods: {
    startTracking () {
      if (this.piwikEnable) {
        this.startGenerationTimeMs = (new Date()).getTime()
      }
    },

    trackPage () {
      document.title = this.title

      if (this.piwikEnable) {
        const timeMs = (new Date()).getTime() - this.startGenerationTimeMs
        trackPageView(this.$route.path, document.title, this.$store.state.user.username, timeMs)
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
