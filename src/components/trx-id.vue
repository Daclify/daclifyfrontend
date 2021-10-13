<template>
  <div>
    
    <a :href="getSelectedBlockExplorer.base+getSelectedBlockExplorer.trx+trxid" target="_blank" class="text-link row items-center">
      <q-icon name="search" size="16px"/>
      <span>explore</span>
    </a>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "trxId",
  props: {
    trxid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      blok_explorer: 'https://jungle.eosq.app/tx/'
    };
  },
  computed: {
    ...mapGetters({
      getIsGuardian: "group/getIsGuardian",
      getSelectedBlockExplorer: "user/getSelectedBlockExplorer"
    })
  }
};
</script>