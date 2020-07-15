<template>
  <q-card>
    <payment-details :payment="payment"/>

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
import paymentDetails from "components/modules/payroll/payment-details";


export default {
  name: "removePayment",
  components:{
    thresholdBadge,
    proposeBucketBtn,
    paymentDetails

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
