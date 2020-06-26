<template>
  <div >
    <q-input
      outlined
      label="Proposal History Size"
      type="number"
      :value="getNewCoreConfig.conf.proposal_archive_size"
      @input="
        $store.commit('group/setNewCoreConfigPath', {
          path: 'conf.proposal_archive_size',
          value: Number($event)
        })
      "
    >
      <template v-slot:prepend>
        <q-icon name="mdi-history" />
      </template>
    </q-input>

    <q-list separator class="q-mt-md">

      <q-item clickable>
        <q-item-section>
         <q-item-label>Auto execute "immediate" threshold</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle
            v-if="getNewCoreConfig"
            :true-value="1"
            :false-value="0"
            :value="getNewCoreConfig.conf.exec_on_threshold_zero"
            color="positive"
            @input="
              $store.commit('group/setNewCoreConfigPath', {
                path: 'conf.exec_on_threshold_zero',
                value: Number($event)
              })
            "
          />
        </q-item-section>
      </q-item>
    </q-list>


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
