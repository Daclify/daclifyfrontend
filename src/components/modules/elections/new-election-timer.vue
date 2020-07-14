<template>
  <div>
    
    <q-item clickable >
      <q-item-section avatar>
        <q-icon name="mdi-alarm-multiple" color="primary" size="xl"/>
        <q-tooltip content-class="bg-secondary" :delay="500" anchor="center right" self="center left" :offset="[10, 10]">
          <div>Total Election Count: {{getElectionsState.election_count}}</div>
          <div v-if="computedNewElectionStats">New Election {{secondsToDhms(computedNewElectionStats.time_left/1000)|| `NOW`}}</div>
        </q-tooltip>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-weight-light text-h5 text-grey-7">New Election</q-item-label>
        <q-item-label >
            <q-linear-progress
              v-if="computedNewElectionStats"
              :value="computedNewElectionStats.perc/100"
              size="10px"
              color="primary"
            >
            </q-linear-progress>
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn label="new" color="primary" @click="newElection" :class="enable_new_election_btn ? 'pulse' :''" :loading="is_transacting" :disabled="!enable_new_election_btn" />
      </q-item-section>
    </q-item>

    <!-- {{computedNewElectionStats}} -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {secondsToDhms} from "../../../imports/helpers.js";
export default {
  // name: 'ComponentName',
  data () {
    return {
      is_transacting : false,
      enable_new_election_btn: false
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getElectionsContract: "elections/getElectionsContract",
      getElectionsState: "elections/getElectionsState",
      getElectionsConfig: "elections/getElectionsConfig",
      getActiveGroup: "group/getActiveGroup",
      getIsTransacting: "ual/getIsTransacting",
      getCLOCK: "app/getCLOCK",
    }),
    computedNewElectionStats(){
      let now = this.getCLOCK;
      if(this.getElectionsConfig && this.getElectionsState){
        let res = {
          last_election_date: this.getElectionsState.last_election,
          last_election_ms: new Date(this.getElectionsState.last_election+".000+00:00").getTime(),
          election_period_ms: this.getElectionsConfig.election_period_sec*1000
        }
        //calculate % due
        let new_election = res.last_election_ms + res.election_period_ms;
        let delta = new_election - now;
        res.time_left = delta;
        res.perc = delta/res.election_period_ms*100;
        res.perc = res.perc >=0 ? res.perc : 0;
        if(res.perc == 0){
          this.enable_new_election_btn = true;
        }
        else{
          this.enable_new_election_btn = false;
        }
        return res;
      }
      else{
        return false;
      }
    }
  },

  methods:{
    secondsToDhms,
    async newElection(){
      this.is_transacting = true;
      let action = {
        account: this.getElectionsContract,
        name: "newelection",
        data:{
          actor: this.getAccountName,
        }
      };
      let res = await this.$store.dispatch("ual/transact", { actions: [action], disable_signing_overlay: true });
      if(res && res.trxid){
        setTimeout(()=>{
          this.$store.dispatch("group/loadGroupRoutine", {groupname: this.getActiveGroup});
          this.$store.dispatch("elections/loadElectionsRoutine", this.getElectionsContract);
        }, 1000);

      }
      else{
        //return false;
      }
      this.is_transacting = false;
    }
  },
  mounted(){
    
    if(!this.getElectionsState ){
      setTimeout(async ()=>{
          this.$store.dispatch("elections/loadElectionsRoutine", this.getElectionsContract);
          this.loading_config_state = false;
      }, 1000);
    }
    else{
      this.loading_config_state = true;
    }

    if(!this.CLOCK_TIMER || !this.getCLOCK){
      this.$store.commit("app/setCLOCK", Date.now() );
      this.CLOCK_TIMER = setInterval(() => {
          this.$store.commit("app/setCLOCK", Date.now());
      }, 1000);
    }

  },

  beforeDestroy(){
    clearInterval( this.CLOCK_TIMER );
    this.CLOCK_TIMER = null;
  },
}
</script>
