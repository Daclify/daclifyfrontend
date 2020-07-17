<template>
<q-card-section>
  <div class="row  q-col-gutter-md q-pb-xs q-mt-md">
    <!-- {{payroll}} -->
    <div class="col-xs-12 col-sm-6">
      <q-input
        ref="receiver"
        v-model="action.data.receiver" 
        label="receiver" 
        outlined 
        bottom-slots
        maxlength="12"
        :rules="[
          val => !!val || '* Required',
          isValidAccountName,
          isExistingAccountName
          ]"
      >
        <template v-slot:prepend>
          <profile-pic :account="action.data.receiver" :size="36"/>
        </template>

      </q-input>
    </div>

    
    <div class="col-xs-12 col-sm-6">
      <q-input
        ref="amount"
        type="number"
        v-model="action.data.amount"
        label="quantity"
        outlined
        bottom-slots
        placeholder="eos amount"
        no-error-icon
        :rules="[
          val => !!val || '* Required',
          val => val > 0 || 'Must be greater then zero'
          ]"
      >
        <template v-slot:append>
          {{payroll.total_paid.quantity.split(' ')[1]}}
        </template>
        <template  v-slot:hint>
          <transition  enter-active-class="animated zoomIn" leave-active-class="animated zoomOut"  tag="div" >
            <div v-if="balance_overdraw_warning" class="row items-center text-warning">
              <q-icon name="mdi-alert" class="q-mr-xs" />Amount will make {{payroll.pay_permission.actor}} insolvent
            </div>
          </transition>
        </template>
      </q-input>
    </div>



    <div class="col-xs-12 col-sm-6">
  
      <pick-chain-date v-model="action.data.due_date" label="due date" />
    </div>

    <div class="col-xs-12 col-sm-6">
      <q-input
        ref="memo"
        v-model="action.data.memo"
        label="memo"
        outlined
        bottom-slots
        placeholder="optional memo"
        no-error-icon
        :rules="[

          ]"
      >
      </q-input>
    </div>

    <div class="col-xs-12 col-sm-6" >
      <span class="q-mr-md"> 
        <q-toggle label="Recurrent Payment" v-model="is_recurrent_payment" />
        <q-icon v-if="is_recurrent_payment" name="mdi-check" color="positive" size="24px" />
      </span>
      <span>
        <q-toggle label="Auto Pay With Croneos" v-model="action.data.auto_pay" />
        <q-icon v-if="action.data.auto_pay" name="mdi-check" color="positive" size="24px" />
      </span>
    </div>

    <div  class="col-xs-12 col-sm-6">
      <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut" mode="out-in" tag="div" >
        <q-select v-if="is_recurrent_payment" borderless v-model="recurrence_delay" :options="recurrence_delay_options"  outlined label="repeat" bottom-slots key="recurrent">
          <template v-slot:after>
            <q-input
              style="max-width:80px"
              v-model="action.data.repeat" 
              label="pay" 
              outlined 
            >
              <template v-slot:append>
                X
              </template>
            </q-input>
          </template>
        </q-select>     
      </transition>
    </div>

<!-- {{recurrence_delay}} -->
    <div class="row justify-between full-width items-center" >
      <threshold-badge  label :contract="action.account" :action_name="action.name"/>
      <propose-bucket-btn @click-propose="emitPropose" @click-bucket="emitBucket" label="Add Payment" :disabled="false" />
    </div>
    <!-- <pre>{{action}}</pre> -->
  </div>
</q-card-section>
</template>

<script>
import { mapGetters } from "vuex";
import thresholdBadge from "components/thresholds/threshold-badge";
import proposeBucketBtn from "components/actions/propose-bucket-btn";
import profilePic from "components/profile-pic";
import pickChainDate from "components/form/pick-chain-date";
import {
  isValidAccountName,
  isExistingAccountName
} from "../../../imports/validators";
import {time_options} from "../../../imports/time_options";

export default {
  name: "addPayment",
  components:{
    thresholdBadge,
    proposeBucketBtn,
    profilePic,
    pickChainDate
  },
  props:{
    payroll: false,
    currentbalance:''
  },
  data() {
    return {
      is_recurrent_payment:false,
      formIsValidated: false,
      token_contract: "eosio.token",
      symbol: "EOS",
      recurrence_delay:{label: "monthly", value: 60*60*24*30},
      recurrence_delay_options: time_options.options,
      action:{
        account: "",
        name: "paymentadd",
        data: {
          payroll_tag: this.payroll.payroll_tag,
          receiver: "",
          amount: "",
          memo:"",
          due_date:"",
          repeat:1,
          recurrence_sec:0,
          auto_pay: false
        },
        authorization:[]
      },
      balance_overdraw_warning:""
    }
  },
  computed: {
    ...mapGetters({
      getActiveGroup: 'group/getActiveGroup',
      getGroupWallet: "group/getGroupWallet",
      getModuleByName: "group/getModuleByName",
    })
  },
  methods: {
    isValidAccountName,
    isExistingAccountName,

    getPrecision(){
      let amount = this.payroll.total_paid.quantity.split(' ')[0];
      let precision = amount.split('.')[1];
      return precision ? precision.length : 0;
    },

    emitPropose(){
      this.$refs.amount.validate();
      this.$refs.receiver.validate();
      if(this.$refs.amount.hasError || this.$refs.receiver.hasError){
        return;
      }
      let action = JSON.parse(JSON.stringify(this.action))
      action.data.amount = action.data.amount+" "+this.symbol;

      let title = `Add ${action.data.receiver} to payroll ${this.payroll.payroll_tag}`;
      let description = `Pay ${action.data.receiver} ${action.data.amount}.\n`;
      if(action.data.repeat > 1){
        description += `This is a ${time_options.get(action.data.recurrence_sec)} recurrent payment. It will be repeated ${action.data.repeat} times.`;
      }

      const payload = {
        actions: [action],
        description: description,
        title: title     
      }
      this.$emit('propose', payload);
    },
    emitBucket(){
      this.$refs.amount.validate();
      this.$refs.receiver.validate();
      if(this.$refs.amount.hasError || this.$refs.receiver.hasError){
        return;
      }
      let action = JSON.parse(JSON.stringify(this.action))
      action.data.amount = action.data.amount+" "+this.symbol;
      this.$emit('addtobucket', action);     
    }
  },
  mounted(){
    let payroll_module = this.getModuleByName("payroll");
    this.action.account = payroll_module.slave_permission.actor;
    this.action.authorization.push(payroll_module.slave_permission);
    this.symbol = this.payroll.total_paid.quantity.split(' ')[1];
  },
  watch: {
    "action.data.amount": function(newV, oldV) {
      if (this.action.data.amount ) {
        this.action.data.amount = Number(this.action.data.amount).toFixed(this.getPrecision() );

        let unallocated_balance = parseFloat(this.currentbalance) - parseFloat(this.payroll.total_allocated);
        if(this.action.data.amount > unallocated_balance){
          this.balance_overdraw_warning = "warning"
        }
        else{
          this.balance_overdraw_warning = ""
        }
      }
    },
    is_recurrent_payment: function(newV, oldV){
      if(newV===false){
        this.action.data.repeat = 1;
        this.action.data.recurrence_sec = 0;
      }
      else{
        this.action.data.repeat = 2;
        this.action.data.recurrence_sec = this.recurrence_delay.value;
      }
    },
    recurrence_delay: function(newV, oldV){
      this.action.data.recurrence_sec = this.recurrence_delay.value
    }
  }
};
</script>
