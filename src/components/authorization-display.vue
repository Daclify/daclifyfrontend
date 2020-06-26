<template>
  <div>
    <div class="row items-center" v-for="auth in authorization" :key="auth.actor+auth.permission">
      <span>{{`${auth.actor}@${auth.permission}`}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'authorizationDisplay',
  props:{
    authorization:{
      type: Array,
      default: ()=>[]
    }
  },
  data () {
    return {}
  }
}
</script>
