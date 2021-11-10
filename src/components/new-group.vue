<template>
  <div class="row justify-center">
    <div class="create-group-width">
      <div class="q-mb-md text-grey-5 text-h6 text-weight-light ">
        <div
          v-if="step == 'request_account_name'"
          class="row justify-between  "
        >
          <div>GROUP NAME</div>
          <div>1/{{ number_of_steps }}</div>
        </div>
        <div v-if="step == 'create_account'" class="row justify-between  ">
          <div>CREATE ACCOUNT</div>
          <div>2/{{ number_of_steps }}</div>
        </div>
        <div
          v-else-if="step == 'request_signature'"
          class="row justify-between  "
        >
          <div>CREATING</div>
          <div class="text-uppercase text-primary">
            {{ new_group_account_name }}
          </div>
        </div>
      </div>

      <q-carousel
        v-model="step"
        keep-alive
        :navigation="false"
        transition-prev="scale"
        transition-next="scale"
        :swipeable="false"
        animated
        control-color="primary"
        :padding="false"
        :arrows="false"
        height="250px"
        class="bg-transparent"
      >
        <q-carousel-slide :name="`request_account_name`" class="no-padding">
          <div>
            <!-- account input -->
            <div class="rounded-borders overflow-hidden">
              <q-input
                :dark="false"
                ref="accountinput"
                autocomplete="off"
                outlined
                no-error-icon
                counter
                maxlength="12"
                color="accent"
                bg-color="white"
                v-model="new_group_account_name"
                placeholder="Choose new group name"
                :rules="[
                  val => !!val || '* Required',
                  isValidAccountName,
                  val =>
                    val.length == 12 || 'Group name must be min 12  chars.',

                  isavailableAccountNameWrapper
                ]"
                @input="account_name_validated = false"
              >
                <template v-slot:prepend>
                  <q-icon name="people" />
                </template>
                <template v-slot:append>
                  <q-icon
                    v-if="account_name_validated"
                    name="check"
                    color="positive"
                  />
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
            <!-- account input -->
            <!-- next button -->
            <div class="column justify-center items-center q-mt-lg">
              <q-btn
                color="primary"
                label="next"
                style="width:150px"
                :disabled="!account_name_validated"
                @click="next('')"
              />

              <div v-if="groups_by_creator.length" class="q-mt-sm">
                <transition-group
                  appear
                  enter-active-class="animated zoomIn"
                  leave-active-class="animated zoomOut"
                  mode="out-in"
                  class="column q-gutter-sm"
                  tag="div"
                >
                <q-btn
                  icon="mdi-alert"
                  :label="group.groupname"
                  v-for="group in groups_by_creator.filter(
                    gbc => gbc.state === 0
                  )"
                  :key="group.groupname"
                  color="secondary"
                  @click="next(group.groupname)"
                >
                  <q-tooltip content-class="bg-secondary" :delay="500">
                    This group isn't activated yet. Proceed to activation by
                    clicking the button.
                  </q-tooltip>
                </q-btn>
                </transition-group>
              </div>
            </div>
            <!-- next button -->
          </div>
        </q-carousel-slide>

        <q-carousel-slide name="create_account" class="no-padding">
          <div class="row justify-begin items-center text-black">
            <span class="text-uppercase">{{ new_group_account_name }}</span>
            <q-btn
              icon="edit"
              round
              flat
              size="sm"
              @click="step = 'request_account_name'"
            >
              <q-tooltip
                :delay="300"
                anchor="center right"
                self="center left"
                :offset="[10, 0]"
              >
                Edit Group Name.
              </q-tooltip>
            </q-btn>
          </div>
          <!-- voice toggle -->
          <!-- <div class="row">
            <div class="text-grey-6">
              <q-toggle
              :dark="false"
                v-model="voice_only"
                left-label
                :disable="true"
              >
              <div class="row items-center">
                <q-icon name="img:statics/images/voice.png" class="q-mr-xs"/>
                Voice Only
              </div>
              </q-toggle>
              <q-tooltip
              content-class="bg-secondary"
                :delay="500"
                anchor="center right"
                self="center left"
                :offset="[0, -5]"
              >
                Voice only groups will be available when Voice has launched. You'll be able to switch an existing group to voice only.
              </q-tooltip>
            </div>
          </div> -->
          <!-- voice toggle -->
          <div class="text-grey-6">
            <div>
              Account will be created. Estimated RAM cost is {{getResourceEstimation}}
            </div>

            
            
          </div>

          <div class="column justify-center items-center q-mt-md">
            <q-btn
              color="primary"
              label="create"
              style="width:150px"
              :disabled="!account_name_validated"
              @click="createGroup"
            />
            <!-- <q-btn @click="deploycontract" /> -->

            <!-- <router-link to="/manage/piecestest55" tag="a" class="text-link text-caption" style="display:block">
            Go to test group
          </router-link> -->
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="`request_activation`" class="no-padding">
          <div class="column items-center full-height text-grey-6 q-pt-md">
            Account created
            <q-btn
              color="primary"
              label="activate"
              style="width:150px"
              :disabled="!account_name_validated"
              @click="activateGroup"
            />
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="`request_signature`" class="no-padding">
          <div class="column items-center full-height text-grey-6 q-pt-md">
            <q-spinner
              color="primary"
              size="40px"
              @click="step = 'request_account_name'"
              class="cursor-pointer"
            />
            <div class="q-mt-md">Waiting for Signature</div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="`group_created`" class="no-padding">
          <div class="column items-center full-height text-grey-6 q-pt-md">
            <q-icon color="primary" size="40px" name="check" />
            <div class="q-mt-xs">Group created successful</div>
            <q-btn
              label="visit group"
              color="secondary"
              class="q-mt-md"
              :to="`./manage/${new_group_account_name}`"
            />
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
    <wasm-compiler ref="wasm_compiler" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import wasmCompiler from "components/wasm-compiler";

