<template>
  <q-page padding class="constrain-page-width">

    <manage-thresholds />



    <manage-threshold-links />






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


import manageThresholds from 'components/thresholds/manage-thresholds';
import manageThresholdLinks from 'components/thresholds/manage-threshold-links';

import pageHeader from "components/page-header";


export default {
  name: 'groupThresholds',
  components:{
    pageHeader,
    manageThresholds,
    manageThresholdLinks

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

    getThresholdLinksWithFilter(){
      return this.getThresholdLinks;
    }

  },
}
</script>
