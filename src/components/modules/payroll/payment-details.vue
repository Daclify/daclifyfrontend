<template>
    <q-list class="full-width" v-if="payment">
      <q-item dense v-for="(p,i) in getClaimDates()" :key="p.claim_ms">
        <q-item-section avatar>
          <q-badge><q-icon name="mdi-clock" size="16px" class="q-mr-xs" />{{`${i+1}/${payment.repeat}`}}</q-badge>
        </q-item-section>
        <q-item-section>
          {{p.claim_date}}     
        </q-item-section>
        <q-item-section side>
          <div class="row items-center ">
            <q-icon v-if="p.claimable" name="mdi-check" color="positive" />
            <q-icon v-else name="mdi-close" color="negative" />
            <span>/</span>
            <q-icon v-if="p.is_claimed" name="mdi-check" color="positive" />
            <q-icon v-else name="mdi-close" color="negative" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
</template>

<script>
import { date } from 'quasar';
export default {
  name: 'paymentDetails',
  props:{
    payment: {}
  },
  data () {
    return {}
  },
  methods:{
    getClaimDates(){
      let res = [];
      let now = Date.now();
      let start = new Date(this.payment.due_date+".000+00:00").getTime()-(this.payment.recurrence_sec*1000*this.payment.repeated);
      for(let i = 0; i < this.payment.repeat; i++){
        let cobj = {};
        cobj.claim_ms = start + (i*this.payment.recurrence_sec*1000);
        cobj.claim_date = date.formatDate(cobj.claim_ms, 'dddd Do MMMM YYYY HH:mm') //new Date(cobj.claim_ms);
        
        cobj.ms_left = cobj.claim_ms - now;
        cobj.is_claimed = this.payment.repeated > i;
        cobj.claimable = cobj.is_claimed || cobj.claim_ms <= now;
        res.push(cobj);
      }
      return res;
    }
  }
}
</script>
