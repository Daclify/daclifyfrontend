<template>
  <div id="q-app">
    <!-- <ual :appName= "appName" :chains="chains" :authenticators="authenticators" ref="ual-component"/> -->
    <ual ref="ual-component"/>
    <router-view />


    <q-dialog v-model="show_hub_deposit_wallet">
      <q-card class="overflow-hidden" style="min-width:300px; max-width:350px">
        <q-card-section>
            <page-header title="Daclify hub deposits"/>
            <p class="text-grey-7 text-caption">{{customHubWalletMessage}}</p>
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


import { mapGetters } from "vuex";
import {notifyError, notifySuccess} from './imports/notifications.js';
export default {
  name: 'App',
  components:{ual, hubDepositWallet, pageHeader},
  data () {
    return {
      show_hub_deposit_wallet: false,
      customHubWalletMessage:""
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
  methods:{
    showHubWallet(e){
      this.customHubWalletMessage = e || "The Daclify Hub Wallet hold your funds to perform certain actions on the hub contract. Examples are creating new groups, clapping for a group, buy NFTs, etc...";
      this.show_hub_deposit_wallet=true;
    }
  },
  created(){
    this.$root.$on('showHubDeposits', (e)=>{this.showHubWallet(e) } );

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