import {
  isValidAccountName,
  isAvailableAccountName
} from "../imports/validators";

export default {
  name: "create",
  components: {
    wasmCompiler
  },
  props: {
    prefill: {
      type: Object,
      default: () => {
        return {
          group_account_name: ""
        };
      }
    }
  },
  data() {
    return {
      number_of_steps: 3,
      step: "request_account_name", //request_account_name, request_signature
      new_group_account_name: "",
      account_name_validated: false,
      voice_only: false,
      wasmhex: "",
      abihex: "",
      groups_by_creator: [],
      required_bytes: 1600000
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getAppConfig: "app/getAppConfig",
      getHubDeposits: "user/getHubDeposits",
      getRamPricePerByte: "app/getRamPricePerByte"
    }),
    getResourceEstimation(){
      if(this.getRamPricePerByte){
        return ((this.getRamPricePerByte*this.required_bytes)+2).toFixed(4)+ ` ${this.getAppConfig.system_token.symbol}`;
      }
    },
    has_enough_deposits(){
      let res = false
      if(this.getResourceEstimation && this.getHubDeposits.length){
        let eos_deposit = this.getHubDeposits.find(d => d.symbol == this.getAppConfig.system_token.symbol).quantity;
        if(eos_deposit){
          return parseFloat(this.getResourceEstimation) <= parseFloat(eos_deposit);
        }
      }
      return res;
    }
  },
  methods: {
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
    async activateGroup() {
      // if (this.getAccountName != "piecesnbits1") {
      //   alert(
      //     "Creating groups is disabled. Daclify is making the last core changes to prepare for mainnet! Sorry no timelines avaiable!"
      //   );
      //   return;
      // }

      this.deploycontract(this.new_group_account_name);
    },
    async createGroup() {
      // if (this.getAccountName != "piecesnbits1") {
      //   alert(
      //     "Creating groups is disabled. Daclify is making the last core changes to prepare for mainnet! Sorry no timelines avaiable!"
      //   );
      //   return;
      // }

        if(!this.has_enough_deposits){
          this.openHubWallet();
          return;
        }


      await this.$store.dispatch('app/fetchRamPricePerByte');
      this.step = "request_signature";
      let create_group = {
        account: this.getAppConfig.groups_contract,
        name: "creategroup",
        data: {
          groupname: this.new_group_account_name,
          creator: this.getAccountName,
          resource_estimation: this.getResourceEstimation
        }
      };

      let res = await this.$store.dispatch("ual/transact", {
        actions: [create_group],
        disable_signing_overlay: true
      });
      setTimeout(()=>{this.$store.dispatch("user/fetchHubDeposits", this.getAccountName)}, 2000);
      if (res && res.trxid) {
        this.step = "request_activation";
      } else {
        this.step = "create_account"
        return false;
      }
      
    },
    async deploycontract(new_group) {
      this.step = "request_signature";

      let setcode = {
        account: "eosio",
        name: "setcode",
        data: {
          account: new_group,
          vmtype: 0,
          vmversion: 0,
          code: this.wasmhex
        },
        authorization: [{ actor: this.getAccountName, permission: "active" }, { actor: new_group, permission: "active" }]
      };

      let setabi = {
        account: "eosio",
        name: "setabi",
        data: {
          account: new_group,
          abi: this.abihex
        },
        authorization: [{ actor: this.getAccountName, permission: "active" }, { actor: new_group, permission: "active" }]
      };

      let activate = {
        account: this.getAppConfig.groups_contract,
        name: "activate",
        data: {
          groupname: new_group,
          creator: this.getAccountName
        }
      };


      let res = await this.$store.dispatch("ual/transact", {
        actions: [setabi, setcode, activate],
        disable_signing_overlay: true
      });
      setTimeout(()=>{this.$store.dispatch("user/fetchHubDeposits", this.getAccountName)}, 1000);
      if (res && res.trxid) {
        this.step = "group_created";
        return true;
      } else {
        this.step = "request_activation";
        return false;
      }

    },
    openHubWallet(){
          let msg = `You don't have enough EOS/TLOS/WAX deposits to pay for RAM. Daclify calculated you need a minimum of ${this.getResourceEstimation} to deploy the daclify core contract. Excess deposits will be used to buy extra RAM. Daclify takes no fees.`
          this.$root.$emit('showHubDeposits', msg);
    },
    async next(resume_account_name = "") {
      
      if (resume_account_name !="") {
        this.step = "request_activation";
        this.account_name_validated = true;
        this.new_group_account_name = resume_account_name;
      }
      else{
        this.step = "create_account";
        if(!this.has_enough_deposits){
          this.openHubWallet();
        }
      }
    },
    async get_wasm_and_abi_from_github(){
      console.log("retrieving code from github")
      let wasm = await this.$refs.wasm_compiler.loadRemoteWasm("https://raw.githubusercontent.com/Daclify/daclifycore/master/daclifycore.wasm");
      let abi = await this.$refs.wasm_compiler.loadRemoteAbi("https://raw.githubusercontent.com/Daclify/daclifycore/master/daclifycore.abi");

      this.wasmhex = wasm.wasm;
      this.abihex = abi;
    },


    async get_wasm_and_abi_from_block(query) {
      let blocks = [];
      blocks.push(this.$eos.api.rpc.get_block(query.wasm[0]));
      if (query.wasm[0] != query.abi[0]) {
        blocks.push(this.$eos.api.rpc.get_block(query.abi[0]));
      }
      let [wasmblock, abiblock] = await Promise.all(blocks);
      abiblock = abiblock || wasmblock;

      let wasmhex = wasmblock.transactions
        .find(trx => trx.trx.id == query.wasm[1])
        .trx.transaction.actions.find(a => a.name == "setcode").data.code;
      let abihex = abiblock.transactions
        .find(trx => trx.trx.id == query.abi[1])
        .trx.transaction.actions.find(a => a.name == "setabi").data.abi;
      this.wasmhex = wasmhex;
      this.abihex = abihex;
      //return {wasmhex: wasmhex, abihex: abihex};
    },
    async getGroupsByCreator() {
      let groups_by_creator = await this.$eos.api.rpc.get_table_rows({
        json: true,
        code: this.getAppConfig.groups_contract,
        scope: this.getAppConfig.groups_contract,
        table: "groups",
        key_type: "name",
        index_position: 3,
        lower_bound: this.getAccountName,
        upper_bound: this.getAccountName,
        limit: -1
      });


      if (groups_by_creator && groups_by_creator.rows.length && groups_by_creator.rows[0].creator == this.getAccountName) {
        groups_by_creator = groups_by_creator.rows;
      } else {
        groups_by_creator = [];
      }
      console.log("fetched groups by creator", groups_by_creator);
      //this.groups_by_creator = [{groupname:"test", state:0}, {groupname:"test1", state:0}];
      this.groups_by_creator = groups_by_creator;
    },
    // async calculateRequiredResources(){
    //   await this.fetchRamPrice
    // },

  },
  async mounted() {
    
    this.$store.dispatch('app/fetchRamPricePerByte');
    // await this.get_wasm_and_abi_from_block({
    //   wasm: [
    //     26584888,
    //     "433202ae4a84c6f13ec458f690acc844c0b81007770dfcfce586e4937e3c1ce9"
    //   ],
    //   abi: [
    //     26584889,
    //     "5d34750ee2f3db76f938c962f67709fb57486635030594b67849d49dc56c162c"
    //   ]
    // });
    await this.get_wasm_and_abi_from_github();

    if (this.prefill.group_account_name) {
      this.new_group_account_name = this.prefill.group_account_name;
    }
  },
  watch: {
    new_group_account_name: function() {
      console.log(this.$refs.accountinput.hasError);
    },
    getAccountName: {
      immediate: true,
      handler: function(newV, oldV){
        if(this.getAccountName){
          this.getGroupsByCreator();
        }
      }
    }
  }
};
</script>
<style>
.create-group-width {
  width: 300px;
}
.bg-transparent {
  background: transparent;
}
</style>
