<template>
  <q-page padding class="">

<transition enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutUp"  mode="in-out" tag="div">

  <div v-if="show_user_stats" >
    <div  class="row q-col-gutter-lg">
      <div class="col-xs-12 col-sm-6 col-md-4">
        <div class="q-pb-md bg-secondary rounded-borders shadow-3 full-height">
          <reward-balances dark />
        </div>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-4">
        <div class=" q-pb-md bg-secondary rounded-borders shadow-3 full-height">
          <cpu-resource dark/>
        </div>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-4">
        <div class="q-pb-md bg-secondary rounded-borders shadow-3 full-height">
          <net-resource  dark/>
        </div>
      </div>
    </div>
  </div>
  
</transition>
<!-- <div  class="row justify-center" >
  <q-btn :label="show_user_stats?'x': 'show details'" flat size="sm" @click="show_user_stats=!show_user_stats" />
</div> -->
 
    
    <h5 class="row items-center">
      <div>Mineables</div>
      <q-btn icon="refresh" :loading="jobs_are_loading" flat dense color="primary" @click="$store.dispatch('cronjobs/fetchCronjobs');" class="q-ml-md"/>
    </h5>
    <transition-group
      v-if="getCronjobs.length"
      enter-active-class="animated fadeIn"
      leave-active-class="animated zoomOut"
      class="row q-col-gutter-md overflow-hidden"
      tag="div"
    >
      <cronjob
        v-for="(cronjob, i) in getCronjobs"
        :key="cronjob.id"
        :cronjob="cronjob"
        @executed="removeExecutedJob(i)"
      />
    </transition-group>
    <div v-else>No jobs</div>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import cronjob from "components/cronjob/cronjob";
import rewardBalances from 'components/reward/reward-balances';
import cpuResource from 'components/cpu-resource';
import netResource from 'components/net-resource';
export default {
  // name: 'PageName',
  components: {
    cronjob,
    rewardBalances,
    cpuResource,
    netResource
  },
  data() {
    return {
      CLOCK_TIMER: null,
      jobs_are_loading: false,
      show_user_stats: true

    };
  },
  computed: {
    ...mapGetters({
      getCLOCK: "app/getCLOCK",
      getCronjobs: "cronjobs/getCronjobs"
     
    })
  },
  methods: {

    removeExecutedJob(e) {
      console.log("job at array position", e, "executed");
      // this.cronjobs.splice(e, 1);
      this.$store.commit('cronjobs/removeCronjobByIndex', e);
    },
    async loadJobs(){
      this.jobs_are_loading = true;
      await this.$store.dispatch('cronjobs/fetchCronjobs');
      this.jobs_are_loading = false;
    }
  },
  mounted(){
    this.loadJobs();
    if(!this.CLOCK_TIMER || !this.getCLOCK){
      this.$store.commit("app/setCLOCK", new Date().getTime());
      this.CLOCK_TIMER = setInterval(() => {
          this.$store.commit("app/setCLOCK", new Date().getTime());
      }, 1000);
    }
  },
  beforeDestroy(){
    clearInterval( this.CLOCK_TIMER );
    this.CLOCK_TIMER = null;
  },
};
</script>

<style>
</style>
