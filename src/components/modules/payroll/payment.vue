<template>
      <q-expansion-item>
        <template v-slot:header>
          <q-item-section avatar>
            <profile-pic :size="42" icon="mdi-transfer-left" iconColor="primary" :account="payment.receiver"  />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-capitalize">{{payment.receiver}}</q-item-label>
            <q-item-label caption>ID {{payment.pay_id}}</q-item-label>
          </q-item-section>

          <q-item-section v-if="payment.memo">
            <q-item-label class="text-capitalize">memo</q-item-label>
            <q-item-label caption>{{payment.memo}}</q-item-label>
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
        <action-proposer>
          <template slot-scope="scope">
            <remove-payment :payment="payment" @propose="scope.propose" @addtobucket="scope.addtobucket"/>
          </template>
        </action-proposer>
        </q-card>

      </q-expansion-item>
</template>

<script>
import profilePic from "components/profile-pic";
import {time_options} from "../../../imports/time_options";

import removePayment from 'components/modules/payroll/remove-payment';
import actionProposer from "components/actions/action-proposer";
export default {
  name: 'payment',
  props:{
    payment: false
  },
  components:{
    profilePic,
    removePayment,
    actionProposer
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
