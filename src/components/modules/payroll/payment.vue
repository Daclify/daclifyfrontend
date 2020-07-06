<template>
      <q-item v-if="payment" clickable>
        <q-item-section avatar>
            <profile-pic :size="42" icon="" iconColor="positive" :account="payment.receiver"  />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-capitalize">{{payment.receiver}}</q-item-label>
          <q-item-label caption>ID {{payment.pay_id}}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-capitalize">Amount</q-item-label>
          <q-item-label caption>{{payment.amount}}</q-item-label>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-capitalize">Due date</q-item-label>
          <q-item-label caption>{{payment.due_date}}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-capitalize">Repeat</q-item-label>
          <q-item-label caption>
            <span v-if="convert_recurrence_sec(payment.recurrence_sec)">{{convert_recurrence_sec(payment.recurrence_sec)}}</span>
            <span>{{`${payment.repeated+1}/${payment.repeat}`}}</span>
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-btn flat dense icon="delete" color="negative" size="sm">
            <q-tooltip content-class="bg-secondary" :delay="500">
              Propose removal from payroll
            </q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
</template>

<script>
import profilePic from "components/profile-pic";
import {time_options} from "../../../imports/time_options";
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
    }
    
  }

}
</script>
