<template>
  <q-card>
    <!-- {{getThresholdsWithFilter}} -->
    <q-toolbar class="bg-secondary text-white shadow-2">
      <q-toolbar-title :shrink="true">
        <span v-if="add_threshold_view">Manage Thresholds</span>
        <span v-else>Thresholds</span>
      </q-toolbar-title>
      <q-space />
      <q-btn
        round
        dense
        :icon="add_threshold_view ? 'mdi-minus' : 'mdi-plus'"
        color="primary"
        @click="add_threshold_view = !add_threshold_view"
      >
        <q-tooltip content-class="bg-secondary" :delay="500">
          <span v-if="!add_threshold_view">manage thresholds</span>
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
              <q-item-label caption>
                Required votes: {{ threshold.threshold }}
              </q-item-label>
            </q-item-section>
            <q-item-section side v-if="threshold.threshold_name=='default'">
              <q-badge color="secondary">
                dynamic
                <q-tooltip content-class="bg-primary" :delay="500">
                  dynamic thresholds update automatically in function of the number of active guardians
                </q-tooltip>
              </q-badge>
            </q-item-section>
          </q-item>
        </q-list>
        <q-list v-else separator striped>
          <q-item>
            <q-item-label caption>No thresholds</q-item-label>
          </q-item>
        </q-list>
      </div>
      <div v-else class="relative-position" key="add">
        <!-- <q-btn icon="close"  round dense  class="q-ma-md " @click="add_payment_view=false"/> -->
        <q-card-section>
          <action-proposer>
            <template slot-scope="scope">
              <add-threshold @propose="scope.propose" @addtobucket="scope.addtobucket" />
            </template>
          </action-proposer>
        </q-card-section>
      </div>
    </transition>

    <!-- {{getThresholds}} -->
  </q-card>
</template>

<script>
import { mapGetters } from "vuex";
import actionProposer from "components/actions/action-proposer";
import addThreshold from "components/thresholds/add-threshold";
export default {
  name: "manageThresholds",
  components: {
    actionProposer,
    addThreshold
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
