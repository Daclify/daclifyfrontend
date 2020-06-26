<template>
  <div>
    <div class="relative-position" style="width:30px; height:30px">

      <div class="display_value row justify-center items-center bg-primary round text-caption text-white fit" >
        <div>{{display}}</div>
      </div>

      <transition enter-active-class="animated fadeInUp" leave-active-class="animated zoomOut" mode="out-in" tag="div" class="display_value" >
        <div v-if="play_add_animation" class="fit row justify-center items-center bg-positive text-white round" >{{delta}}</div>
      </transition>

      <transition   leave-active-class="animated fadeOutUp" enter-active-class="animated zoomIn" mode="out-in" tag="div" class="display_value" >
        <div v-if="play_remove_animation" class="fit row justify-center items-center bg-negative text-white round" >{{delta}}</div>
      </transition>

    </div>

  </div>
</template>

<script>
export default {
  name: 'numberPopAnimation',
  props:{
    input_value:{
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      delay:500,
      display: 0,
      delta:'',
      play_remove_animation: false,
      play_add_animation: false,
    }
  },
  methods:{
    increment(delta){
      this.delta=`+${delta}`;
      this.play_add_animation = true;
      setTimeout(()=>{
        this.play_add_animation = false;
        this.display = this.display+delta
      }, this.delay);
    },
    decrement(delta){
      this.delta=`${delta}`;
      this.play_remove_animation=true;
      setTimeout(()=>{
        this.display = this.display+delta;
        this.play_remove_animation=false;
      }, this.delay);
    }
  },
  mounted(){
    this.display = this.input_value;
  },
  watch:{
    input_value: function(newv, oldv){
      if(newv > oldv){
        this.increment(newv-oldv);
      }
      else if( newv < oldv){
        this.decrement(newv-oldv);
      }
    }
  }
}
</script>

<style>
  .display_value{
    position: absolute;
    top:0;
    left:0;
  }
</style>