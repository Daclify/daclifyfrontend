<template>
  <div >

    <q-input
      class="q-mt-md"
      outlined
      label="Maintainer Account"
      :value="getNewCoreConfig.conf.maintainer_account"
      @input="
        $store.commit('group/setNewCoreConfigPath', {
          path: 'conf.maintainer_account',
          value: $event
        })
      "
    >
      <template v-slot:prepend>
        <q-icon name="mdi-settings-transfer" />
      </template>
      <!-- <template v-slot:append>
        <div>SEC</div>
      </template> -->
    </q-input>


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
