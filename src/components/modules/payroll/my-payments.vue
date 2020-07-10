<template>
  <div>
    <q-list class="primary-hover-list" separator>
      <q-item v-for="payment in payments" :key="payment.pay_id" clickable>
        <q-item-section side>
          <q-badge>{{payment.pay_id}}</q-badge>

        </q-item-section>
        <q-item-section >
          <q-item-label>Payroll</q-item-label>
          <q-item-label caption>{{payment.payroll_tag}}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label >Amount</q-item-label>
          <q-item-label caption>{{payment.amount}}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="claim" @click="claimPayment(payment.pay_id)" color="primary" :loading="is_claiming"></q-btn>
        </q-item-section>
      </q-item>
    </q-list>
    <!-- {{payments}} -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: 'myPayments',
  props:{
    payments:{
      type: Array,
      default: ()=>[]
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getModuleByName: "group/getModuleByName"
      
      

    }),

  },
  data () {
    return {
      is_claiming: false

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
      if(res && res.transactionId && res.status == "executed"){
        let i=this.payments.findIndex(p => p.pay_id==id);
        this.payments.splice(i,1);
      }
      else{
        
      }
      this.is_claiming = false;
    }
  },

}
</script>
