<template>
  <div>
    
      <q-list dense :dark="dark" v-if="getRAMStats">
        <q-item-label header class="text-h6">RAM</q-item-label>
        <!-- <div v-if="getNETStats"> -->
        <q-item>
          <q-item-section side>
            <q-item-label caption>EOS Value</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label caption class="row items-center no-wrap">
              <span v-if="rprice !== false">{{rprice}}</span>

              <q-btn :loading="ramprice_loading" icon="refresh" dense round color="primary" flat size="10px" @click="getRamPrice" />
              
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section side>
            <q-item-label caption>Available</q-item-label>
          </q-item-section>
            
          <q-item-section>
            <q-item-label caption class="text-weight-bold">{{getRAMStats.available}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section side>
            <q-item-label caption>Used</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>
            <q-linear-progress
              :value="getRAMStats.perc_used/100"
              size="20px"
              color="primary"
              :dark="dark"
            >
              <div class="absolute-full flex flex-center text-black" style="font-size:11px">
                <!-- <q-badge color="primary-light" text-color="accent" :label="(getNETStats.perc_used).toFixed(2)+'%'" /> -->
                {{(getRAMStats.perc_used).toFixed(2)+'%'}}
              </div>
            </q-linear-progress>
            </q-item-label>
            <q-item-label caption>
              {{getRAMStats.used}}/{{getRAMStats.max}}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-list v-else dense :dark="dark">
        <q-item-label header>RAM</q-item-label>
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
      CLOCK_TIMER: null,
      rprice: false,
      ramprice_loading: false
    };
  },
  computed: {
    ...mapGetters({
      getRAMStats: "group/getRAMStats",
      getAccountName: "ual/getAccountName"
    }),
    // getRelativeCpu: function(){
    //   if(this.getNETStats){
    //     return 100-(this.getNETStats.available/this.getNETStats.max*100)
    //   }
    // }
  },





  methods:{
// Connector Balance/(Smart Token’s Outstanding supply × Connector Weight)
// Connector Balance in this case is: quote.balance
// Smart Token Outstanding Supply is: base.balance
// Connector Weight is: quote.weight
// This would give you the price in EOS/BYTE
//quote.balance/(base.balance*quote.weight)
    async getRamPrice(){
      this.ramprice_loading = true;
      let res = await this.$eos.api.rpc.get_table_rows({
        json: true,
        code: "eosio",
        scope: "eosio",
        table: "rammarket",
        limit: 1
      }).catch(e => false);
      if(res && res.rows.length){
        res = res.rows[0];
        let quote_balance = parseFloat(res.quote.balance);
        let base_balance = parseFloat(res.base.balance);
        let quote_weight = parseFloat(res.quote.weight);
        let eos_per_byte =  Number(quote_balance/base_balance).toFixed(7);
        // console.log(eos_per_byte*1024)
        this.rprice =  eos_per_byte*1024 + " EOS/KB" ;
        console.log(this.rprice)
      }
      else{
        this.rprice =  false;
      }
      await new Promise(resolve=>{setTimeout(resolve,100)})
      this.ramprice_loading = false;
    }
  },
  mounted(){
    this.getRamPrice();
  }
};
</script>
