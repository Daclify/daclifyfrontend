<template>
  <div>
    <q-list class="primary-hover-list no-padding" separator bordered>
      <my-payment v-for="payment in payments" :key="payment.pay_id" :payment="payment"/>
    </q-list>
    <!-- {{payments}} -->
  </div>
</template>

<script>
import myPayment from "components/modules/payroll/my-payment";
import { mapGetters } from "vuex";
export default {
  name: 'myPayments',
  props:{
    payments:{
      type: Array,
      default: ()=>[]
    }
  },
  components:{

    myPayment
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
      if(res && res.trxid){
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
