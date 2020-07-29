<template>
  <q-page  padding class="constrain-page-width">
    <page-header title="Payrolls" />
    <div v-if="getPayrolls.length">
    <q-input placeholder="Find Payment" outlined v-model.trim="searchfilter" class="" @input="add_payment_view= false">
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
      <payroll-stats :payroll="getActivePayRoll" @onbalance="active_payroll_balance = $event" />
    </q-card>

    <q-card>
      <q-toolbar class="bg-secondary text-white shadow-2">
        <q-toolbar-title :shrink="true">
            <span v-if="!add_payment_view">Pending Payments</span>
            <span v-else>Add Payment</span>
            <span class="text-caption"> ({{getActivePayRoll.payroll_tag}})</span>
        </q-toolbar-title>
        <q-space />
        <q-btn round dense :icon="add_payment_view?'mdi-minus':'mdi-plus'" color="primary" @click="add_payment_view=!add_payment_view">
          <q-tooltip content-class="bg-secondary" :delay="500">
            <span v-if="!add_payment_view">Add payment to payroll <b>{{getActivePayRoll.payroll_tag}}</b></span>
            <span v-else>Go back to pending payments</span>
          </q-tooltip>  
        </q-btn>
      </q-toolbar>
      <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut" mode="out-in" tag="div" >
      <div v-if="!add_payment_view" key="payments">
        <q-list v-if="filterPayments.length"  class="primary-hover-list" separator striped>
          <payment v-for="(payment, i) in filterPayments" :key="payment.pay_id" :payment="payment" :class="i % 2 === 0 ?'':''" />
        </q-list>
        <q-list v-else bordered separator striped>
          <no-items  text="No payments" />
        </q-list>
      </div>
      <div v-else class="relative-position" key="add">
          <!-- <q-btn icon="close"  round dense  class="q-ma-md " @click="add_payment_view=false"/> -->
          <action-proposer>
            <template slot-scope="scope">
              <add-payment @propose="scope.propose" @addtobucket="scope.addtobucket" :payroll="getActivePayRoll" :currentbalance="active_payroll_balance"/>
            </template>
          </action-proposer>
      </div>
      </transition>
    </q-card>
    </div>
    <q-card v-else>
      <q-card-section>
        No payrolls configured yet.
      </q-card-section>
    </q-card>
  
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import { getLogoForToken } from "../../imports/tokens.js";
import pageHeader from "components/page-header";
import actionProposer from "components/actions/action-proposer";
import addPayment from "components/modules/payroll/add-payment";
import noItems from "components/no-items";

import payment from "components/modules/payroll/payment";
import newPayroll from "components/modules/payroll/new-payroll";
import payrollStats from "components/modules/payroll/payroll-stats";

export default {
  name: 'payroll',
  components:{
    pageHeader,
    payrollStats,
    payment,
    actionProposer,
    addPayment,
    noItems,
    newPayroll
  },
  data () {
    return {
      active_payroll: '',
      searchfilter: '',
      add_payment_view: false,
      active_payroll_balance: "",
      new_payroll_view: false
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



