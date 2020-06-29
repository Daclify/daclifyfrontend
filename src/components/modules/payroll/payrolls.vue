<template>
  <!-- getLogoForToken(contract, symbol) -->
  <div v-if="getPayrolls.length && getPayrolls">

    <q-tabs v-model="active_payroll" class="text-primary q-mt-md" dense align="left">
      <q-tab
        v-for="payroll in getPayrolls"
        :key="payroll.payroll_tag"
        :label="payroll.payroll_tag"
        :name="payroll.payroll_tag"
      />
    </q-tabs>
    <q-separator class="q-mb-md" />
    
    <q-input placeholder="Find Payment" outlined v-model.trim="searchfilter" class="q-mt-md">
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
      <!-- <template v-slot:after>
        <div>
          <span>#{{candidates.length}}</span>
          <q-tooltip :delay="250" content-class="bg-primary">{{candidates.length}} Active Candidates</q-tooltip>
        </div>
      </template> -->
    </q-input>

    <q-tab-panels
      v-model="active_payroll"
      animated
      transition-prev="scale"
      transition-next="scale"
      class="bg-transparent"
    >
      <q-tab-panel
        v-for="payroll in getPayrolls"
        :key="'p' + payroll.payroll_tag"
        :name="payroll.payroll_tag"
        class="no-padding overflow-hidden "
      >
        <div class="text-caption text-grey">{{ payroll.description || "No description" }}</div>
        <div class="row q-gutter-md">
          <q-item class="no-padding">
            <q-item-section avatar>
              <q-avatar size="36px">
                <q-img :src="getLogoForToken(payroll.total_paid.contract, payroll.total_paid.quantity.split(' ')[1])" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{payroll.total_paid.quantity.split(' ')[1]}}</q-item-label>
              <q-item-label caption>{{payroll.total_paid.contract}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="no-padding">
            <!-- <q-item-section avatar>
                <q-icon name="mdi-account" />
            </q-item-section> -->
            <q-item-section>
              <q-item-label>Pay Account</q-item-label>
              <q-item-label caption>{{`${payroll.pay_permission.actor}@${payroll.pay_permission.permission}`}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item class="no-padding">
            <!-- <q-item-section avatar>
              <q-icon name="mdi-cash-refund" />
            </q-item-section> -->
            <q-item-section>
              <q-item-label>Total Paid</q-item-label>
              <q-item-label caption>{{payroll.total_paid.quantity}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item class="no-padding">
            <!-- <q-item-section avatar>
              <q-icon name="mdi-cash-lock" />
            </q-item-section> -->
            <q-item-section>
              <q-item-label>Total Allocated</q-item-label>
              <q-item-label caption>{{payroll.total_allocated}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item class="no-padding">
            <!-- <q-item-section avatar>
              <q-avatar size="36px">
                <q-icon name="mdi-cash-check" />
              </q-avatar>
            </q-item-section> -->
            <q-item-section>
              <q-item-label>Balance</q-item-label>
              <q-item-label caption>todo</q-item-label>
            </q-item-section>
          </q-item>

        </div>
      </q-tab-panel>
    </q-tab-panels>
    <!-- <q-separator class="q-mb-md" /> -->

    <transition-group
    v-if="getPayments"
      appear
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
      mode="out-in"
      class="primary-hover-list"
      tag="q-list"
    >
      <q-item v-for="payment in getPayments" :key="payment.pay_id" clickable>
        <q-item-section avatar>
            <profile-pic :size="42" icon="" iconColor="positive" :account="payment.receiver"  />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-capitalize">{{payment.receiver}}</q-item-label>
          <q-item-label caption>{{payment.amount}}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-capitalize">Due date</q-item-label>
          <q-item-label caption>{{payment.due_date}}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-capitalize">Repeat</q-item-label>
          <q-item-label caption>{{payment.repeat}}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-icon name="delete" color="negative" size="24px"/>
        </q-item-section>

      </q-item>

    </transition-group>


  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getLogoForToken } from "../../../imports/tokens.js";
import profilePic from "components/profile-pic";

export default {
  name: "payrolls",
  components: {
    profilePic
  },
  data() {
    return {
      active_payroll: this.$store.state.payroll.payrolls[0].payroll_tag,
      searchfilter: ''
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getPayrolls: "payroll/getPayrolls",
      getPayments: "payroll/getPayments",
      getModuleByName: "group/getModuleByName"
    })
    // has_payroll(){
    //   return this.getModuleByName("payroll");
    // }
  },
  methods: {
    getLogoForToken,
    select_payroll(tag) {
      this.dropdown_label = tag;
    }
  }

  // watch: {
  //   has_payroll: {
  //     immediate: true,
  //     handler(newVal, oldVal) {
  //       if (newVal) {
  //         this.$store.dispatch("payroll/loadPayrollRoutine", newVal.slave_permission.actor);
  //       }
  //     }
  //   }
  // }
};
</script>
