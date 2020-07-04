<template>
    <q-card style="max-width:510px; height:600px">
        <q-card-section  class="bg-white">
            <img src="~assets/dac1.jpg" style="max-width:100%; max-height:300px">
        </q-card-section>
    
        <q-card-section class="bg-white text-grey-9" style="font-size:17px">
            <b>What is a DAC?</b>
        </q-card-section>
      
        <q-card-section class="q-pt-none bg-white text-grey-9">
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
                whatisdac
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
    return {}
  }
}
</script>

<style>
</style>