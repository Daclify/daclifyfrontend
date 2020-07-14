<template>
  <div >
    <q-card >
      <q-card-section >
        <div class="row items-center">

          <q-item class="">
            <q-item-section>
              <q-item-label>Candidate since</q-item-label>
              <q-item-label caption><date-string :date="getIsCandidate.registered" /></q-item-label>
            </q-item-section>
          </q-item>

          <q-item class="">
            <q-item-section>
              <q-item-label>My stake</q-item-label>
              <q-item-label caption v-if="getUserCandidateStake">{{getUserCandidateStake.quantity}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item class="">
            <q-item-section>
              <q-item-label>My votes</q-item-label>
              <q-item-label caption >{{getIsCandidate.total_votes}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-if="getElectionsConfig && !!parseFloat(getElectionsConfig.max_pay.quantity)">
            <q-item-section>
              <q-item-label>My pay</q-item-label>
              <q-item-label caption >{{getIsCandidate.pay.quantity}}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div>
         <update-pay />
        </div>
        <!-- {{getElectionsConfig.max_pay.quantity}}
        {{getElectionsConfig}} -->
        <div class="row justify-end q-mt-md q-pb-xs">
          <!-- <q-btn label="update pay" color="primary" @click="" :loading="is_unregistering"/> -->
          <q-btn :label="getIsCandidate.state==1 ? 'pause campaign' : 'resume campaign'" color="primary" @click="pauseCampaign" :loading="is_pausing" class="q-ml-md"/>
          <q-btn label="unregister" color="primary" @click="unregCand" class="q-ml-md" :loading="is_unregistering"/>
        </div>
        
      </q-card-section>
    </q-card>
  </div>
</template>


<script>
import { mapGetters } from "vuex";
import dateString from "components/date-string";
import updatePay from "components/modules/elections/update-pay"

export default {
  name: "manageCandidacy",
  components: {
    dateString,
    updatePay
  },
  data() {
    return {
      is_pausing: false,
      is_unregistering: false
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getIsCandidate: "elections/getIsCandidate",
      getUserStakes: "elections/getUserStakes",
      getElectionsContract: "elections/getElectionsContract",
      getcandidateStakeConfig: "elections/getcandidateStakeConfig",
      getUserCandidateStake: "elections/getUserCandidateStake",
      getElectionsConfig: "elections/getElectionsConfig"

    })
  },
  methods: {
    async unregCand(){
      this.is_unregistering=true;
      let unreg = {
        account: this.getElectionsContract,
        name: "unregcand",
        data:{
          candidate: this.getAccountName
        }
      }
      let actions = [unreg];
      let res = await this.$store.dispatch("ual/transact", { actions: actions, disable_signing_overlay: true });
      if(res && res.trxid){
        this.$store.commit("elections/removeCandidate", this.getAccountName);
        this.$emit("navigate", "register candidacy");
      }
      this.is_unregistering=false;
    },
    async pauseCampaign(){
      this.is_pausing=true;
      let new_cand_state = this.getIsCandidate.state == 1
      let pausecampaig = {
        account: this.getElectionsContract,
        name: "pausecampaig",
        data:{
          candidate: this.getAccountName,
          paused: new_cand_state
        }
      }

      let actions = [pausecampaig];
      let res = await this.$store.dispatch("ual/transact", { actions: actions, disable_signing_overlay: true });
      if(res && res.trxid){
        this.$store.commit("elections/togglePauseCampaign", this.getAccountName);
      }
      this.is_pausing=false;
    },
    async fetchUserStakes(){
      if(!this.getUserStakes && this.getAccountName){
        await this.$store.dispatch("elections/fetchUserStakes",{});
      }
    }
  },
  mounted(){

  },
  watch: {
    getAccountName: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          if(newVal != oldVal){
            this.fetchUserStakes();
          }
        }
        else{
          this.$store.commit("elections/setUserStakes", false);
        }
      }
    },

  }

};
</script>