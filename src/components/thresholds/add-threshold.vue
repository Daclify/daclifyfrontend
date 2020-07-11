<template>
  <div class="row  q-col-gutter-md q-pb-xs q-mt-md">
    <!-- {{payroll}} -->
    <div class="col-xs-12 col-sm-6">
      <q-input
        ref="thresholdname"
        v-model="action.data.threshold_name" 
        label="Name" 
        placeholder="threshold name"
        outlined 
        bottom-slots
        maxlength="12"
        :rules="[
          val => !!val || '* Required',
          isValidAccountName,
          val => val!='default' || 'can\'t update the default threshold',
          ]"
      >
        <template v-slot:hint>
            <div class="text-warning row items-center" v-if="is_existing_threshold">
              <q-icon name="mdi-alert" class="q-mr-xs" />
              <span>Update existing threshold (current: {{is_existing_threshold.threshold}})</span>
            </div>
        </template>

      </q-input>
    </div>

    
    <div class="col-xs-12 col-sm-6">
      <q-input
        ref="threshold"
        type="number"
        v-model="action.data.threshold"
        label="Threshold"
        outlined
        bottom-slots
        placeholder="number of required votes"
        no-error-icon
        :rules="[
          val => !!val || '* Required',
          val => val >= 0 || 'Must be greater then zero'
          ]"
      >
      </q-input>
    </div>

    <div class="col-xs-12 col-sm-6" v-if="is_existing_threshold">
      <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut" mode="out-in" tag="div" >
      <q-toggle
        
        v-model="action.data.remove"
        left-label
        label="Delete this threshold"
      />
      </transition>
    </div>


<!-- {{recurrence_delay}} -->
    <div class="row justify-between full-width items-center" >
      <threshold-badge  label :contract="action.account" :action_name="action.name"/>
      <propose-bucket-btn @click-propose="emitPropose" @click-bucket="emitBucket" :label="is_existing_threshold?'update threshold': 'Add Threshold'" :disabled="false" />
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
  name: "addThreshold",
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
        name: "manthreshold",
        data: {
          threshold_name: "",
          threshold: "",
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

    }),
    is_existing_threshold(){
      if(this.action.data.threshold_name=="default") return false;
      return this.getThresholds.find(t=> t.threshold_name == this.action.data.threshold_name);
    }
  },
  methods: {
    isValidAccountName,
    isExistingAccountName,

    emitPropose(){
      this.$refs.thresholdname.validate();
      if(!this.action.data.remove){
        this.$refs.threshold.validate();
      }

      if(this.$refs.thresholdname.hasError || this.$refs.threshold.hasError){
        return;
      }
      let action = JSON.parse(JSON.stringify(this.action))

      let title = `Add new threshold`;
      let description = `Add new threshold "${action.data.threshold_name}" with required votes ${action.data.threshold}`;

      if(this.is_existing_threshold && !action.data.remove){
        title = "Update threshold"
        description = `Update number of required approvals from threshold "${action.data.threshold_name}" from ${this.is_existing_threshold.threshold} to ${action.data.threshold}`;
      }
      else if(this.is_existing_threshold && action.data.remove){
        action.data.threshold = 0
        title = "Delete threshold"
        description = `Delete existing threshold "${action.data.threshold_name}"`;
      }

      const payload = {
        actions: [action],
        description: description,
        title: title     
      }
      this.$emit('propose', payload);
    },
    emitBucket(){
      this.$refs.thresholdname.validate();
      this.$refs.threshold.validate();
      if(this.$refs.thresholdname.hasError || this.$refs.threshold.hasError){
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
