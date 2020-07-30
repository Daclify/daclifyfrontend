<template>
<q-tab-panels
  v-model="new_account_view"
  style="min-height:200px"
  class="overflow-hidden"
  animated 
  transition-prev="fade" 
  transition-next="fade"
>
  <q-tab-panel name="newaccount" class="no-padding overflow-hidden" style="min-height:200px">
    <div class="q-mt-sm row q-col-gutter-md">
      <div class="col-xs-12 col-md-6">
        <q-input
          ref="newaccountname"
          autocomplete="off"
          outlined
          no-error-icon
          counter
          maxlength="12"
          v-model="new_account_name"
          placeholder="Choose account name"
          :rules="[
            val => !!val || '* Required',
            isValidAccountName,
            val => val.length == 12 || 'Name must be min 12  chars.',

            isavailableAccountNameWrapper
          ]"
          @input="account_name_validated = false"
        >
          <template v-slot:prepend>
            <q-icon name="mdi-account" />
          </template>
          <template v-slot:append>
            <q-icon v-if="account_name_validated" name="check" color="positive" />
          </template>
          <template v-slot:hint>
            <span class="text-grey-8 row" v-if="account_name_validated">
              <!-- <q-icon name="check"/> -->
              <span>Account name available!</span>
            </span>
            <span v-else>12 char account name</span>
          </template>
        </q-input>
      </div>

      <div class="col-xs-12 col-md-6">
        <q-input
          ref="ramquantity"
          type="number"
          v-model="ram_quantity"
          label="RAM"
          outlined
          bottom-slots
          placeholder="eos amount"
          no-error-icon
          :rules="[
            val => !!val || '* Required',
            val => val >= 0.001 || 'Minimum amount is 0.0010'
          ]"
        >
          <template v-slot:append>
            {{ getAppConfig.system_token.symbol }}
          </template>
        </q-input>
      </div>

      <div class="col-xs-12 col-md-6">
        <q-input
          ref="netquantity"
          type="number"
          v-model="net_quantity"
          label="NET"
          outlined
          bottom-slots
          placeholder="eos amount"
          no-error-icon
          :rules="[
            val => !!val || '* Required',
            //val => val > 0 || 'Must be greater then zero'
          ]"
        >
          <template v-slot:append>
            {{ getAppConfig.system_token.symbol }}
          </template>
        </q-input>
      </div>

      <div class="col-xs-12 col-md-6">
        <q-input
          ref="cpuquantity"
          type="number"
          v-model="cpu_quantity"
          label="CPU"
          outlined
          bottom-slots
          placeholder="eos amount"
          no-error-icon
          :rules="[
            val => !!val || '* Required',
            //val => val > 0 || 'Must be greater then zero'
          ]"
        >
          <template v-slot:append>
            {{ getAppConfig.system_token.symbol }}
          </template>
        </q-input>
      </div>

      <div class="col-xs-12 col-md-6">
        <div class="row">
          <q-toggle
            v-model="transfer_resources"
            color="positive"
            label="transfer resources"
          />
        </div>
      </div>

      <div class="col-xs-12 col-md-6">
        <div class="row">
          <q-toggle
            v-model="include_eosio_code"
            color="positive"
            label="add eosio.code to active permission"
          />
        </div>
      </div>

      <div class="col-xs-12">
        <div class="row justify-end">
          <q-btn
            label="create"
            @click="create"
            color="primary"
            :loading="is_creating"
          />
        </div>
      </div>
    </div>
  </q-tab-panel>
  <q-tab-panel name="account_created" class="no-padding overflow-hidden" style="min-height:200px">
    <div class="q-mt-sm row q-col-gutter-md">
      <div class="col-xs-12">
        Account {{new_account_name}} created
      </div>
      <div class="col-xs-12 row q-gutter-md">
        <q-btn @click="new_account_view='newaccount'" icon="mdi-arrow-left" label="create more" color="secondary"/>
        <q-btn @click="openURL(getSelectedBlockExplorer.base+getSelectedBlockExplorer.account+new_account_name)" icon="mdi-magnify" label="explore" color="primary"/>
        <q-btn @click="$emit('requestLink', {actor: new_account_name, permission: 'active'} )" icon="mdi-link-box" label="link as module" color="primary"/>
        
      </div>

    </div>
  </q-tab-panel>
</q-tab-panels>
</template>

