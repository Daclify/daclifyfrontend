<template>
 <q-card style="max-width:510px; height:600px">
  <q-card-section class="bg-white text-center">
    <img src="~assets/modules.jpg" class="flex-center" style="max-width:100%; max-height:300px">
  </q-card-section>
  
  <q-card-section class="bg-white text-grey-9" style="font-size:17px">
    <b>Modules</b>
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
      Daclify is designed to be modular.
      A module is a contract installed on an account.
      You can link different modules with your group to enable certain features.
      This allows for the platform to be very flexible and be fit for purpose.
      Examples: payroll module, voting module, etc.
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
    return {}
  }
}
</script>

<style>
</style>