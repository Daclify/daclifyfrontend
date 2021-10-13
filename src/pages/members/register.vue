<template>
  <q-page padding class="constrain-page-width">
   <page-header title="Member Registration"/>
   <q-card>
     <q-card-section>
       <div class="row justify-between items-center">
        <div v-if="!getIsMember">You are not a member of this group</div>
        <div v-else>You are a member</div>
        <q-btn v-if="!getIsMember" label="register" color="primary" @click="regmember" :loading="is_transacting" />
        <q-btn v-else label="unregister" color="primary" @click="unregmember" :loading="is_transacting" />
       </div>
      <div v-if="getCoreConfig && getCoreConfig.conf.userterms" class="row justify-end q-mt-sm text-weight-light">
        <q-checkbox v-model="agree_terms" left-label label="I have read and I agree to the user terms." />
      </div>
     </q-card-section>
   </q-card>
  
  <q-card class="q-mt-md">
   <latest-userterms />
  </q-card>



  </q-page>
</template>

<script>

import { mapGetters } from "vuex";

import pageHeader from "components/page-header";
import latestUserterms from "components/latest-userterms";

export default {
  name: "vote",
  components: {
    pageHeader,
    latestUserterms
  },
  data() {
    return {
      agree_terms: false,
      is_transacting: false
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getIsMember: "user/getIsMember",
      getCoreConfig: "group/getCoreConfig",
      getLatestUserterms: "group/getLatestUserterms"
      // getNumberGuardians: "group/getNumberGuardians"
    })
  },
  methods: {
    async regmember(){
      let regmember = {
        account: this.getActiveGroup,
        name: "regmember",
        data: {
          actor: this.getAccountName
        }
      };

      let sign = {
        account: this.getActiveGroup,
        name: "signuserterm",
        data: {
          member: this.getAccountName,
          agree_terms: this.agree_terms
        }
      };
      let actions = [regmember];
      if(this.getCoreConfig.conf.userterms){
        actions.push(sign);
      }
      this.is_transacting = true;
      let res = await this.$store.dispatch("ual/transact", { actions: actions, disable_signing_overlay: true });
      if(res && res.trxid){
        let termsv = this.getLatestUserterms && this.getLatestUserterms.id &&  this.agree_terms ? this.getLatestUserterms.id : 0;
        this.$store.commit('user/setIsMember', {account:this.getAccountName, member_since:res.block_time, agreed_userterms_version:termsv});
      }
      this.is_transacting = false;

    },
    async unregmember(){
      let action = {
        account: this.getActiveGroup,
        name: "unregmember",
        data: {
          actor: this.getAccountName
        }
      };
      this.is_transacting = true;
      let res = await this.$store.dispatch("ual/transact", { actions: [action], disable_signing_overlay: true  });
      if(res && res.trxid){
        this.$store.commit('user/setIsMember', false);
      }
      this.is_transacting = false;

    }
  }

};
</script>
