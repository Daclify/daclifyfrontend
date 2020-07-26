<template>
  <div v-if="payroll">
    <div class="row justify-between items-center overflow-hidden">
      <div class="row">
        <div class="q-mr-sm">
          <q-img :src="getLogoForToken(payroll.total_paid.contract, payroll.total_paid.quantity.split(' ')[1])" style="cursor:help;height:24px; width:24px">
            <q-tooltip content-class="bg-secondary" :delay="500">
              Payment Token: {{`${payroll.total_paid.quantity.split(' ')[1]} (${payroll.total_paid.contract})`}}
            </q-tooltip>
          </q-img>
        </div>
        <div class="q-mr-sm"><q-badge>Pay Account</q-badge> {{`${payroll.pay_permission.actor}@${payroll.pay_permission.permission}`}}</div>
        <div class="q-mr-sm"><q-badge>Total Paid</q-badge> {{payroll.total_paid.quantity}}</div>
        <div class="q-mr-sm"><q-badge>Allocated</q-badge> {{payroll.total_allocated}}</div>
        <div class="q-mr-sm"><q-badge>Balance</q-badge> {{current_balance}}</div>
      </div>
      <transition
          appear
          enter-active-class="animated fadeInRight"
          mode="out-in"
          tag="div"
        >
        <q-icon
          :color="has_enough_balance!==false?'positive':'warning'"
          :name="has_enough_balance!==false?'mdi-check':'mdi-alert'"
          size="md"
          style="cursor:help"
          :key="has_enough_balance!==false?'positive':'warning'"
        >
          <q-tooltip content-class="bg-secondary" :delay="500">
            {{has_enough_balance!==false?`${payroll.pay_permission.actor} is solvent`:`Balance insufficient to pay allocated payments, need to top up ${payroll.pay_permission.actor}`}}
          </q-tooltip>
        </q-icon>
      </transition>

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
  computed:{
    has_enough_balance(){
      //check if the pay account has enough balance to pay allocated payments
      if(this.current_balance){
        return parseFloat(this.current_balance) - parseFloat(this.payroll.total_allocated) >= 0;
      }
      
    }
  },
  methods:{
    getLogoForToken,
    async getBalance(){
      let symbol = this.payroll.total_paid.quantity.split(' ')[1];
      let res = await this.$eos.api.rpc.get_currency_balance(
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
      this.$emit('onbalance', this.current_balance);
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
