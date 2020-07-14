<template>
  <div>
    <q-input
      :disable="parseFloat(getElectionsConfig.max_pay.quantity)<=0"
      outlined
      type="number"
      ref="newpay"
      label="update pay"
      bottom-slots
      v-model="new_pay"
      :rules="[
        validateNewPay
      ]"


    >
      <template v-slot:append>
        {{ getElectionsConfig.max_pay.quantity.split(" ")[1] }}
      </template>
      <template v-slot:after>
              <q-btn label="update" color="primary" :loading="is_updating" :disabled="!can_update_pay" @click="updatePay"/>
      </template>

    </q-input>
    <!-- {{getUserCandidateStake}} -->
    <!-- {{getIsCandidate}} -->
    <!-- {{getElectionsConfig}} -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: 'updatePay',
  data() {
    return {
      new_pay: '',
      is_updating: false,
      is_validated: false
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getUserStakes: "elections/getUserStakes",
      getElectionsContract: "elections/getElectionsContract",
      getcandidateStakeConfig: "elections/getcandidateStakeConfig",
      getIsCandidate: "elections/getIsCandidate",
      getUserCandidateStake: "elections/getUserCandidateStake",
      getElectionsConfig: "elections/getElectionsConfig"

    }),
    can_update_pay(){
      if(parseFloat(this.new_pay) != parseFloat(this.getIsCandidate.pay.quantity) && this.is_validated ){
        return true;
      }
    }
  },
  methods:{
    async updatePay(){
      this.is_updating = true;
      let action = {
        account: this.getElectionsContract,
        name: "updatepay",
        data:{
          candidate: this.getAccountName,
          new_pay: {contract:this.getElectionsConfig.max_pay.contract, quantity: this.new_pay+" "+this.getElectionsConfig.max_pay.quantity.split(" ")[1]},

        }
      };
      let res = await this.$store.dispatch("ual/transact", { actions: [action], disable_signing_overlay: true });
      if(res && res.trxid){
        this.$store.commit('elections/updateCandidatePay', {cand: this.getAccountName, new_pay: action.data.new_pay});
      }
      else{
      }
      this.is_updating = false;
    },
    validateNewPay(v){
      if(v <= parseFloat(this.getElectionsConfig.max_pay.quantity) ){
        this.is_validated=true;
        return true;
      }
      else{
        this.is_validated=false;
        return `must be smaller then max pay ${this.getElectionsConfig.max_pay.quantity}`
      }  
    }
  },
  mounted(){
    this.new_pay = parseFloat(this.getIsCandidate.pay.quantity)
  },
  watch:{
    new_pay: function(newV,oldV){
      let [amount, symbol] = this.getElectionsConfig.max_pay.quantity.split(' ');
      let decimals=amount.split('.')[1];
      let precision = decimals ? decimals.length : 0;
      this.new_pay = Number(this.new_pay).toFixed(precision);
    }
  }
};
</script>
