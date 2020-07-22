<template>
  <q-item>
    <q-item-section>
      <q-item-label caption>
        {{text}}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'noItems',
  props:{
    text:{
      type:String,
      default: "No items"
    }
  },
  data () {
    return {}
  }
}
</script>
