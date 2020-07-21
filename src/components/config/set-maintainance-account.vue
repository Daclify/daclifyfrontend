<template>
  <div >



      <div class="row items-center justify-between no-wrap">
      <q-input
        style="min-width:200px"
        class="q-mr-xs"
        :value="getNewCoreConfig.conf.maintainer_account.actor"
        @input="
          $store.commit('group/setNewCoreConfigPath', {
            path: 'conf.maintainer_account.actor',
            value: $event
          })
        "
        label="Actor"
        outlined
        maxlength="12"
        :debounce="500"
        bottom-slots
        placeholder="name of the account"
        no-error-icon
      >
      </q-input>

      <q-input
        style="width:100%"
        ref="permission"
        :value="getNewCoreConfig.conf.maintainer_account.permission"
        @input="
          $store.commit('group/setNewCoreConfigPath', {
            path: 'conf.maintainer_account.permission',
            value: $event
          })
        "
        label="Permission"
        outlined
        bottom-slots
        placeholder="permission to use"
        no-error-icon
      >
        <template v-slot:prepend>
            @
        </template>
      </q-input>
      </div>


  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  // name: 'ComponentName',
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getNewCoreConfig: "group/getNewCoreConfig"
    })
  },
};
</script>
