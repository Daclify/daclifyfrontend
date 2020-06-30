<template>
      <q-item v-if="payment" clickable>
        <q-item-section avatar>
            <profile-pic :size="42" icon="" iconColor="positive" :account="payment.receiver"  />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-capitalize">{{payment.receiver}}</q-item-label>
          <q-item-label caption>{{payment.amount}}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-capitalize">Due date</q-item-label>
          <q-item-label caption>{{payment.due_date}}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-capitalize">Repeat</q-item-label>
          <q-item-label caption>{{payment.repeat}}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-capitalize">ID</q-item-label>
          <q-item-label caption>{{payment.pay_id}}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn flat dense icon="delete" color="negative" size="18px">
            <q-tooltip content-class="bg-secondary" :delay="500">
              Propose removal from payroll
            </q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
</template>

<script>
import profilePic from "components/profile-pic";
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
  }
}
</script>
