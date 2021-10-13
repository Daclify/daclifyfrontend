<template>
  <div v-if="profile_data.files.length">
    <div v-for="(f,i) in profile_data.files" :key="i"></div>
    <pre>{{profile_data.profile.files}}</pre>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import fileLink from "components/file-link";
export default {
  // name: 'ComponentName',
  name: "profileFiles",
  components:{

  },
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
  components: {
    fileLink
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",

      // getActiveGroupConfig: "group/getActiveGroupConfig",
      // getNumberGuardians: "group/getNumberGuardians"
    })
  }
}
</script>
