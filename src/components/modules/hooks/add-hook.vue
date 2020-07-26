<template>
<q-card-section>
  <div class="row  q-col-gutter-md q-pb-xs q-mt-md">
    <!-- {{payroll}} -->
    <div class="col-xs-12 col-sm-6">
      <q-input
        ref="hookedaction"
        v-model="action.data.hooked_action" 
        label="Action"
        placeholder="action"
        outlined 
        bottom-slots
        maxlength="12"
        :rules="[
          val => !!val || '* Required',
          isValidAccountName
          ]"
      >
        <!-- <template v-slot:prepend>
          <profile-pic :account="action.data.receiver" :size="36"/>
        </template> -->

      </q-input>
    </div>

    
    <div class="col-xs-12 col-sm-6">
      <q-input
        ref="hookedcontract"
        v-model="action.data.hooked_contract"
        label="Contract"
        outlined
        bottom-slots
        placeholder="contract"
        no-error-icon
        :rules="[
          val => !!val || '* Required',

          ]"
      >
        <!-- <template v-slot:append>
          {{payroll.total_paid.quantity.split(' ')[1]}}
        </template>
        <template  v-slot:hint>
          <transition  enter-active-class="animated zoomIn" leave-active-class="animated zoomOut"  tag="div" >
            <div v-if="balance_overdraw_warning" class="row items-center text-warning">
              <q-icon name="mdi-alert" class="q-mr-xs" />Amount will make {{payroll.pay_permission.actor}} insolvent
            </div>
          </transition>
        </template> -->
      </q-input>
    </div>

    <div class="col-xs-12 col-sm-6">
      <q-select
        ref="hookactionname"
        v-model="action.data.hook_action_name"
        :options="hookOptions"
        outlined 
        label="Hook"
        emit-value
        bottom-slots
        :rules="[
          val => !!val || '* Required',
          ]"
      >
      </q-select>     
    </div>

    <div class="col-xs-12" >

    </div>



    <div class="row justify-between full-width items-center" >
      <threshold-badge  label :contract="action.account" :action_name="action.name"/>
      <propose-bucket-btn @click-propose="emitPropose" @click-bucket="emitBucket" label="Add hook" :disabled="false" />
    </div>
    <!-- <pre>{{action}}</pre> -->
  </div>
</q-card-section>
</template>

<script>
import { mapGetters } from "vuex";
import thresholdBadge from "components/thresholds/threshold-badge";
import proposeBucketBtn from "components/actions/propose-bucket-btn";
import {
  isValidAccountName,
  isExistingAccountName
} from "../../../imports/validators";



export default {
  name: "addHook",
  components:{
    proposeBucketBtn,
    thresholdBadge
  },
  data() {
    return {
      action:{
        account: "",
        name: "hookreg",
        data: {
          hooked_action:"",
          hooked_contract:"",
          hook_action_name:"",
          description:""
        },
        //authorization:[]
      },
      hookOptions:[]

    }
  },
  computed: {
    ...mapGetters({
      getHooksContract: 'hooks/getHooksContract'
    })
  },
  methods: {
    isValidAccountName,
    async getHookOptions(){
      const system_actions=["hookreg", "hookdel", "hookenable", "hookedit"];
      let abi = await this.$eos.api.rpc.get_abi(this.getHooksContract);
      let actions = abi.abi.actions.filter(a=> !system_actions.includes(a.name));
      let hooks = actions.map(a=>{ return {value: a.name, label:a.name} });
      this.hookOptions = hooks || [];
    },

    emitPropose(){
      this.$refs.hookedaction.validate();
      this.$refs.hookedcontract.validate();
      this.$refs.hookactionname.validate();
      if(this.$refs.hookedaction.hasError || this.$refs.hookedcontract.hasError || this.$refs.hookactionname.hasError){
        return;
      }
      let action = JSON.parse(JSON.stringify(this.action))

      let title = `Add new hook ${action.data.hook_action_name}`;
      let description = `Add new hook ${action.data.hook_action_name} to ${action.data.hooked_contract}::${action.data.hooked_action}`;

      const payload = {
        actions: [action],
        description: description,
        title: title     
      }
      this.$emit('propose', payload);
    },
    emitBucket(){
      this.$refs.hookedaction.validate();
      this.$refs.hookedcontract.validate();
      this.$refs.hookactionname.validate();
      if(this.$refs.hookedaction.hasError || this.$refs.hookedcontract.hasError || this.$refs.hookactionname.hasError){
        return;
      }
      let action = JSON.parse(JSON.stringify(this.action))

      this.$emit('addtobucket', action);     
    }
  },
  mounted(){
    this.action.account = this.getHooksContract;
    this.getHookOptions();
    //this.action.authorization.push(payroll_module.slave_permission);
  }

};
</script>
