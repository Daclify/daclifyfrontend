<template>
  <q-card style="max-width:510px; height:600px">
    <q-card-section class="bg-white">
      <img src="~assets/question.jpg" style="max-width:100%; max-height:300px">
    </q-card-section>
    
    <q-card-section class="bg-white text-grey-9" style="font-size:17px">
      <b>Why would you create a DAC?</b>
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
        whydac
      </div>
      
      </div>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'whydac',
  data () {
    return {}
  }
}
</script>

<style>
</style>