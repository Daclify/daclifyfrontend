<template>
  <div >
    <q-input
      outlined
      label="Max number of guardians"
      type="number"
      :value="getNewCoreConfig.conf.max_guardians"
      @input="
        $store.commit('group/setNewCoreConfigPath', {
          path: 'conf.max_guardians',
          value: Number($event)
        })
      "
    >
      <template v-slot:prepend>
        <q-icon name="mdi-account-key" />
      </template>
    </q-input>

    <q-input
    class="q-mt-md"
      outlined
      label="Inactivate guardian after inactivity seconds"
      type="number"
      :value="getNewCoreConfig.conf.inactivate_cust_after_sec"
      @input="
        $store.commit('group/setNewCoreConfigPath', {
          path: 'conf.inactivate_cust_after_sec',
          value: Number($event)
        })
      "
    >
      <template v-slot:prepend>
        <q-icon name="mdi-heart" />
      </template>
      <template v-slot:append>
        <div>SEC</div>
      </template>
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
