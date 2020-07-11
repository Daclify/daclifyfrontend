<template>
  <div v-if="THRESHOLD">
    <span v-if="label" class="text-caption text-grey-6 q-mr-xs">Threshold:</span>
    <q-badge color="secondary" style="cursor:help">
      {{THRESHOLD.threshold_name}}
      <q-tooltip content-class="bg-secondary" :delay="300">
        {{contract}}::{{action_name}} requires {{THRESHOLD.threshold}} approval votes
      </q-tooltip>
    </q-badge>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "thresholdbadge",
  components: {
    
  },
  props:{
    threshold:{
      type: Object,
      default: ()=>{return {}}
    },
    label:{
      type: Boolean,
      default: false
    },
    contract:{
      type: String,
      default: ''
    },
    action_name:{
      type:String,
      default: '' 
    }
  },
  data() {
    return {
      THRESHOLD: ''
    };
  },
  computed: {
    ...mapGetters({
      getLinkedThresholdForContractAction:"group/getLinkedThresholdForContractAction"
    })
  },
  mounted() {
    if(Object.keys(this.threshold).length){
      this.THRESHOLD = this.threshold;
    }
    else if(this.contract || this.action_name){
      this.THRESHOLD = this.getLinkedThresholdForContractAction(this.contract, this.action_name);
    }
    else{
      throw new Error('Wrong props for threshold badge');
    }
  }

};
</script>
