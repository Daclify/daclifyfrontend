<template>
  <span>
    <a :href="getExplorerLink" target="_blank" class="text-link row items-center">
      <q-icon name="search" size="16px" />
      <span v-if="accountname">{{ accountname }}</span>
    </a>
  </span>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "explorerLink",
  props: {
    accountname: "",
    trxid: "",
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getSelectedBlockExplorer: "user/getSelectedBlockExplorer",
    }),
    getExplorerLink() {
      if (this.accountname) {
        return (
          this.getSelectedBlockExplorer.base +
          this.getSelectedBlockExplorer.account +
          this.accountname
        );
      }
    },
  },
});
</script>
