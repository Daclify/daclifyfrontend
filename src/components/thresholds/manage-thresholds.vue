<template>
  <div class="">
    {{getThresholdsWithFilter}}
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title :shrink="true">
        <span>Thresholds</span>
      </q-toolbar-title>
      <q-space />
      <q-btn
        round
        dense
        :icon="add_threshold_view ? 'mdi-minus' : 'mdi-plus'"
        color="secondary"
        @click="add_threshold_view = !add_threshold_view"
      >
        <q-tooltip content-class="bg-secondary" :delay="500">
          <span v-if="!add_threshold_view">Add threshold</span>
          <span v-else>Go back to thresholds</span>
        </q-tooltip>
      </q-btn>
    </q-toolbar>
    <transition
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
      mode="out-in"
      tag="div"
    >
      <div v-if="!add_threshold_view" key="thresholds">
        <q-list
          v-if="getThresholdsWithFilter.length"
          class="primary-hover-list"
          bordered
          separator
          striped
        >
          <q-item
            v-for="threshold in getThresholdsWithFilter"
            :key="threshold.threshold_name"
            clickable
          >
            <q-item-section side>
              <q-badge>{{ threshold.threshold_name }}</q-badge>
            </q-item-section>
            <q-item-section>
              <q-item-label caption
                >Required votes: {{ threshold.threshold }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
        <q-list v-else bordered separator striped>
          <q-item>
            <q-item-label caption>No thresholds</q-item-label>
          </q-item>
        </q-list>
      </div>
      <div v-else class="relative-position" key="add">
        <!-- <q-btn icon="close"  round dense  class="q-ma-md " @click="add_payment_view=false"/> -->
        <action-proposer>
          <template slot-scope="scope">
            <!-- <add-payment @propose="scope.propose" @addtobucket="scope.addtobucket" :payroll="getActivePayRoll" :currentbalance="active_payroll_balance"/> -->
          </template>
        </action-proposer>
      </div>
    </transition>

    <!-- {{getThresholds}} -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import actionProposer from "components/actions/action-proposer";
export default {
  name: "manageThresholds",
  components: {
    actionProposer
  },
  data() {
    return {
      add_threshold_view: false
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getThresholds: "group/getThresholds",
      getActiveGroup: "group/getActiveGroup",
      getActiveGroupConfig: "group/getActiveGroupConfig",
      getThresholdLinks: "group/getThresholdLinks"
    }),
    getThresholdsWithFilter() {
      return this.getThresholds;
    }
  },
  methods: {}
};
</script>
