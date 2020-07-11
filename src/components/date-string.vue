<template>
  <div v-if="date" style="cursor: help;" >
    <b>{{prepend}} </b>
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut"  mode="out-in">
      <span :key="parsed_date">
         {{parsed_date}}
      </span>
    </transition>
    <q-tooltip content-class="bg-secondary" :delay="500">
      <q-icon name="mdi-calendar-clock" class="q-mr-xs" size="16px" />
      <span>{{date}}</span>
    </q-tooltip>
  
  </div>
</template>

<script>
import {relativeTimeDelta} from "../imports/helpers"
export default {
  name: 'dateString',
  props:{
    timezone: {
      type: String,
      default: "UTC"
    },
    prepend: {
      type: String,
      default: ""
    },
    date: {
      type: String,
      default: "2020-06-18T21:03:39"
    }

  },
  data () {
    return {
      parsed_date: "",
      interval: null,
    }
  },
  methods:{
    parseDate(date){
          let d = Date.parse(date.split(".")[0]+".000+00:00");
          this.parsed_date = relativeTimeDelta(d);
    },
    stopUpdates(){
      if(this.interval !== null){
        clearInterval( this.interval );
        this.interval = null;
        console.log("date update stopped", this.parsed_date)
      }
    }
  },
  created(){

      this.interval= setInterval(()=>{
        this.parseDate(this.date);
        if(!this.parsed_date.includes('minute') && !this.parsed_date.includes('second') && !this.parsed_date.includes('now') ){
          //only update minutes/second
          this.stopUpdates();
        }
      }, 30000);
    
  },
  beforeDestroy(){
    this.stopUpdates();
  },

  watch:{

    date: {
      immediate: true,
      handler(newVal, oldVal) {
        if(newVal != oldVal){
          this.parseDate(newVal)
        }
      }
    },
  }
}
</script>
