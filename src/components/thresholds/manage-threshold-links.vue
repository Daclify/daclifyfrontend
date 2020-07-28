<template>
  <q-card>
    <!-- {{ getThresholdLinksWithFilter }} -->
    <q-toolbar class="bg-secondary text-white shadow-2">
      <q-toolbar-title :shrink="true">
        <span v-if="add_threshold_link">Add Threshold Link</span>
        <span v-else>Threshold Action Links</span>

      </q-toolbar-title>
      <q-space />
      <q-btn
        round
        dense
        :icon="add_threshold_link ? 'mdi-minus' : 'mdi-plus'"
        color="primary"
        @click="add_threshold_link = !add_threshold_link"
      >
        <q-tooltip content-class="bg-secondary" :delay="500">
          <span v-if="!add_threshold_link">Add threshold link</span>
          <span v-else>Go back to threshold links</span>
        </q-tooltip>
      </q-btn>
    </q-toolbar>
    <transition
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
      mode="out-in"
      tag="div"
    >
      <div v-if="!add_threshold_link" key="thresholds">
        <q-list
          v-if="getThresholdLinksWithFilter.length"
          class="primary-hover-list"
          separator
          striped
        >
          <q-item
            v-for="link in getThresholdLinksWithFilter"
            :key="link.contract + link.action_name"
            clickable
          >
            <q-item-section side>
              <q-item-label>
                <q-badge>{{ link.contract }}::<b>{{ link.action_name }}</b></q-badge>
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>
                Threshold: {{ link.threshold_name }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <no-items v-if="!getThresholdLinksWithFilter.length" text="No links found"/>
        </q-list>
        <q-list v-else separator striped>
          <no-items text="All actions require the default threshold"/>
        </q-list>
      </div>
      <div v-else class="relative-position" key="add">
        <!-- <q-btn icon="close"  round dense  class="q-ma-md " @click="add_payment_view=false"/> -->
        <q-card-section>
          <action-proposer>
            <template slot-scope="scope">
              <add-threshold-link @propose="scope.propose" @addtobucket="scope.addtobucket"/>
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
import addThresholdLink from 'components/thresholds/add-threshold-link';
import noItems from "components/no-items";
export default {
  name: "manageThresholds",
  components: {
    actionProposer,
    addThresholdLink,
    noItems
  },
  data() {
    return {
      add_threshold_link: false
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
    getThresholdLinksWithFilter() {
      return this.getThresholdLinks;
    }
  },
  methods: {}
};
</script>
