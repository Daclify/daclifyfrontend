<template>
  <q-page padding class="constrain-page-width">
   <page-header title="dashboard"/>
   <div class="text-grey-7 text-h6">
    <div v-if="getAccountName">Welcome {{getAccountName}}</div>
    <div v-else>Please log in</div>
   </div>

  </q-page>
</template>

<script>
import { mapGetters } from "vuex";

import pageHeader from "components/page-header";

export default {
  name: "dashboard",
  components: {
    pageHeader
  },
  data() {
    return {

    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      // getActiveGroup: "group/getActiveGroup",
      // getActiveGroupConfig: "group/getActiveGroupConfig",
      // getNumberGuardians: "group/getNumberGuardians"
    })
  },
  methods: {

  }

};
</script>
