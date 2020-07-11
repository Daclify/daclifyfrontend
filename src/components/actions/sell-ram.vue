<template>
  <div class="q-col-gutter-md q-pb-xs">
    <q-input
      v-model="action.data.account"
      label="account"
      outlined
      bottom-slots
      readonly
    />
    <q-input
      ref="bytes"
      type="number"
      v-model="action.data.bytes"
      label="bytes"
      outlined
      bottom-slots
      placeholder="amount of bytes to sell"
      no-error-icon
      :rules="[
        val => !!val || '* Required',
        val => val > 1 || 'Must be greater then one',
        validateRamBytesAmount
        ]"
    >
      <template v-slot:append>
        bytes
      </template>
    </q-input>
    <div class="row justify-between items-center">
      <threshold-badge  label :threshold="getLinkedThresholdForContractAction(action.account, action.name)"/>
      <propose-bucket-btn @click-propose="emitPropose" @click-bucket="emitBucket" label="sell ram" :disabled="false"/>
    </div>
    <!-- <pre>{{getRAMStats}}</pre> -->
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

export default {
  name: "sellRam",
  components:{
    thresholdBadge,
    proposeBucketBtn
  },
  data() {
    return {
      action:{
        account: "eosio",
        name: "sellram",
        data: {
          account: this.$store.state.group.activeGroup,
          bytes: '',
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      getRAMStats: "group/getRAMStats",
      getActiveGroup: 'group/getActiveGroup',
      getLinkedThresholdForContractAction:"group/getLinkedThresholdForContractAction"
    })
  },
  methods: {
    emitPropose(){

      this.$refs.bytes.validate();
      if(this.$refs.bytes.hasError){
        return;
      }
      let action = JSON.parse(JSON.stringify(this.action))

      const payload = {
        actions: [action],
        description: `Proposal to sell ram from "${this.getActiveGroup}"`,
        title: 'Sell Ram'     
      }
      console.log('sellRam component', payload)
      this.$emit('propose', payload);
    },
    emitBucket(){
      this.$refs.bytes.validate()
      if(this.$refs.bytes.hasError){
        return;
      }
      let action = JSON.parse(JSON.stringify(this.action))
      this.$emit('addtobucket', action);     
    },

    validateRamBytesAmount(v){
      // console.log(v)
      let available_bytes = this.getRAMStats.available_bytes;
      // console.log(token_from_group_wallet)
      if(!available_bytes){
        return `Group doesn't have free RAM`;
      }
      else{
        if(Number(v) > Number(available_bytes) ){
          return `Max amount is ${available_bytes} bytes`;
        }
        else{
          return true;
        }
      }
    }
  },
  watch: {
    "action.data.bytes": function(newV, oldV) {
      if (this.action.data.bytes) {
        this.action.data.bytes = Number(this.action.data.bytes).toFixed(0);
      }
    }
  }

};
</script>
