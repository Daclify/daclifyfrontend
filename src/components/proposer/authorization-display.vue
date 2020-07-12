<template>
  <div>
    <!-- {{action}} -->
    <div class="row items-center" >
      <!-- <q-btn icon="mdi-pencil" @click="update_authorization" size="xs" dense round color="primary"/> -->
      <q-badge v-for="auth in action.authorization" :key="auth.actor+auth.permission">
        {{`${auth.actor}@${auth.permission}`}}
      </q-badge>
    </div>
    

  </div>
</template>

<script>
export default {
  name: 'authorizationDisplay',
  props:{
    action:{
      type: Object,
      default: ()=>{return {}}
    }
  },
  data () {
    return {}
  },
  methods:{
    update_authorization(){
      this.action.authorization=[]
    }
  }
}
</script>
