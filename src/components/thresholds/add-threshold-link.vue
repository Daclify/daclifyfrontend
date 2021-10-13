<template>
  <div class="row  q-col-gutter-md q-pb-xs q-mt-md">
    <!-- {{payroll}} -->
    <div class="col-xs-12 col-sm-6">
      <q-input
        ref="contract"
        v-model="action.data.contract" 
        label="Contract" 
        placeholder="contract name"
        outlined 
        bottom-slots
        maxlength="12"
        :rules="[

          ]"
      >
        <!-- <template v-slot:prepend>
            xxx
        </template> -->

      </q-input>
    </div>

    
    <div class="col-xs-12 col-sm-6">
      <q-input
        ref="actionname"
        v-model="action.data.action_name"
        label="Action"
        outlined
        bottom-slots
        placeholder="name of the action"
        no-error-icon
        :rules="[

          ]"
      >
      </q-input>
    </div>

    <div class="col-xs-12 col-sm-6">
      <q-select 
        ref="thresholdname"
        borderless 
        v-model="action.data.threshold_name" 
        :options="threshold_options()"  
        outlined 
        label="Threshold" 
        bottom-slots 
        emit-value
        :rules="[
          val => !!val || '* Required',
        ]"
      >
        <template v-slot:option="scope">
          <q-item
            v-bind="scope.itemProps"
            v-on="scope.itemEvents"
          >
            <q-item-section>
              <q-item-label v-html="scope.opt.label" />
              <q-item-label caption>Required approvals {{ scope.opt.threshold }}</q-item-label>
            </q-item-section>
            <q-item-section side v-if="scope.opt.warning">
              <q-icon name="mdi-alert" color="warning" >
                <q-tooltip content-class="bg-secondary" :delay="500">
                  Threshold exceeds number of guardians {{getNumberGuardians}}
                </q-tooltip>
              </q-icon>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>


<!-- {{recurrence_delay}} -->
    <div class="row justify-between full-width items-center" >
      <threshold-badge  label :contract="action.account" :action_name="action.name"/>
      <propose-bucket-btn @click-propose="emitPropose" @click-bucket="emitBucket" label="Link Threshold" :disabled="false" />
    </div>
    <!-- <pre>{{action}}</pre> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import thresholdBadge from "components/thresholds/threshold-badge";
import proposeBucketBtn from "components/actions/propose-bucket-btn";

import {
  isValidAccountName,
  isExistingAccountName
} from "../../imports/validators";
import {time_options} from "../../imports/time_options";

export default {
  name: "addThresholdLink",
  components:{
    thresholdBadge,
    proposeBucketBtn

  },
  props:{

  },
  data() {
    return {
      action:{
        account: "",
        name: "manthreshlin",
        data: {
          contract:"",
          action_name:"",
          threshold_name: "",
          remove: false
        }
      },

    }
  },
  computed: {
    ...mapGetters({
      getActiveGroup: 'group/getActiveGroup',
      getGroupWallet: "group/getGroupWallet",
      getThresholds: "group/getThresholds",
      getNumberGuardians: "group/getNumberGuardians"

    })
  },
  methods: {
    isValidAccountName,
    isExistingAccountName,

    threshold_options(){
      return this.getThresholds.map(t=>{
        let warning = this.getNumberGuardians < t.threshold;
        return {label: t.threshold_name, value: t.threshold_name, threshold: t.threshold, warning: warning}
      });
    },

    emitPropose(){
      this.$refs.thresholdname.validate();
      if(this.$refs.thresholdname.hasError){
        return;
      }
      let action = JSON.parse(JSON.stringify(this.action))

      let title = `Link threshold`;
      let description = `Link threshold "${action.data.threshold_name}" to ${action.data.contract}::${action.data.action_name}`;

      const payload = {
        actions: [action],
        description: description,
        title: title     
      }
      this.$emit('propose', payload);
    },
    emitBucket(){
      this.$refs.thresholdname.validate();
      if(this.$refs.thresholdname.hasError){
        return;
      }
      let action = JSON.parse(JSON.stringify(this.action))
      this.$emit('addtobucket', action);     
    }
  },
  mounted(){
    this.action.account = this.getActiveGroup;


  },
  watch: {

  }
};
</script>
