<template>
  <q-card>
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

    <q-card-section>
      <div class="row justify-between full-width items-center" >
        <threshold-badge  label :contract="action.account" :action_name="action.name"/>
        <propose-bucket-btn @click-propose="emitPropose" @click-bucket="emitBucket" label="Remove From payroll" :disabled="false" />
      </div>
    </q-card-section>
    <!-- <pre>{{action}}</pre> -->
  </q-card>
</template>

<script>
import { mapGetters } from "vuex";
import thresholdBadge from "components/thresholds/threshold-badge";
import proposeBucketBtn from "components/actions/propose-bucket-btn";
import { date } from 'quasar';

export default {
  name: "removePayment",
  components:{
    thresholdBadge,
    proposeBucketBtn

  },
  props:{
    payment: false

  },
  data() {
    return {

      action:{
        account: "",
        name: "paymentrem",
        data: {
          pay_id: this.payment.pay_id
        },
        authorization:[]
      }

    }
  },
  computed: {
    ...mapGetters({
      getModuleByName: "group/getModuleByName",
    })
  },
  mounted(){
    let payroll_module = this.getModuleByName("payroll");
    this.action.account = payroll_module.slave_permission.actor;
    this.action.authorization.push(payroll_module.slave_permission);
  },
  methods: {
    getClaimDates(){
      let res = [];
      let now = Date.now();
      let start = new Date(this.payment.due_date+".000+00:00").getTime();
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
    },

    emitPropose(){

      let action = JSON.parse(JSON.stringify(this.action))

      let title = `Remove ${this.payment.receiver} from payroll ${this.payment.payroll_tag}`;
      let description = `Remove ID ${this.payment.pay_id} from payroll ${this.payment.payroll_tag}. All payments associated with this pay_id will be cancelled.`;

      const payload = {
        actions: [action],
        description: description,
        title: title     
      }
      this.$emit('propose', payload);
    },
    emitBucket(){
      let action = JSON.parse(JSON.stringify(this.action))
      this.$emit('addtobucket', action);     
    }
  }

};
</script>
