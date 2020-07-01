<template>
  <div class="row  q-pb-xs">
    <!-- {{payroll}} -->
    <div class="col-xs-6 q-pr-xs">
      <q-input
        v-model="action.data.receiver" 
        label="receiver" 
        outlined 
        bottom-slots
        maxlength="12"
        :rules="[
          val => !!val || '* Required',
          isValidAccountName,
          isExistingAccountName
          ]"
      />
    </div>

    <div class="col-xs-6 q-pl-xs">
      <q-input
        ref="amount"
        type="number"
        v-model="action.data.amount"
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
          {{payroll.total_paid.quantity.split(' ')[1]}}
        </template>
      </q-input>
    </div>

    <div class="col-xs-6 q-pr-xs">
      <q-input
        v-model="action.data.due_date" 
        label="due date" 
        outlined 
        bottom-slots
      />
    </div>

    <div class="col-xs-6 q-pl-xs">
      <q-input
        v-model="action.data.repeat" 
        label="repeat" 
        outlined 
        bottom-slots
      />
    </div>

    <div class="row justify-between full-width items-center" >
      <threshold-badge  label :contract="action.account" :action_name="action.name"/>
      <propose-bucket-btn @click-propose="emitPropose" @click-bucket="emitBucket" label="Add Payment" :disabled="false" />
    </div>
    <!-- <pre>{{getGroupWallet}}</pre> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import thresholdBadge from "components/threshold-badge";
import proposeBucketBtn from "components/actions/propose-bucket-btn";
import {
  isValidAccountName,
  isExistingAccountName
} from "../../../imports/validators";

export default {
  name: "addPayment",
  components:{
    thresholdBadge,
    proposeBucketBtn
  },
  props:{
    payroll: false
  },
  data() {
    return {
      formIsValidated: false,
      token_contract: "eosio.token",
      symbol: "EOS",
      action:{
        account: "",
        name: "paymentadd",
        data: {
          payroll_tag: this.payroll.payroll_tag,
          receiver: "",
          amount: "",
          due_date:"",
          repeat:1
        },
        authorization:[]
      }
    }
  },
  computed: {
    ...mapGetters({
      getActiveGroup: 'group/getActiveGroup',
      getGroupWallet: "group/getGroupWallet",
      getModuleByName: "group/getModuleByName",
    })
  },
  methods: {
    isValidAccountName,
    isExistingAccountName,
    validateAmount(v){

        // if(Number(v) > Number(token_from_group_wallet.amount) ){
        //   return `Group only has ${token_from_group_wallet.amount} ${this.symbol}`;
        // }
        // else{
        //   return true;
        // }
      
    },

    emitPropose(){
      this.$refs.amount.validate()
      if(this.$refs.amount.hasError){
        return;
      }
      let action = JSON.parse(JSON.stringify(this.action))
      action.data.amount = action.data.amount+" "+this.symbol;

      const payload = {
        actions: [action],
        description: `Proposal to add to payroll "${this.payroll.payroll_tag}"`,
        title: 'Add to payroll'     
      }
      this.$emit('propose', payload);
    },
    emitBucket(){
      this.$refs.amount.validate()
      if(this.$refs.amount.hasError){
        return;
      }
      let action = JSON.parse(JSON.stringify(this.action))
      action.data.amount = action.data.amount+" "+this.symbol;
      this.$emit('addtobucket', action);     
    }
  },
  mounted(){
    let payroll_module = this.getModuleByName("payroll");
    this.action.account = payroll_module.slave_permission.actor;
    this.action.authorization.push(payroll_module.slave_permission);
    this.symbol = this.payroll.total_paid.quantity.split(' ')[1];
  },
  watch: {
    "action.data.amount": function(newV, oldV) {
      if (this.action.data.amount ) {
        this.action.data.amount = this.action.data.amount //Number(this.action.data.quant).toFixed(this.getPaymentToken().precision);
      }
    }
  }
};
</script>