<script>
import { mapGetters } from "vuex";
import { openURL } from "quasar";
import {
  isValidAccountName,
  isAvailableAccountName
} from "../../imports/validators";
export default {
  name: "newAccount",
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getAppConfig: "app/getAppConfig",
      getSelectedBlockExplorer: "user/getSelectedBlockExplorer"
    }),
    getModulesWithFilter() {
      return this.getModules;
    }
  },
  data() {
    return {
      new_account_view:"newaccount",

      is_creating: false,
      new_account_name: "",
      account_name_validated: false,
      ram_quantity: "",
      cpu_quantity: "",
      net_quantity: "",
      transfer_resources: false,

      include_eosio_code:false,
      created_receipt:""
    };
  },
  methods: {
    openURL,
    isValidAccountName,
    isAvailableAccountName,
    async isavailableAccountNameWrapper(v) {
      const test = await isAvailableAccountName(v);
      console.log(test);
      if (test === true) {
        this.account_name_validated = true;
        return true;
      } else {
        this.account_name_validated = false;
        return test;
      }
    },
    async create() {
      // this.new_account_view="account_created";
      // return;
      let creator = this.getAccountName;

      let newaccount = {
        account: "eosio",
        name: "newaccount",
        //authorization: [{ actor: "piecesnbitss", permission: "active" }],
        data: {
          creator: creator,
          name: this.new_account_name,
          active: {accounts: [{permission: { actor: this.getActiveGroup, permission: "owner" },weight: 1}],keys: [],threshold: 1,waits: []},
          owner: {accounts: [{permission: { actor: this.getActiveGroup, permission: "owner" },weight: 1},{permission: { actor: this.getAccountName, permission: "active" },weight: 1}],keys: [],threshold: 1,waits: []}
        }
      }
      if(this.include_eosio_code){
        newaccount.data.active.accounts.push({permission: { actor: this.new_account_name, permission: "eosio.code" },weight: 1});
      }
      let buyram = {
        account: "eosio",
        name: "buyram",
        //authorization: [{ actor: "piecesnbitss", permission: "active" }],
        data: {
          payer: creator,
          receiver: this.new_account_name,
          quant: this.ram_quantity+` ${this.getAppConfig.system_token.symbol}`
        }
      }
      let delegatebw = {
        account: "eosio",
        name: "delegatebw",
        //authorization: [{ actor: "piecesnbitss", permission: "active" }],
        data: {
          from: creator,
          receiver: this.new_account_name,
          stake_net_quantity: this.net_quantity+` ${this.getAppConfig.system_token.symbol}`,
          stake_cpu_quantity: this.cpu_quantity+` ${this.getAppConfig.system_token.symbol}`,
          transfer: this.transfer_resources
        }
      }
      // let transfer = {
      //   account: "eosio.token",
      //   name: "transfer",
      //   authorization: [{ actor: "piecesnbitss", permission: "active" }],
      //   data: {
      //     from: "piecesnbitss",
      //     to: "%accountname%",
      //     quantity: "10.0000 EOS",
      //     memo: "money for food"
      //   }
      // }
      

      this.$refs.newaccountname.validate();
      this.$refs.ramquantity.validate();
      this.$refs.netquantity.validate();
      this.$refs.cpuquantity.validate();
      if (
        this.$refs.newaccountname.hasError ||
        this.$refs.ramquantity.hasError ||
        this.$refs.netquantity.hasError ||
        this.$refs.cpuquantity.hasError
      ) {
        return;
      }
      this.is_creating = true;

      let actions = [newaccount];
      actions.push(buyram);
      if(parseFloat(this.net_quantity) || parseFloat(this.cpu_quantity) ){
        actions.push(delegatebw);
      }
      

      let res = await this.$store.dispatch("ual/transact", { actions: actions, disable_signing_overlay: true  });
      if(res && res.trxid){
        console.log(res)
        this.new_account_view= "account_created";
      }

      this.is_creating = false;
    }
  },
  watch: {
    ram_quantity: function(newV, oldV) {
      if (this.ram_quantity !== "") {
        this.ram_quantity = Number(this.ram_quantity).toFixed(
          this.getAppConfig.system_token.precision
        );
      }
    },
    net_quantity: function(newV, oldV) {
      if (this.net_quantity !== "") {
        this.net_quantity = Number(this.net_quantity).toFixed(
          this.getAppConfig.system_token.precision
        );
      }
    },
    cpu_quantity: function(newV, oldV) {
      if (this.cpu_quantity !== "") {
        this.cpu_quantity = Number(this.cpu_quantity).toFixed(
          this.getAppConfig.system_token.precision
        );
      }
    }
  }
};
</script>
