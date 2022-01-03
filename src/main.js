import Vue from "vue"
import router from "./router"
import store from "./store"
import App from "./App.vue"
import vuetify from "./plugins/vuetify";
import { fmtSpecimenNumber } from "./lib/string-format"
import { format, fromUnixTime } from "date-fns"
import VueGtag from "vue-gtag"
import * as Sentry from "@sentry/vue"
import { Integrations } from "@sentry/tracing"

var pjson = require("../package.json")

Vue.use(VueGtag, {
  config: { id: process.env.VUE_APP_GTAG },
  appName: pjson.name,
  pageTrackerScreenviewEnabled: true
}, router)

const SENTRY_DSN = process.env.VUE_APP_SENTRY_DSN

if (SENTRY_DSN) {
  Sentry.init({
    Vue,
    dsn: SENTRY_DSN,
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ["localhost", "app.debio.network", /^\//],
      }),
    ],
    tracesSampleRate: 1.0,
  })
}

Vue.config.productionTip = false

Vue.filter("customerSpecimenStatus", function (val) {
  return val == "Received" ? "Received by Lab" : val
})
Vue.filter("specimenNumber", function (val) {
  return fmtSpecimenNumber(val)
})
Vue.filter("timestampToDate", function (val) {
  let timestamp
  if (typeof val == "string") {
    timestamp = parseInt(val.replaceAll(",", ""))
  } else {
    timestamp = val
  }
  try {
    return format(new Date(timestamp), "MMMM dd yyyy")
  } catch (err) {
    console.log(err)
    return ""
  }
})
Vue.filter("timestampToDateTime", function (val) {
  try {
    return format(fromUnixTime(val), "MMMM dd yyyy hh:mm")
  } catch (err) {
    console.log(err)
    return ""
  }
})

/**
 * setupAppDependencies
 *
 * Wait for web3 and smart contracts to load
 * this will set web3 and smart contracts to store
 */
/*
async function setupAppDependencies() {
  const DEFAULT_RPC_URL = 'http://34.101.116.238:8545'
  let rpcUrl = localStorage.getRpcUrl() || DEFAULT_RPC_URL
  await store.dispatch('ethereum/initWeb3', rpcUrl)
  store.dispatch('ethereum/contracts/initContracts')
  return
}
*/

async function setupAppDependencies() {
  await store.dispatch("auth/initApp");
  await store.dispatch("metamask/initWeb3");
  store.dispatch("metamask/contracts/initContracts");
  return
}



setupAppDependencies()
  .then(() => {

    new Vue({
      vuetify,
      router,
      store,
      render: h => h(App)
    }).$mount("#app")

  })
