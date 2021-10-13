<template>
  <q-input v-model="profile_data.text" autogrow type="textarea"  />

</template>

<script>
import { mapGetters } from "vuex";
export default {
  // name: 'ComponentName',
  name: "textEdit",
  props:{
    account:{
      type: String,
      default:""
    },
    profile_data: {
      type: Object,
      default:()=>{return {} }
    }
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getMyOldProfile: "group/getMyOldProfile"

      // getActiveGroupConfig: "group/getActiveGroupConfig",
      // getNumberGuardians: "group/getNumberGuardians"
    })
  }
}
</script>
