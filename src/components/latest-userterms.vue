<template>
<div v-if="getLatestUserterms">



  <!-- {{getIsMember}}
  {{getLatestUserterms}} -->

    <q-card-section v-if="!is_loading">
      <q-markdown
        v-if="getLatestUserterms.data!==false"
        :no-abbreviation="false"
        :src="getLatestUserterms.data"
      >
      </q-markdown>
      <div class="row justify-between">
        <date-string prepend="published:" :date="getLatestUserterms.published" />
        <div v-if="signButtons">
          <q-btn v-if="getRequireUsertermsAgreement" @click="signuserterms(true)" label="agree" color="primary" :loading="is_signing_terms"/>
          <q-btn v-else @click="signuserterms(false)" label="disagree" color="primary" :loading="is_signing_terms"/>
        </div>
      </div>
    </q-card-section>
    <q-card-section v-else class="row justify-center">
      <q-spinner color="primary" size="40px" />
    </q-card-section>

</div>
</template>

<script>
import { mapGetters } from "vuex";
import {notifyError} from '../imports/notifications.js';
import {get_content_from_trace} from '../imports/helpers.js';
import dateString from "components/date-string";
export default {
  name: 'latestUserterms',
  props:{
    signButtons:{
      type:Boolean,
      default: false
    }
  },
  components:{
    dateString
  },
  data () {
    return {
      is_loading: false,
      is_signing_terms: false
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getIsMember: "user/getIsMember",
      getLatestUserterms: "group/getLatestUserterms",
      getRequireUsertermsAgreement: "user/getRequireUsertermsAgreement",
    })
  },
  methods:{
    async loadUserterms(){
        let userterms =this.getLatestUserterms;
        if(userterms.data ===false){
          this.is_loading = true;
          let termsobj = await get_content_from_trace(userterms.trx_id, userterms.block_num, "fileupload", "content" );
          //get_content_from_trace(trxid, block_num, actionname, datakey )
          if(termsobj.error || !termsobj.found){
            notifyError({message : `Error getting the latest userterms` });
          }
          else{
            userterms.data = termsobj.content
          }
          this.is_loading = false;

        }

    },
    async signuserterms(agreed=true){
      let action = {
        account: this.getActiveGroup,
        name: "signuserterm",
        data: {
          member: this.getAccountName,
          agree_terms: agreed
        }
      };
      this.is_signing_terms = true;
      let res = await this.$store.dispatch("ual/transact", { actions: [action], disable_signing_overlay: true  });
      if(res && res.trxid){
        let new_version = agreed ? this.getLatestUserterms.id : 0;
        let memberobj = Object.assign(this.getIsMember, {agreed_userterms_version:new_version});
        this.$store.commit('user/setIsMember', memberobj);
      }
      this.is_signing_terms = false;
    }
  },
  watch:{
    getLatestUserterms:{
      immediate: true,
      handler: function(newV, oldV){
        if(newV)
        this.loadUserterms()
      }
    }
  }
}
</script>
