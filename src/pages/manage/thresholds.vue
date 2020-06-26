<template>
  <q-page padding class="constrain-page-width">
    <page-header title="Thresholds"/>
    <q-list>
      <q-item v-for="threshold in getThresholdsWithFilter" :key="threshold.threshold_name">
        <q-item-section>
          <q-item-label>{{threshold.threshold_name}}</q-item-label>
          <q-item-label caption>Required votes: {{threshold.threshold}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <page-header title="Threshold Links" class="q-mt-xl"/>
    <q-list>
      <q-item v-for="link in getThresholdLinksWithFilter" :key="link.contract+link.action_name">
        <q-item-section>
          <q-item-label>{{link.contract}} > {{link.action_name}}</q-item-label>
          <q-item-label caption>Threshold: {{link.threshold_name}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>    
    <!-- {{getThresholds}} -->
    <!-- {{getThresholdLinks}} -->
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import thresholdManager from 'components/threshold-manager';
import pageHeader from "components/page-header";


export default {
  name: 'groupThresholds',
  components:{
    pageHeader,
    thresholdManager

  },
  data () {
    return {

 
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getThresholds: "group/getThresholds",
      getActiveGroup: "group/getActiveGroup",
      //getActiveGroupConfig: "group/getActiveGroupConfig",
      getThresholdLinks: "group/getThresholdLinks"
    }),
    getThresholdsWithFilter(){
      return this.getThresholds;
    },
    getThresholdLinksWithFilter(){
      return this.getThresholdLinks;
    }

  },
}
</script>
