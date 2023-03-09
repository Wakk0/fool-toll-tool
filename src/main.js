import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify
import "vuetify/styles"
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import { aliases, mdi } from "vuetify/lib/iconsets/mdi"
import "@mdi/font/css/materialdesignicons.css"
import { VDataTable } from 'vuetify/labs/VDataTable'

import VueMatomo from 'vue-matomo'
const matomoOptions = {
  host: 'https://matomo.yakko.one',
  siteId: 2,
  trackerFileName: 'matomo',
  router: router,
  enableLinkTracking: true,
  requireConsent: false,
  trackInitialView: true,
  disableCookies: false,
  requireCookieConsent: false,
  enableHeartBeatTimer: false,
  heartBeatTimerInterval: 15,
  debug: false,
  userId: undefined,
  cookieDomain: undefined,
  domains: undefined,
  preInitActions: [],
  trackSiteSearch: false,
  crossOrigin: undefined,
}
const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  components: { ...components, VDataTable },
  directives
})

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.use(VueMatomo)
app.mount('#app')
