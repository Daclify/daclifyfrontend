<template>
  <span>
    <a :href="getExplorerLink" target="_blank" class="text-link row items-center">
      <q-icon name="search" size="16px"/>
      <span v-if="accountname">{{accountname}}</span>
    </a>
  </span>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: 'explorerLink',
  props:{
    accountname:"",
    trxid:""
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      getSelectedBlockExplorer: "user/getSelectedBlockExplorer",
    }),
    getExplorerLink(){
      if(this.accountname){
        return this.getSelectedBlockExplorer.base+this.getSelectedBlockExplorer.account+this.accountname
      }
    }

  },
}
</script>
