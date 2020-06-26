<template>
  <q-page padding class="bg-white">
    <scrolling-background class="absolute-bottom" />
    <!-- content -->

    <new-group class="q-mt-lg" :prefill="{group_account_name: $route.params.newgroupname}" />
   
    <div style="height:275px"></div>
  </q-page>
</template>
<style>

</style>
<script>
import { mapGetters } from "vuex";
import scrollingBackground from "components/scrolling-background";
import newGroup from "components/new-group";



export default {
  name: "create",
  components: {
    newGroup,
    scrollingBackground,

  },
  data() {
    return {

    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName"
    })
  },
  methods: {

  },
  watch:{

  }
};
</script>
