<template>
  <div style="cursor: help;"><b>{{prepend}}</b> {{parsed_date}}
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
      parsed_date: ""
    }
  },

  watch:{

    date: {
      immediate: true,
      handler(newVal, oldVal) {
        if(newVal != oldVal){
          let d = Date.parse(newVal.split(".")[0]+".000+00:00");
          this.parsed_date = relativeTimeDelta(d);
        }
      }
    },
  }
}
</script>
