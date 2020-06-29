<template>
  <q-page padding class="constrain-page-width">
    <page-header title="Payrolls" />

    <payrolls v-if="getPayrolls.length"/>




    
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import { getLogoForToken } from "../../imports/tokens.js";
import pageHeader from "components/page-header";

import payrolls from "components/modules/payroll/payrolls";


export default {
  name: 'payroll',
  components:{
    pageHeader,

    payrolls
  },
  data () {
    return {
      
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getModuleByName: "group/getModuleByName",
      getPayrolls: "payroll/getPayrolls",
      getPayments: "payroll/getPayments",
    }),
    has_payroll(){
      return this.getModuleByName("payroll");
    }
  },

  watch: {
    has_payroll: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          this.$store.dispatch("payroll/loadPayrollRoutine", newVal.slave_permission.actor);
        }
      }
    }
  }
}
</script>

