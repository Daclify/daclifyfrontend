<template>
  <q-page padding class="constrain-page-width">
   <page-header title="Internal Accounting"/>
      <q-card v-if="getCoreConfig" class="">
        <div class="row justify-between q-mb-md q-py-sm">
          <q-item>
            <q-item-section avatar>
              <q-icon v-if="getCoreConfig.conf.withdrawals" name="check" color="positive" />
              <q-icon v-else name="close" color="negative" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6 text-weight-light">Withdrawals</q-item-label>
              <q-item-label caption>{{getCoreConfig.conf.withdrawals?'enabled':'disabled'}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon v-if="getCoreConfig.conf.deposits" name="check" color="positive" />
              <q-icon v-else name="close" color="negative" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6 text-weight-light">Deposits</q-item-label>
              <q-item-label caption>{{getCoreConfig.conf.deposits?'enabled':'disabled'}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon v-if="getCoreConfig.conf.internal_transfers" name="check" color="positive" />
              <q-icon v-else name="close" color="negative" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6 text-weight-light">Internal Transfers</q-item-label>
              <q-item-label caption>{{getCoreConfig.conf.internal_transfers?'enabled':'disabled'}}</q-item-label>
            </q-item-section>
          </q-item>

        </div>
      </q-card>
      <q-card  v-if="!myTokens.length">
        <q-card-section class="text-weight-light">You don't own tokens in this group</q-card-section>
      </q-card>
      <transition-group
        appear
        enter-active-class="animated zoomIn"
        leave-active-class="animated zoomOut"
        class="row q-col-gutter-md"
        tag="div"
      >
        <div
          v-for="token in myTokens" :key="token.symbol+token.contract"
          class="col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-4"
        >
          <user-balance-card :token="token" @updatebalance="getTokens()" />

        </div>
      </transition-group>
      <div class="row justify-center" v-if="is_loading">
        <q-spinner color="primary" size="60px" />
      </div>

<!-- {{getCoreConfig}} -->
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";

import pageHeader from "components/page-header";
import userBalanceCard from "components/user-balance-card";

export default {
  name: "vote",
  components: {
    pageHeader,
    userBalanceCard
  },
  data() {
    return {
      myTokens: [],
      is_loading: false
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getIsMember: "user/getIsMember",
      getCoreConfig: "group/getCoreConfig",
      // getNumberGuardians: "group/getNumberGuardians"
    })
  },
  methods: {
    async getTokens(){
      if(this.getAccountName){
        this.is_loading = true;
        this.myTokens = await this.$store.dispatch('group/fetchTokensOwnedByScope', {groupname: this.getActiveGroup, scope: this.getAccountName});
        this.is_loading = false;
      }

    },


  },
  watch: {
    getAccountName: {
      immediate: true,
      handler(newVal, oldVal) {
        if(newVal && newVal != oldVal){
          this.getTokens()
        }
      }
    }

  }

};
</script>
