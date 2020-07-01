<template>
  <q-page v-if="getPayrolls.length" padding class="constrain-page-width">
    <page-header title="Payrolls" />
    <q-input placeholder="Find Payment" outlined v-model.trim="searchfilter" class="">
      <template v-slot:prepend>
        <q-icon name="search" class="cursor-pointer" />
      </template>
      <template v-slot:append>
        <transition
          appear
          enter-active-class="animated fadeInRight"
          leave-active-class="animated fadeOutRight"
          tag="div"
        >
          <q-icon
            v-if="searchfilter.length"
            name="close"
            key="has_filter"
            @click="searchfilter = ''"
            class="cursor-pointer"
          />
        </transition>
      </template>
    </q-input>
    <q-tabs v-model="active_payroll" class="text-primary" dense align="left">
      <q-tab
        v-for="payroll in getPayrolls"
        :key="payroll.payroll_tag"
        :label="payroll.payroll_tag"
        :name="payroll.payroll_tag"
      >
        <q-tooltip content-class="bg-secondary" :delay="700">
          {{payroll.description || 'No description'}}
        </q-tooltip>
      </q-tab>
    </q-tabs>
    <q-separator  />
    <q-card class="q-pa-sm q-my-md">
      <payroll-stats :payroll="getActivePayRoll"/>
    </q-card>

    <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title :shrink="true">Pending Payments</q-toolbar-title>
      <q-space />
      <q-btn round dense icon="mdi-plus" color="secondary" @click="add_payment_dialog=true">
        <q-tooltip content-class="bg-secondary" :delay="500">
          Add payment to payroll <b>{{getActivePayRoll.payroll_tag}}</b>
        </q-tooltip>  
      </q-btn>

    </q-toolbar>
    <q-list class="primary-hover-list" bordered separator striped>
      <payment v-for="(payment, i) in filterPayments" :key="payment.pay_id" :payment="payment" :class="i % 2 === 0 ?'':''" />
    </q-list>
    <!-- <payrolls v-if="getPayrolls.length"/> -->

<!-- {{getPayments}} -->


    <q-dialog v-model="add_payment_dialog">
      <q-card class="overflow-hidden" style="min-width:350px">
        <q-card-section >
            <page-header :title="`Payroll ${getActivePayRoll.payroll_tag}`"/>
            <q-btn icon="close" flat round dense v-close-popup class="q-ma-md absolute-top-right"/>

        <action-proposer>
          <template slot-scope="scope">
            <add-payment @propose="scope.propose" @addtobucket="scope.addtobucket" :payroll="getActivePayRoll" />
          </template>
        </action-proposer>

           
        </q-card-section>
      </q-card>
    </q-dialog>

    
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import { getLogoForToken } from "../../imports/tokens.js";
import pageHeader from "components/page-header";
import actionProposer from "components/actions/action-proposer";
import addPayment from "components/modules/payroll/add-payment";

import payment from "components/modules/payroll/payment";
import payrollStats from "components/modules/payroll/payroll-stats";

export default {
  name: 'payroll',
  components:{
    pageHeader,
    payrollStats,
    payment,
    actionProposer,
    addPayment
  },
  data () {
    return {
      active_payroll: '',
      searchfilter: '',
      add_payment_dialog: false
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
    },
    filterPayments(){
      if(!this.getPayments.length || !this.active_payroll) return [];

      let payments = this.getPayments.filter(p=>p.payroll_tag==this.active_payroll);
      if(this.searchfilter){
        payments = payments.filter(p=>p.receiver.includes(this.searchfilter) || p.pay_id ==this.searchfilter );
      }
      return payments;
    },
    getActivePayRoll(){
      return this.getPayrolls.find(p=>p.payroll_tag == this.active_payroll);
    }
  },
  methods:{

  },

  watch: {
    has_payroll: {
      immediate: true,
      async handler(newVal, oldVal) {
        if (newVal) {
          this.$store.dispatch("payroll/loadPayrollRoutine", newVal.slave_permission.actor);
        }
      }
    },
    getPayrolls:{
      immediate: true,
      async handler(newVal, oldVal) {
        if (newVal && newVal.length) {
          this.active_payroll = this.getPayrolls[0].payroll_tag;
        }
      } 
    }
  }
}
</script>



