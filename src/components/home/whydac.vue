<template>
  <q-card style="max-height:600px">
    <q-card-section class="bg-white">
      <q-img src="~assets/question.jpg" style="max-width:100%; max-height:300px" />
    </q-card-section>
    
    <q-card-section class="bg-white text-grey-9" style="font-size:17px">
      <b>Why would you create a DAC?</b>
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
        <p>One of the main reasons is decentralization, where users/guardians are located in different parts of the world and make the organization - in theory - incorruptible.</p>
        <p>Strenght in different points of view, levels of knowledge and wisdom on many subjects makes these types of organizations a force hard to stop.</p>
        <p>The engagement of any of the guardians is easy to follow and see what kind of value they represent and what they support and vote for.</p>
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