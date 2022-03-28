<template>
  <q-page padding class="constrain-page-width">
    <manage-thresholds />

    <manage-threshold-links class="q-mt-md" />

    <!-- {{getThresholds}} -->
    <!-- {{getThresholdLinks}} -->
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import manageThresholds from "components/thresholds/manage-thresholds";
import manageThresholdLinks from "components/thresholds/manage-threshold-links";

export default defineComponent({
  name: "groupThresholds",
  components: {
    manageThresholds,
    manageThresholdLinks,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getThresholds: "group/getThresholds",
      getActiveGroup: "group/getActiveGroup",
      getThresholdLinks: "group/getThresholdLinks",
    }),
  },
});
</script>
