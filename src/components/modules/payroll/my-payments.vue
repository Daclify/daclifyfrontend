<template>
  <div>
    <q-list class="primary-hover-list no-padding" separator>
      <my-payment v-for="payment in payments" :key="payment.pay_id" :payment="payment"/>
      <no-items v-if="!payments.length" text="No payments" />
    </q-list>
    <!-- {{payments}} -->
  </div>
</template>

<script>
import myPayment from "components/modules/payroll/my-payment";
import noItems from "components/no-items";
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
    myPayment,
    noItems
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getModuleByName: "group/getModuleByName"
      
      

    }),

  },
  data () {
    return {


    }
  },
  methods:{}


}
</script>
