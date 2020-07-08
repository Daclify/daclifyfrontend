<template>
 <q-card style="max-height:600px">
  <q-card-section class="bg-white text-center">
    <q-img src="~assets/modules.jpg" class="flex-center" style="max-width:100%; max-height:300px" />
  </q-card-section>
  
  <q-card-section class="bg-white text-grey-9" style="font-size:17px">
    <b>Modules</b>
  </q-card-section>

  <q-card-section class="bg-white text-grey-9 q-pt-none">
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
      <p>Daclify has a modular design.
      This allows for the platform to scale and be very flexible.</p>
      <p>A module is a contract installed on an account.
      You can link different modules within your group to enable certain features.
      With time there will be more and more modules available to use. Everyone can help with developing them as the code is open-source.</p>
      <p>Examples: payroll module, voting module, etc.</p>
      </div>
      </div>
    </q-scroll-area>
  </q-card-section>
 </q-card>
</template>

<script>
export default {
  name: 'modules',
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