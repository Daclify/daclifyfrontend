<template>
  <div>
          <q-btn
            style="height:32px; width:140px"
            v-if="!getAccountName"
            label="login"
            @click="$store.dispatch('ual/renderLoginModal')"
            color="primary"
            :flat="getShouldRenderLoginModal"
            :loading="getShouldRenderLoginModal"
            
          />
          <q-btn-dropdown v-if="getAccountName" color="white" flat :label="getAccountName" style="width:140px">
            <q-list>
              <q-item clickable dense v-close-popup @click="$store.dispatch('ual/logout')">
                <q-item-section >
                  <q-item-label >Logout</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  // name: 'ComponentName',
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getShouldRenderLoginModal: "ual/getShouldRenderLoginModal"
    })
  },
}
</script>

<style>
</style>
