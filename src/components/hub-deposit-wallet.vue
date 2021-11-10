<template>
  <div v-if="getAppConfig && getAccountName">
    <!-- <pre>{{getHubDeposits}}</pre> -->


    <transition-group
      appear
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
      tag="div"
    >
      <div v-for="d in getHubDeposits" :key="d.contract + d.symbol">
        <q-card >
          <q-item >
            <q-item-section avatar>
              <q-img
                contain
                :src="d.logo"
                spinner-color="white"
                style="height: 50px; width: 50px"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-light text-h6">
                <span>{{ d.amount }}</span>
                <span class="text-weight-bold"> {{ d.symbol }}</span>
              </q-item-label>
              <q-item-label caption class="text-grey">Deposit Balance</q-item-label>
            </q-item-section>
            <q-item-section side> </q-item-section>
          </q-item>
        </q-card>
      
      </div>
    </transition-group>

    <q-tabs  v-model="active_tab"  dense align="left" class="text-primary q-mt-md">
      <q-tab label="Deposit" name="deposit" />
      <q-tab label="Withdraw" name="withdraw"  />
    </q-tabs>

    <q-input v-model="input_value" class="q-mt-md" type="number" outlined bottom-slots dense>
      <template v-slot:append>
        EOS/TLOS/WAX
      </template>
    </q-input>

    <div class="row justify-between q-mt-md">
      <q-btn
        icon="mdi-refresh"
        color="primary"
        dense
        flat
        @click="refresh_deposits"
        :loading="is_loading_deposits"
      >
        <q-tooltip content-class="bg-secondary" :delay="500">
          Reload
        </q-tooltip>
      </q-btn>
      <div>
        <transition enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown" mode="out-in">
          <q-btn
            v-if="active_tab=='withdraw'"
            key="w"
            label="withdraw"
            @click="withdraw"
            color="primary"
            class="q-mr-sm"
            :loading="is_withdrawing"
            :disabled="!can_withdraw"
          />
          <q-btn
            v-else
            key="d"
            label="deposit"
            @click="deposit"
            color="primary"
            :loading="is_transfering"
          />
        </transition>
      </div>
    </div>
    <!-- {{getHubDeposits}} -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "hubDepositWallet",

  data() {
    return {
      active_tab: "deposit",
      transfer_asset: { contract: "eosio.token", quantity: "1.0000 EOS" },
      input_value: '',
      is_transfering: false,
      is_withdrawing: false,
      is_loading_deposits: false,
      selected_index : 0
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getAppConfig: "app/getAppConfig",
      getHubDeposits: "user/getHubDeposits"
    }),
    can_withdraw() {
      return this.getHubDeposits && this.getHubDeposits.length;
    },
    selected_asset(){
      if(this.getHubDeposits && this.getHubDeposits.length){
        return this.getHubDeposits[this.selected_index];
      }
      else{
        return this.getAppConfig.system_token
      }
    }
  },
  methods: {
    async refresh_deposits() {
      this.is_loading_deposits = true;
      await this.$store.dispatch("user/fetchHubDeposits", this.getAccountName);
      this.is_loading_deposits = false;
      this.input_value='';
    },
    async deposit() {

      let open = {
        account: this.getAppConfig.groups_contract,
        name: "opendeposit",
        data: {
          account: this.getAccountName,
          ram_payer: this.getAccountName,
          amount: {contract: this.selected_asset.contract, quantity: Number(0).toFixed(4)+` ${this.selected_asset.symbol}`}
        }
      };

      let transfer = {
        account: this.selected_asset.contract,
        name: "transfer",
        data: {
          from: this.getAccountName,
          to: this.getAppConfig.groups_contract,
          quantity: Number(this.input_value).toFixed(this.selected_asset.precision)+` ${this.selected_asset.symbol}`,
          memo: ""
        }
      };
      this.is_transfering = true;
      let res = await this.$store.dispatch("ual/transact", {
        actions: [open, transfer],
        disable_signing_overlay: true
      });
      if (res && res.trxid) {
        //dispatch('fetchHubDeposits', payload.accountname);
      } else {
      }
      this.is_transfering = false;
      setTimeout(() => {
        this.refresh_deposits();
      }, 1000);
    },
    async withdraw() {

      let withdraw = {
        account: this.getAppConfig.groups_contract,
        name: "withdraw",
        data: {
          account: this.getAccountName,
          amount: {contract: this.selected_asset.contract, quantity: Number(this.input_value).toFixed(this.selected_asset.precision)+` ${this.selected_asset.symbol}`}
        }
      };

      this.is_withdrawing = true;
      let res = await this.$store.dispatch("ual/transact", {
        actions: [withdraw],
        disable_signing_overlay: true
      });
      if (res && res.trxid) {
        //dispatch('fetchHubDeposits', payload.accountname);
      } else {
      }
      this.is_withdrawing = false;
      setTimeout(() => {
        this.refresh_deposits();
      }, 1000);
    }
  },
  mounted(){
    if(this.getAccountName){
      this.$store.dispatch("user/fetchHubDeposits", this.getAccountName);
    }
    
  }
};
</script>
