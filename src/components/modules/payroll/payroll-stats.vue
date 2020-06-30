<template>
  <div v-if="payroll">
    <div class="row">
      <div class="q-mr-sm"><q-badge>Pay Account</q-badge> {{`${payroll.pay_permission.actor}@${payroll.pay_permission.permission}`}}</div>
      <div class="q-mr-sm"><q-badge>Total Paid</q-badge> {{payroll.total_paid.quantity}}</div>
      <div class="q-mr-sm"><q-badge>Allocated</q-badge> {{payroll.total_allocated}}</div>
      <div class="q-mr-sm"><q-badge>Balance</q-badge> {{current_balance}}</div>
    </div>
  </div>
</template>

<script>
import { getLogoForToken } from "../../../imports/tokens.js";
export default {
  name: "payrollStats",
  props: {
    payroll: false,
    
  },
  data() {
    return {
      current_balance: ''
    };
  },
  methods:{
    getLogoForToken,
    async getBalance(){
      let symbol = this.payroll.total_paid.quantity.split(' ')[1];
      let res = await this.$eos.rpc.get_currency_balance(
        this.payroll.total_paid.contract, 
        this.payroll.pay_permission.actor,
        symbol
        )
      if(res && res.length){
        this.current_balance = res[0]
      }
      else{
        this.current_balance = `0 ${symbol}`
      }
    }
  },
  watch: {
    payroll: {
      immediate: true,
      async handler(newVal, oldVal) {
        if (newVal) {
          this.getBalance();
        }
      }
    }

  }
};
</script>
