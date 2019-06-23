import { Component, Vue } from 'vue-property-decorator';
import { TranslateResult } from 'vue-i18n';
import { SmartQuery } from 'vue-apollo-decorator';
import checkSession from '@/services/graphql/session/checkSession.graphql';
import { CheckSessionQuery, CheckSessionQueryVariables, LocalSession } from '../generated/graphql';

@Component({})
export default class AnalyticsMixin extends Vue {
  startGenerationTimeMs = 0;
  piwikEnable = false;
  title?: TranslateResult;

  @SmartQuery<AnalyticsMixin, CheckSessionQuery, CheckSessionQueryVariables>({ query: checkSession })
  localSession?: LocalSession;

  created() {
    this.piwikEnable = JSON.parse(process.env.VUE_APP_PIWIK_ENABLED || 'false');
    this.startTracking();
  }

  mounted() {
    this.title && this.trackPage();
  }

  startTracking() {
    if (this.piwikEnable && this.startGenerationTimeMs === 0) {
      this.startGenerationTimeMs = new Date().getTime();
    }
  }

  trackPage() {
    document.title = this.title as string;

    if (this.piwikEnable) {
      const timeMs = new Date().getTime() - this.startGenerationTimeMs;
      this.startGenerationTimeMs = 0;
      trackPageView(this.$route.path, document.title, (this.localSession || {}).username || '', timeMs);
    }
  }
}

function trackPageView(url: string, title: string, user: string, generationTimeMs?: number) {
  window._paq = window._paq || [];

  window._paq.push(['setCustomUrl', url]);
  title && window._paq.push(['setDocumentTitle', title]);
  window._paq.push(['setGenerationTimeMs', generationTimeMs]);
  user && window._paq.push(['setUserId', user]);

  window._paq.push(['enableLinkTracking']);
  window._paq.push(['trackPageView']);
}
