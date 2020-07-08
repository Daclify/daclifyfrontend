<template>
    <q-card style=" max-height:600px">
        <q-card-section  class="bg-white">
            <q-img src="~assets/dac1.jpg" style="max-width:100%; max-height:300px"/>
        </q-card-section>
    
        <q-card-section class="bg-white text-grey-9" style="font-size:17px">
            <b>What is a DAC?</b>
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
                <p>Decentralized autonomous organization (DAO or DAC) is a new form of social and economic organization
                enabled by blockchain technology, smart contracts, and cryptocurrencies.
                DACs are formalized by smart contracts and managed by custiodians elected by users of the DAC.
                There are many ideas of what would be the best way to vote and it all depends on the way the voting modules are designed.
                 </p>
                <p>DACs are open-source, transparent and in theory, incorruptible.
                    All transactions of the organization are recorded and maintained on a blockchain.</p>
            </div>

            </div>
            </q-scroll-area>
        </q-card-section>
    </q-card>
</template>

<script>
export default {
  name: 'whatisdac',
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