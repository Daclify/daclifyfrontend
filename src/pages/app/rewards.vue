<template>
  <q-page padding>
    <!-- {{rewards}} -->
    <h5>Mining Rewards</h5>
    <div  class="row q-col-gutter-lg text-white" >
      <reward-balance :reward="reward.adj_p_balance" v-for="(reward,i) in getRewards" :key="`reward${i}`" class="col-xs-12 col-sm-4 col-md-3 col-lg-2"/>
    </div>

  </q-page>
</template>

<script>

import { mapGetters } from "vuex";
import rewardBalance from 'components/reward/reward-balance';
export default {
  // name: 'PageName',
  components: {
    rewardBalance
  },
  data() {
    return {

    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getRewards: "user/getRewards"

    })
  },
  methods: {

  },

};
</script>

<style>
</style>
