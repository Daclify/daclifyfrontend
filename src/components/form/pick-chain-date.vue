<template>
  <div class="" style="">
    <q-input outlined v-model="date" :label="label" bottom-slots>
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date v-model="date" mask="YYYY-MM-DDTHH:mm" :minimal="false" :options="date => date >= now" />
          </q-popup-proxy>
        </q-icon>
      </template>

      <template v-slot:append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-time v-model="date" mask="YYYY-MM-DDTHH:mm" format24h />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <!-- {{now}} -->
  </div>
</template>

<script>
import { date } from 'quasar';
export default {
  props:{
    label: ''
  },
  data () {
    return {
      date: '',
      now: date.formatDate(new Date(), 'YYYY/MM/DD')
    }
  },
  watch:{
    date:{
      immediate: true,
      handler(newVal, oldVal) {
        this.$emit('input', newVal);
      }
    }
  }
}
</script>
