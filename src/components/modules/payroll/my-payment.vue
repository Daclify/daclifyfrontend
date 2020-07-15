<template>

      <q-expansion-item clickable v-if="payment && show">
        <template v-slot:header>

          <q-item-section side >
            <q-item-label>{{payment.payroll_tag}}</q-item-label>
            <q-item-label caption><q-badge>{{payment.pay_id}}</q-badge></q-item-label>
          </q-item-section>

          <q-item-section>
          <div class="row justify-between">
            <q-item-label caption>{{payment.memo}}</q-item-label>
            <q-item-label caption>{{payment.amount}}</q-item-label>
          </div>
          </q-item-section>

          <q-item-section side>
            <q-btn label="claim" @click="claimPayment(payment.pay_id)" color="primary" :loading="is_claiming"></q-btn>
          </q-item-section>
        </template>
        <q-separator />
        <payment-details :payment="payment"/>
      </q-expansion-item>
    <!-- {{payments}} -->
</template>

<script>
import paymentDetails from "components/modules/payroll/payment-details";
import { mapGetters } from "vuex";
export default {
  name: 'myPayment',
  props:{
    payment:{}
  },
  components:{
    paymentDetails
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getModuleByName: "group/getModuleByName"
      
      

    }),

  },
  data () {
    return {
      is_claiming: false,
      show: true

    }
  },
  methods:{
    async claimPayment(id){
      this.is_claiming = true;

      let action = {
        account: this.getModuleByName("payroll").slave_permission.actor,
        name: "pay",
        data: {
          pay_id: id,
        }
      }

      //check which actions are needed transfer? open? 
      let res = await this.$store.dispatch("ual/transact", { actions: [action], disable_signing_overlay: true });
      if(res && res.trxid){
        this.show = false;
        setTimeout(()=>{
          this.$store.dispatch("payroll/fetchUserPayments", {contract: this.getModuleByName("payroll").slave_permission.actor, account: this.getAccountName})
        },2000);
      }
      else{
        
      }
      this.is_claiming = false;
    }
  },

}
</script>
