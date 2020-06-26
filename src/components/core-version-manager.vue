<template>
  <div>

    <q-item>
      <q-item-section avatar>
        <q-icon name="mdi-settings" color="primary" size="xl" />
      </q-item-section>
      <q-item-section >
        <q-item-label class="text-weight-light text-h5 text-grey-7">Core Version <span class="text-caption">(code hash)</span></q-item-label>
        <q-item-label caption class="ellipsis">{{current_code_hash}}</q-item-label>

        <q-item-label class="ellipsis text-primary"  caption>
          <span v-if="isUpdateAvailable">{{new_code_hash}}</span>
          <span v-if="!isUpdateAvailable && new_code_hash" >No updates available</span>
          <span v-else>&nbsp</span>
        </q-item-label>

      </q-item-section>
      <q-item-section side>
        <q-btn v-if="isUpdateAvailable && getIsCustodian(getAccountName)" :loading="is_loading" flat icon="mdi-download-network"  @click="proposeCodeUpdate" color="primary">
          <q-tooltip :delay="500" content-class="bg-secondary">
            Propose to install a contract update.
          </q-tooltip>
        </q-btn>
        <q-btn v-else :loading="is_loading" icon="mdi-refresh"  flat @click="check_for_updates" color="primary">
          <q-tooltip :delay="500" content-class="bg-secondary">
            check for contract updates.
          </q-tooltip>
        </q-btn>
        
      </q-item-section>
    </q-item>
    <wasm-compiler ref="wasm_compiler"/>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {randomName, sha256} from "../imports/helpers.js";
import wasmCompiler from "components/wasm-compiler";
export default {
  // name: 'ComponentName',
  
  components: {
    wasmCompiler
  },
  data () {
    return {
      current_code_hash : '',
      current_abi_hash : '',
      new_code_hash: '',
      is_loading: false,
      wasmhex: '',
      abihex: ''
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getIsCustodian: "group/getIsCustodian"
    }),
    isUpdateAvailable(){
      if(this.current_code_hash && this.new_code_hash){
        return this.current_code_hash !== this.new_code_hash
      }
      else{
        return false;
      }
    }
  },
  methods:{
    async getCurrentCodeHash() {
      this.is_loading = true;
      console.log(this.getActiveGroup)
      let url = 'https://jungle3.eossweden.org/v1/chain/get_raw_abi';
      //let res = await this.$eos.rpc.get_raw_code_and_abi(this.getActiveGroup);
      let res = await this.$axios({
        method: 'post',
        url: url,
        data: {
          account_name: this.getActiveGroup
        }
      })
      console.log('fetched code hash for', this.getActiveGroup, res.data.code_hash);
      this.is_loading = false;
      this.current_code_hash = res.data.code_hash;
      this.current_abi_hash = res.data.abi_hash;
    },
    async check_for_updates(){
      this.is_loading = true;
      let r = await this.$refs.wasm_compiler.loadRemoteWasm('https://raw.githubusercontent.com/eosgroups/group/master/group.wasm');
      this.wasmhex = r.wasm;
      this.new_code_hash = r.code_hash;
      this.abihex = await this.$refs.wasm_compiler.loadRemoteAbi('https://raw.githubusercontent.com/eosgroups/group/master/group.abi');
      this.is_loading = false;
    },
    async proposeCodeUpdate(){
      this.is_loading = true;
      let PROPOSAL_NAME = randomName();
      // let transfer = {
      //   account: "eosio.token",
      //   name: "transfer",
      //   data:{
      //     from: this.getActiveGroup,
      //     to: "kas",
      //     quantity: "0.0001 EOS",
      //     memo: ''
      //   },
      //   authorization:[{actor: this.getActiveGroup, permission: "owner"}]     
      // }
      let setcode= {
        account: "eosio",
        name: "setcode",
        data:{
          account: this.getActiveGroup,
          vmtype: 0,
          vmversion: 0,
          code: this.wasmhex
        },
        authorization:[{actor: this.getActiveGroup, permission: "owner"}]

      };
      let setabi = {
        account: "eosio",
        name: "setabi",
        data:{
          account: this.getActiveGroup,
          abi: this.abihex
        },
        authorization:[{actor: this.getActiveGroup, permission: "owner"}]
      };

      let system_propose_options = {
        return_action: true,
        actions: [setcode, setabi], //required
        requested: [{actor: this.getActiveGroup, permission: "owner"}],
        proposal_name: PROPOSAL_NAME,
        //   expiration: "2019-08-10T19:14:14",
      }
      let system_propose_action = await this.$store.dispatch("ual/proposeSystemMsig", system_propose_options);

      let proposal_hash = await this.$eos.serializeTransaction(system_propose_action.data.trx);
      proposal_hash = sha256(proposal_hash);
      console.log("proposal hash", proposal_hash)



      let approve_and_execute =  [
            {
              account: 'eosio.msig',
              name: 'approve',
              data:{
                proposer: this.getAccountName,
                proposal_name: PROPOSAL_NAME,
                level: {actor: this.getActiveGroup, permission: "owner"},
                proposal_hash: proposal_hash
              },
              authorization: [{actor: this.getActiveGroup, permission: "owner"}]
            },
            {
              account: 'eosio.msig',
              name: 'exec',
              data:{
                proposer: this.getAccountName,
                proposal_name: PROPOSAL_NAME,
                executer: this.getActiveGroup
              },
              authorization: [{actor: this.getActiveGroup, permission: "owner"}]
            }
      ]
      let group_propose_options= {
          return_action: true,
          title: "Core Contract update",
          description: `update the groups core contract. new code hash: ${this.new_code_hash}`,
          actions: approve_and_execute
      }
      let group_propose_action = await this.$store.dispatch("group/propose", group_propose_options);


      let res = await this.$store.dispatch("ual/transact", {actions: [system_propose_action, group_propose_action], disable_signing_overlay: true });
      if(res && res.transactionId && res.status == "executed"){
        setTimeout(()=>{
          this.$store.dispatch('group/fetchProposals', {groupname: this.getActiveGroup, scope: this.getActiveGroup});
        },1500);
      }
      this.is_loading = false;
    }

  },
  mounted(){
    if(this.getActiveGroup){
      this.getCurrentCodeHash();
    }
  },
  // watch:{
  //     getActiveGroup:{
  //       handler: function(newv, oldv){
  //         if(newv && newv != oldv){
  //           this.getCurrentCodeHash();
  //         }
  //       },
  //       immediate: false
  //     },
  // }

}
</script>
