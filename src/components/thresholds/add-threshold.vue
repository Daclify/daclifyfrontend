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
          isValidAccountName
          ]"
      >
        <!-- <template v-slot:prepend>
            xxx
        </template> -->

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
        <!-- <template v-slot:append>
          xxxx
        </template>
        <template  v-slot:hint>
          <transition  enter-active-class="animated zoomIn" leave-active-class="animated zoomOut"  tag="div" >
            xxx
          </transition>
        </template> -->
      </q-input>
    </div>


<!-- {{recurrence_delay}} -->
    <div class="row justify-between full-width items-center" >
      <threshold-badge  label :contract="action.account" :action_name="action.name"/>
      <propose-bucket-btn @click-propose="emitPropose" @click-bucket="emitBucket" label="Add Threshold" :disabled="false" />
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
      getGroupWallet: "group/getGroupWallet"

    })
  },
  methods: {
    isValidAccountName,
    isExistingAccountName,

    emitPropose(){
      this.$refs.thresholdname.validate();
      this.$refs.threshold.validate();
      if(this.$refs.thresholdname.hasError || this.$refs.threshold.hasError){
        return;
      }
      let action = JSON.parse(JSON.stringify(this.action))

      let title = `Add new threshold`;
      let description = `Add new threshold "${action.data.threshold_name}" with required votes ${action.data.threshold}`;

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
