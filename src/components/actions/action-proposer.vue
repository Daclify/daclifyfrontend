<template>
  
    <q-tab-panels v-model="propose_state_tab" animated class="fit bg-transparent" transition-prev="fade" transition-next="fade">

      <q-tab-panel name="request_input" class="overflow-hidden no-padding fit">
        <slot :propose="proposeAction" :addtobucket="addToBucket"></slot>
      </q-tab-panel>

      <q-tab-panel name="request_signature" class="fit overflow-hidden no-padding">
        <div class="fit row justify-center items-center">
          <div class="column items-center">
            <q-spinner color="primary" size="52px" />
            <div class="text-grey-6">Waiting for signature</div>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="trx_success" class="fit overflow-hidden no-padding">
        <div class="fit row justify-center items-center">
          <div class="column items-center">
            <q-icon name="mdi-check-circle-outline" color="positive" size="52px" />
            <div class="text-grey-6">Transaction successful</div>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="trx_error" class="fit overflow-hidden no-padding">
        <div class="fit row justify-center items-center">
          <div class="column items-center">
            <q-icon name="mdi-alert-circle-outline" color="negative" size="52px" />
            <div class="text-grey-6">{{error_msg}}</div>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="add_to_bucket" class="fit overflow-hidden no-padding" style="min-height:140px">
        <div class="fit row justify-center items-center">
          <transition tag="div" appear enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
            <div class="column items-center q-mb-lg">
              <div class="relative-position" style="height:70px; width:70px">
                <bucket-svg  :size="70"/>
                <number-pop-animation :input_value="getActionBucket.length" class="absolute" style="top:35px; left:21px"/>
              </div>
              <div class="text-grey-6">Added to action bucket</div>
            </div>
          </transition>
        </div>
      </q-tab-panel>

    </q-tab-panels>
 
</template>

<script>
import { mapGetters } from "vuex";
import numberPopAnimation from 'components/number-pop-animation';
import bucketSvg from 'components/proposer/bucket-svg';
// import { action_icon_map } from "../imports/action_icon_map";
export default {
  name: "actionProposer",
  components:{
    numberPopAnimation,
    bucketSvg
  },
  data() {
    return {
      propose_state_tab: 'request_input',
      error_msg: '',
      propose_title: '',
      propose_description: ''
    };
  },
  computed: {
    ...mapGetters({
      getIsGuardian: "group/getIsGuardian",
      getActionBucket: "bucket/getActionBucket"
    })
  },
  methods: {
    // onProposeDisplayMeta(){
    //   this.propose_state_tab='propose_meta';
    // },

    async addToBucket(e_action){
      this.propose_state_tab='add_to_bucket';
      let action = e_action;
      await this.$store.dispatch('bucket/addToBucket', action);
      this.back_to_first_tab(1500);
    },
    
    async proposeAction(e_payload) {
      console.log('action_proposer',e_payload)
      this.propose_state_tab='request_signature';
      this.error_msg ='';
      try{
        let res = await this.$store.dispatch("group/propose", e_payload);

        if(res && res.trxid){
          this.propose_state_tab ="trx_success";
          this.back_to_first_tab();
        }
        else{
          this.error_msg = res.message || res;
          this.propose_state_tab ="trx_error";
          this.back_to_first_tab();
        }

      }catch(e){
        this.propose_state_tab ="trx_error";
        console.log('error catched');
        this.error_msg = e.message;
        this.back_to_first_tab();

      }
    },
    back_to_first_tab(ms=1500){
      setTimeout(()=>{
        this.propose_state_tab ="request_input";
      }, ms);
    }
  },
  mounted(){

  }
};
</script>
