<template>
  <div>

      <q-list dense :dark="dark" v-if="getCPUStats">
        <q-item-label header class="text-h6">CPU</q-item-label>
        <!-- <div v-if="getCPUStats"> -->
          <q-item>
            <q-item-section side>
              <q-item-label caption>Total Staked</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{getCPUStats.total_delegated_cpu}}</q-item-label>
            </q-item-section>
          </q-item>
        <q-item>
          <q-item-section side>
            <q-item-label caption>Available</q-item-label>
          </q-item-section>
            
          <q-item-section>
            <q-item-label caption class="text-weight-bold">{{getCPUStats.parsed.available}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section side>
            <q-item-label caption>Used</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>
            <q-linear-progress
              :value="getCPUStats.perc_used/100"
              size="20px"
              color="primary"
              :dark="dark"
            >
              <div class="absolute-full flex flex-center text-black" style="font-size:11px">
                <!-- <q-badge color="primary-light" text-color="accent" :label="(getNETStats.perc_used).toFixed(2)+'%'" /> -->
                {{(getCPUStats.perc_used).toFixed(2)+'%'}}
              </div>
            </q-linear-progress>
            </q-item-label>
            <q-item-label caption>
              {{getCPUStats.parsed.used}}/{{getCPUStats.parsed.max}}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-list v-else dense :dark="dark">
        <q-item-label header>CPU</q-item-label>
        <q-item>
          <q-item-section>
            <q-item-label caption>Please log in</q-item-label>
          </q-item-section>   
        </q-item>
      </q-list>

    
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  // name: 'ComponentName',
  props:{
    dark: false
  },
  data() {
    return {
      CLOCK_TIMER: null
    };
  },
  computed: {
    ...mapGetters({
      getCPUStats: "group/getCPUStats",
      getAccountName: "ual/getAccountName"
    }),
    getRelativeCpu: function(){
      if(this.getCPUStats){
        return 100-(this.getCPUStats.available/this.getCPUStats.max*100)
      }
    }
  },
  methods:{

  }
};
</script>
