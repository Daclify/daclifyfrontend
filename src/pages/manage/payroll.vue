<template>
  <q-page v-if="getPayrolls.length" padding class="constrain-page-width">
    <page-header title="Payrolls" />
    <q-input placeholder="Find Payment" outlined v-model.trim="searchfilter" class="">
      <template v-slot:prepend>
        <q-icon name="search" class="cursor-pointer" />
      </template>
      <template v-slot:append>
        <transition-group
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
        </transition-group>
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
      <q-btn flat round dense icon="more_vert" />
      <!-- <q-btn-dropdown round flat dense icon="more_vert">
        <q-list>
          <q-item-label header>Folders</q-item-label>
          <q-item v-for="n in 3" :key="`x.${n}`" clickable v-close-popup tabindex="0">
            <q-item-section avatar>
              <q-avatar icon="folder" color="secondary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Photos</q-item-label>
              <q-item-label caption>February 22, 2016</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown> -->
    </q-toolbar>
    <q-list class="primary-hover-list" bordered separator striped>
      <payment v-for="(payment, i) in filterPayments" :key="payment.pay_id" :payment="payment" :class="i % 2 === 0 ?'':''" />
    </q-list>
    <!-- <payrolls v-if="getPayrolls.length"/> -->

<!-- {{getPayments}} -->


    
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import { getLogoForToken } from "../../imports/tokens.js";
import pageHeader from "components/page-header";

import payment from "components/modules/payroll/payment";
import payrollStats from "components/modules/payroll/payroll-stats";

export default {
  name: 'payroll',
  components:{
    pageHeader,
    payrollStats,
    payment
  },
  data () {
    return {
      active_payroll: '',
      searchfilter: ''
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



