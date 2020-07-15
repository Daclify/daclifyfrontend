<template>
  <div>
    <q-list class="primary-hover-list no-padding" separator bordered>
      <my-payment v-for="payment in payments" :key="payment.pay_id" :payment="payment"/>
      <q-item>
        <q-item-section v-if="!payments.length">
          <q-item-label>No payments</q-item-label>
        </q-item-section>
      </q-item>
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


    }
  },
  methods:{}


}
</script>
