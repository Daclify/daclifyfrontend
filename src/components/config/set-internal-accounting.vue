<template>
  <div>
    <!-- <q-input
      outlined
      label="Enable Withdrawals"
      type="number"
      :value="getNewCoreConfig.conf.enable_withdraw"
      @input="
        $store.commit('group/setNewCoreConfigPath', {
          path: 'conf.enable_withdraw',
          value: Number($event)
        })
      "
    >
      <template v-slot:prepend>
        <q-icon name="mdi-account-key" />
      </template>
    </q-input> -->
    <q-list separator>

      <q-item clickable>
        <q-item-section>
         <q-item-label>Enable Internal Transfers</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle
            v-if="getNewCoreConfig"
            :true-value="1"
            :false-value="0"
            :value="getNewCoreConfig.conf.internal_transfers"
            color="positive"
            @input="
              $store.commit('group/setNewCoreConfigPath', {
                path: 'conf.internal_transfers',
                value: Number($event)
              })
            "
          />
        </q-item-section>
      </q-item>

      <q-item clickable>
        <q-item-section>
         <q-item-label>Enable Deposits</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle
            v-if="getNewCoreConfig"
            :true-value="1"
            :false-value="0"
            :value="getNewCoreConfig.conf.deposits"
            color="positive"
            @input="
              $store.commit('group/setNewCoreConfigPath', {
                path: 'conf.deposits',
                value: Number($event)
              })
            "
          />
        </q-item-section>
      </q-item>

      <q-item clickable>
        <q-item-section>
         <q-item-label>Enable Withdrawals</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle
            v-if="getNewCoreConfig"
            :true-value="1"
            :false-value="0"
            :value="getNewCoreConfig.conf.withdrawals"
            color="positive"
            @input="
              $store.commit('group/setNewCoreConfigPath', {
                path: 'conf.withdrawals',
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
  }
};
</script>
