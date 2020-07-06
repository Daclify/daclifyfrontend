<template>



      <q-expansion-item>
        <template v-slot:header>
          <q-item-section avatar>
            <profile-pic :size="42" icon="" iconColor="positive" :account="payment.receiver"  />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-capitalize">{{payment.receiver}}</q-item-label>
            <q-item-label caption>ID {{payment.pay_id}}</q-item-label>
          </q-item-section>

          <q-item-section v-if="convert_recurrence_sec(payment.recurrence_sec)">
            <span><q-badge >{{convert_recurrence_sec(payment.recurrence_sec)}}</q-badge></span>
          </q-item-section>


          <q-item-section side>
            <div>
              <span>{{payment.amount}}</span>
              <span v-if="payment.repeat > 1" class="text-caption"> (x{{payment.repeat}})</span>
            </div>
            <!-- <div class="row items-center">
              <q-icon name="star" color="red" size="24px" />
              <q-icon name="star" color="red" size="24px" />
              <q-icon name="star" color="red" size="24px" />
            </div> -->
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <!-- {{payment.due_date}} -->
            <q-list class="full-width">
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
            <div class="text-right">
              <q-btn label="delete" icon="delete" color="negative" >
                <q-tooltip content-class="bg-secondary" :delay="500">
                  Propose removal from payroll
                </q-tooltip>
              </q-btn>

            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>



</template>

<script>
import profilePic from "components/profile-pic";
import {time_options} from "../../../imports/time_options";
import { date } from 'quasar';
export default {
  name: 'payment',
  props:{
    payment: false
  },
  components:{
    profilePic
  },
  data () {
    return {}
  },
  methods:{
    convert_recurrence_sec(sec){
      return time_options.get(sec);
    },
    getClaimDates(){
      let res = [];
      let now = Date.now();
      let start = new Date(this.payment.due_date+".000+00:00").getTime();
      for(let i = 0; i < this.payment.repeat; i++){
        let cobj = {};
        cobj.claim_ms = start + (i*this.payment.recurrence_sec*1000);
        cobj.claim_date = date.formatDate(cobj.claim_ms, 'dddd Do MMMM YYYY HH:mm') //new Date(cobj.claim_ms);
        cobj.claimable = cobj.claim_ms <= now;
        cobj.ms_left = cobj.claim_ms - now;
        cobj.is_claimed = this.payment.repeated > i;
        res.push(cobj);
      }
      return res;
    }
    
  }

}
</script>
