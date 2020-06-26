<template>
    <transition
      appear
      enter-active-class="animated fadeInDown"
      class="column q-gutter-md "
      tag="div"
    >
      <div
        class="row justify-between items-center text-h5  text-weight-light "
        :class="colorClass"
        style="max-width:750px"
      >
        <div class="text-capitalize">{{title}}</div>
      </div>
    </transition>
</template>

<script>
export default {
  name: 'pageHeader',
  props:{
    title:{
      type: String,
      default: "No Title"
    },
    colorClass:{
      type: String,
      default: "text-grey-5"
    }
  },
  data () {
    return {}
  }
}
</script>
