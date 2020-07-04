<template>
  <q-card class="bg-white" style="max-width:510px; height:600px">
    <q-card-section>
      <img src="~assets/blockchain.jpg" style="max-width:100%; max-height:300px">
    </q-card-section>
    
    <q-card-section class="bg-white text-grey-9" style="font-size:17px">
      <b>On-chain</b>
    </q-card-section>
      <q-card-section class="bg-white text-grey-9 q-pt-none">
        <q-scroll-area
        :thumb-style="thumbStyle"
        :bar-style="barStyle"
        style="height: 190px; max-width: 100%"
        >                  
          <div
          v-for="n in 1"
          :key="n"
          class="q-pa-xs"
          >
          <div>
          Daclify's core is working fully on an EOSIO blockchain, this allows real decentralization.
          You can use an existing UI or create a custom one for yourself. You just need to conect it the contract.
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
    return {}
  }
}
</script>

<style>
</style>