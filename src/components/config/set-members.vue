<template>
  <div >

    <q-list separator class="q-mt-md">

      <q-item clickable>
        <q-item-section>
         <q-item-label>Enable member registration</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle
            v-if="getNewCoreConfig"
            :true-value="1"
            :false-value="0"
            :value="getNewCoreConfig.conf.member_registration"
            color="positive"
            @input="
              $store.commit('group/setNewCoreConfigPath', {
                path: 'conf.member_registration',
                value: Number($event)
              })
            "
          />
        </q-item-section>
      </q-item>

      <q-item clickable>
        <q-item-section>
         <q-item-label>Enable userterms/constitution</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle
            v-if="getNewCoreConfig"
            :true-value="1"
            :false-value="0"
            :value="getNewCoreConfig.conf.userterms"
            color="positive"
            @input="
              $store.commit('group/setNewCoreConfigPath', {
                path: 'conf.userterms',
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
