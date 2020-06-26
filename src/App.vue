<template>
  <div id="q-app">
    <ual :appName= "appName" :chains="chains" :authenticators="authenticators" ref="ual-component"/>
    <router-view />


    <q-dialog v-model="show_hub_deposit_wallet">
      <q-card class="overflow-hidden" style="max-width:350px">
        <q-card-section>
            <page-header title="Daclify hub deposits"/>
            <p class="text-grey-7 text-caption">Deposits on the Daclify Hub are needed to perform certain actions like paying for resources during group creation or clapping for a group.</p>
            <q-btn icon="close" flat round dense v-close-popup class="q-ma-md absolute-top-right"/>
            <div>
              <hub-deposit-wallet />
            </div>
        </q-card-section>
      </q-card>
    </q-dialog>


  </div>
</template>

<script>
import ual from "components/ual/ual";
import hubDepositWallet from "components/hub-deposit-wallet";
import pageHeader from "components/page-header";
import { Scatter } from 'ual-scatter';
import { Ledger } from 'ual-ledger';
import { Lynx } from 'ual-lynx';
import { TokenPocket } from 'ual-token-pocket';
import { EOSIOAuth } from 'ual-eosio-reference-authenticator';



const appName = 'daclify';
// const chains = [{
//     chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
//     rpcEndpoints: [{
//         protocol: 'https',
//         host: 'api.eostitan.com',
//         port: '443',
//     }]
// }];
const chains = [{
    chainId: '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840',
    rpcEndpoints: [{
        protocol: 'https',
        host: 'jungle3.eossweden.org',
        port: 443,
    }]
}];

import { mapGetters } from "vuex";
import {notifyError, notifySuccess} from './imports/notifications.js';
export default {
  name: 'App',
  components:{ual, hubDepositWallet, pageHeader},
  data () {
    return {
      appName: appName,
      authenticators:[
        new Scatter(chains, {appName: appName}),
        new Ledger(chains),
        new Lynx(chains, { appName: appName }),
        new TokenPocket(chains),
        new EOSIOAuth(chains, { appName, protocol: 'eosio' })
      ],
      chains: chains,
      show_hub_deposit_wallet: false
    }
  },
  computed: {
    ...mapGetters({
      getActiveGroup: "group/getActiveGroup",
      getAccountName: "ual/getAccountName",
      getIsDark: "user/getIsDark"
    })
  },
  mounted(){
    this.$store.dispatch('app/initRoutine');

  },
  created(){
    this.$root.$on('showHubDeposits', ()=>{this.show_hub_deposit_wallet=true});

    if(this.$messaging){
      this.$messaging.onMessage((payload) =>{
        //messsage handling when app focused
        console.log( payload);
        if(payload.data.type ="propose" && !payload.notification.body.includes(this.getAccountName)){
          this.$store.dispatch('group/fetchProposals', {groupname: this.getActiveGroup, scope: this.getActiveGroup});
          notifySuccess({message:`${payload.notification.body}`});
        }
        // ...
      });
    }
  },


  watch: {
    getAccountName: {
      immediate: true,
      handler(newVal, oldVal) {
        if(newVal){
          console.log(`call logged in routine for ${newVal}`);
          this.$store.dispatch('user/loggedInRoutine', {accountname: this.getAccountName});
        }
        else{
          this.$store.dispatch('user/loggedOutRoutine');
        }
      }
    },
    getIsDark: {
      immediate: true,
      handler(newVal, oldVal) {
        console.log('night mode', this.getIsDark)
        if(newVal!==undefined && newVal != oldVal){
          this.$q.dark.set(newVal);
        }
      }
    },
  }

}
</script>

<style>
</style>
