<template>
  <div >
    <q-card>
      <q-card-section>
        <p>Register as candidate. <span v-if="getcandidateStakeConfig.amount > 0">You need to lockup a minimum of {{getcandidateStakeConfig.quantity}} to be eligible for registration.</span></p>
        <q-input v-if="getcandidateStakeConfig.amount > 0" v-model="quantity" type="number" label="candidate stake" outlined>
          <template v-slot:append>
            {{getcandidateStakeConfig.symbol}}
          </template>
        </q-input>
        <div class="row justify-end q-mt-md q-pb-xs">
          <q-btn label="register" color="primary" @click="regCand" :loading="is_registering"/>
        </div>
        
      </q-card-section>
    candidate {{getIsCandidate}}
    stakes: {{getUserStakes}}
    {{getcandidateStakeConfig}}
    </q-card>
  </div>
</template>


<script>
import { mapGetters } from "vuex";

export default {
  name: "registerCandidate",
  components: {

  },
  data() {
    return {
      quantity: "",
      is_registering: false
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getIsCandidate: "elections/getIsCandidate",
      getUserStakes: "elections/getUserStakes",
      getElectionsContract: "elections/getElectionsContract",
      getcandidateStakeConfig: "elections/getcandidateStakeConfig"

    })
  },
  methods: {
    async regCand(){
      this.is_registering =true;
      let dummy = 0;
      dummy = dummy.toFixed(this.getcandidateStakeConfig.precision)+ " "+this.getcandidateStakeConfig.symbol;

      let openstake = {
        account: this.getElectionsContract,
        name: "openstake",
        data:{
          member: this.getAccountName,
          stakeasset: {contract:this.getcandidateStakeConfig.contract, quantity: dummy}
        }
      }

      let transferstake = {
        account: this.getcandidateStakeConfig.contract,
        name: "transfer",
        data:{
          from: this.getAccountName,
          to: this.getElectionsContract,
          quantity: this.quantity+ " "+this.getcandidateStakeConfig.symbol,
          memo: "candidate stake"
        }
      }

      let register = {
        account: this.getElectionsContract,
        name: "regcand",
        data:{
          account: this.getAccountName
        }
      }
      let actions = [];
      actions.push(openstake);
      actions.push(transferstake);
      actions.push(register);

      let res = await this.$store.dispatch("ual/transact", { actions: actions, disable_signing_overlay: true });
      if(res && res.trxid){
        console.log("add candidate")
        this.$store.commit('elections/addCandidate', this.getAccountName);
        this.$emit("navigate", "manage candidacy");
      }
      else{
        //return false;
      }
      this.is_registering=false;

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
    quantity: function(newV, oldV){
      if(newV !=''){
        this.quantity = Number(this.quantity).toFixed(this.getcandidateStakeConfig.precision)
      }
    }

  }

};
</script>