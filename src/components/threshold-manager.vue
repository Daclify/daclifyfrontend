<template>
  <div>My component
    <q-separator />
    {{getThresholds}}
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: 'thresholdManager',
  components:{

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
      getActiveGroupConfig: "group/getActiveGroupConfig",
      getThresholdLinks: "group/getThresholdLinks"
    }),

  },
  methods:{
    manthreshold(){
      let action = {
        account: this.getAppConfig.groups_contract,
        name: "manthreshold",
        data: {
          threshold_name: "",
          threshold: 1,
          remove: false
        }
      };

      const title = `Update Thresholds`;
      const description = `Proposal to update threshold ${action.data.threshold_name} to ${action.data.threshold}`;

      this.$store.dispatch("group/propose", {
        actions: [action],
        description: description,
        title: title
      });
    }
  }
}
</script>
