<template>
  <q-card style="max-height:600px">
    <q-card-section class="bg-white" >
      <q-img src="~assets/blockchain.jpg" style="max-width:100%; max-height:300px" />
    </q-card-section>
    
    <q-card-section class="bg-white text-grey-9" style="font-size:17px">
      <b>On-chain</b>
    </q-card-section>
      <q-card-section class="q-pt-none bg-white text-grey-9">
        <q-scroll-area
        :thumb-style="thumbStyle" 
        style="height: 190px; max-width: 100%"
        >                  
          <div
          v-for="n in 1"
          :key="n"
          class="q-pa-xs"
          >
          <div>
          <p>Daclify's core has been built on EOSIO platform. The main reason for choosing EOSIO technology was primarly decentralization and speed.</p>
          <p>Main UI is free for all to use but with DAC's contracts/operations always running on the blockchain it gives different groups and projects an opportunity to design
             their own UI if need to.</p>
          </div>
          
          </div>
        </q-scroll-area>
    </q-card-section>
    </q-card>
</template>

<script>
export default {
  name: 'onchain',
  data () {
    return {
      contentStyle: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        color: '#555'
      },

      contentActiveStyle: {
        backgroundColor: '#eee',
        color: 'black'
      },

      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      }
    }
  }
}
</script>

<style>
</style>