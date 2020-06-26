<template>
  <q-page padding class="overflow-hidden">
    <h5>Gas Deposits</h5>
    <deposits />
    <h5 class="row items-center">
      <div>My Scheduled Jobs</div>
      <q-btn icon="refresh" :loading="jobs_are_loading" flat dense color="primary" @click="getMyCronJobs" class="q-ml-md"/>
    </h5>
    
    <div>
      <cronjobs-table :cronjobs="mycronjobs"/>
      <p class="q-mt-sm">See the <router-link to="/docs/getting-started" tag="a" class="text-link">documentation</router-link> for adding your jobs</p>
    </div>


    <scheduler v-if="getAccountName=='piecesnbitss'" class="q-mt-xl" @scheduled="getMyCronJobs"/>


  </q-page>
</template>

<script>

import { mapGetters } from "vuex";
import deposits from "components/deposit/deposits";
import cronjobsTable from "components/cronjobs-table";
import scheduler from "components/scheduler/scheduler";
export default {
  // name: 'PageName',
  components: {
    cronjobsTable,
    scheduler,
    deposits
  },
  data() {
    return {
      cron_contract: "piecestest12",
      mycronjobs:[],
      jobs_are_loading: false
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getAppConfig: "app/getAppConfig",


    })
  },
  methods:{
 
    async getMyCronJobs(){
      if(!this.getAccountName) return;
      this.jobs_are_loading=true;
      let res  = await this.$eos.rpc.get_table_rows({
        json: true,
        code: this.cron_contract,
        scope: this.cron_contract,
        table: "cronjobs",
        
        // table_key : '',
        // lower_bound : nameToValue(this.getAccountName).toString() ,
        // upper_bound : nameToValue(this.getAccountName).toString(),
        lower_bound : this.getAccountName,
        upper_bound : this.getAccountName,
        index_position : 2,
        key_type : 'i64',
        reverse : true,
        // show_payer : false,
     });
     console.log(res)
     this.mycronjobs = res.rows.map(mcj => {mcj.__index=null; return mcj});
     this.jobs_are_loading=false;
    },

    updateProxy () {
      this.proxyDate = this.expiration_date
    },

    save () {
      this.expiration_date = this.proxyDate
    }


  },
watch: {
  getAccountName: {
    immediate: true,
    handler(newVal, oldVal) {
      if(this.getAccountName){this.getMyCronJobs();}
      
    },
  },
},
}
</script>

<style>
</style>
