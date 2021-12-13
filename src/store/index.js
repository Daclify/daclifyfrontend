import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

import createPersistedState from "vuex-persistedstate";

import ual from 'components/ual/store';
import app from './app';
import user from './user';
import group from './group';
import bucket from './bucket';
import elections from './elections';
import payroll from './payroll';
import hooks from './hooks';

// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      ual,
      app,
      user,
      group,
      bucket,
      elections,
      payroll,
      hooks
    },
    plugins: [
      createPersistedState({
        key: "ual",
        paths: ["ual.SESSION", "ual.activeNetwork"]
      }),
      createPersistedState({
        key: "user",
        paths: ["user.favouriteGroups", "user.resourceWarningLevels", "user.minifyGuardians", "user.isDark", "user.miniState", "user.topicSubscriptions", "user.currentFCMToken"]
      })
    ],

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: false
    // strict: process.env.DEBUGGING
  })

  return Store
})
