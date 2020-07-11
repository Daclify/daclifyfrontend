<template>
  <div class="q-col-gutter-md q-pb-xs">
    <q-input v-model="action.data.payer" label="payer" outlined bottom-slots readonly />
    <q-input
      v-model="action.data.receiver"
      label="receiver"
      outlined
      bottom-slots
      readonly
    />
    <q-input
      ref="quant"
      type="number"
      v-model="action.data.quant"
      label="quantity"
      outlined
      bottom-slots
      placeholder="eos amount"
      no-error-icon
      :rules="[
        val => !!val || '* Required',
        val => val > 0 || 'Must be greater then zero',
        validateAmount
        ]"
    >
      <template v-slot:append>
        {{symbol}}
      </template>
    </q-input>

    <div class="row justify-between" >
      <threshold-badge  label :contract="action.account" :action_name="action.name"/>
      <propose-bucket-btn @click-propose="emitPropose" @click-bucket="emitBucket" label="buy ram" :disabled="false" />
    </div>
    <!-- <pre>{{getGroupWallet}}</pre> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import thresholdBadge from "components/thresholds/threshold-badge";
import proposeBucketBtn from "components/actions/propose-bucket-btn";
import {
  isValidAccountName,
  isExistingAccountName
} from "../../imports/validators";

export default {
  name: "buyRam",
  components:{
    thresholdBadge,
    proposeBucketBtn
  },
  data() {
    return {
      formIsValidated: false,
      token_contract: "eosio.token",
      symbol: "EOS",
      action:{
        account: "eosio",
        name: "buyram",
        data: {
          payer: this.$store.state.group.activeGroup,
          receiver: this.$store.state.group.activeGroup,
          quant: ""
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      getActiveGroup: 'group/getActiveGroup',
      getGroupWallet: "group/getGroupWallet"
    })
  },
  methods: {

    getPaymentToken(){
      return this.getGroupWallet.find(t=> t.contract==this.token_contract && t.symbol==this.symbol );
    },
    validateAmount(v){
      // console.log(v)
      let token_from_group_wallet = this.getPaymentToken();
      // console.log(token_from_group_wallet)
      if(!token_from_group_wallet){
        return `Group doesn't have ${this.symbol} in wallet`;
      }
      else{
        if(Number(v) > Number(token_from_group_wallet.amount) ){
          return `Group only has ${token_from_group_wallet.amount} ${this.symbol}`;
        }
        else{
 
          return true;
        }
      }
    },

    emitPropose(){
      this.$refs.quant.validate()
      if(this.$refs.quant.hasError){
        return;
      }
      let action = JSON.parse(JSON.stringify(this.action))
      action.data.quant = action.data.quant+" "+this.symbol;

      const payload = {
        actions: [action],
        description: `Proposal to buy extra ram for "${this.getActiveGroup}"`,
        title: 'Buy Ram'     
      }
      this.$emit('propose', payload);
    },
    emitBucket(){
      this.$refs.quant.validate()
      if(this.$refs.quant.hasError){
        return;
      }
      let action = JSON.parse(JSON.stringify(this.action))
      action.data.quant = action.data.quant+" "+this.symbol;
      this.$emit('addtobucket', action);     
    }
  },
  watch: {
    "action.data.quant": function(newV, oldV) {
      if (this.action.data.quant && this.getPaymentToken()) {
        this.action.data.quant = Number(this.action.data.quant).toFixed(this.getPaymentToken().precision);
      }
    }
  }
};
</script>
