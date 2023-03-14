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
app.mount('#app')