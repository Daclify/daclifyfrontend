import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

import ual from 'components/ual/store';
import app from './app';
import user from './user';
import group from './group';
import bucket from './bucket';
import elections from './elections';

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      ual,
      app,
      user,
      group,
      bucket,
      elections
    },
    plugins: [
      createPersistedState({
        key: "ual",
        paths: ["ual.SESSION"]
      }),
      createPersistedState({
        key: "user",
        paths: ["user.favouriteGroups", "user.resourceWarningLevels", "user.minifyCustodians", "user.isDark", "user.topicSubscriptions", "user.currentFCMToken"]
      })
    ],

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: false
  })

  return Store
}
