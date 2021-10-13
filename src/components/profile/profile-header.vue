<template>
  <div>
    <q-card>

    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
    >


      <q-card-section v-if="view == 'header'" key="header">
        <q-item>
          <q-item-section avatar>
            <profile-pic
              style="margin-left:-15px"
              :size="85"
              iconColor="white"
              iconBackground="bg-primary"
              :account="account"
              :tooltip="false"
              :icon="account == getAccountName ? 'mdi-plus' : ''"
              @iconClick="edit_avatar = !edit_avatar"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-light text-h5">{{
              account
            }}</q-item-label>
            <q-item-label  caption>
              <span v-if="getIsGuardian(account)">Guardian</span>
              <!-- <span v-if="getIsMember">Member</span> -->
            </q-item-label>
            
          </q-item-section>
        </q-item>
        
        <transition
          appear
          enter-active-class="animated fadeInDown"
          leave-active-class="animated fadeOut"
        >
          <update-profile-pic
            v-if="edit_avatar"
            @updated="edit_avatar = false"
          />
        </transition>
        <div class="row justify-end items-center">
          <q-btn @click="openURL(getSelectedBlockExplorer.base+getSelectedBlockExplorer.account+account)" class="q-mr-xs" icon="search" color="primary" size="xs" round dense flat>
            <q-tooltip content-class="bg-secondary" :delay="500">
              Explore <b>{{account}}</b> on {{getSelectedBlockExplorer.base}}
            </q-tooltip>
          </q-btn>

          <date-string v-if="is_member" prepend="Member since:" :date="is_member.member_since" />
          <div v-else>Not yet a member</div>
        </div>
      </q-card-section>

      <q-card-section v-if="view == 'more'" key="more">
        <div class="q-mb-md">
            <profile-pic
              :size="36"
              iconBackground="bg-primary"
              :account="account"
              :tooltip="false"
            />
            {{account}}
        </div>
        <div class="q-gutter-md">
          <q-btn v-if="getIsMember" label="unregister" color="primary" @click="unregmember" :loading="is_unregging">
            <q-tooltip content-class="bg-secondary" :delay="500">
              Unregister as member.
            </q-tooltip>
          </q-btn>
          <q-btn label="delete profile" color="primary" @click="delprofile" :loading="is_clearing_profile">
            <q-tooltip content-class="bg-secondary" :delay="500">
              Clear all profile data inclusive avatar. This requires a page reload.
            </q-tooltip>
          </q-btn>

          <q-btn-dropdown
            v-if="getIsMember && userterms_enabled"
            color="primary"
            :label="getRequireUsertermsAgreement?'you have not agreed the latest userterms':`Agreed v${getIsMember.agreed_userterms_version}`"
            :split="true"
            :icon="getRequireUsertermsAgreement?'mdi-alert':'mdi-check'"
            v-model="userterms_dropdown_open"
            @click="userterms_dropdown_open=true"
            :loading="is_signing_terms"
          >
            <q-list class="primary-hover-list">
              <q-item v-if="getRequireUsertermsAgreement" clickable v-close-popup  @click="signuserterms(true)">
                <q-item-section>
                  <q-item-label>Agree userterms v{{getLatestUserterms.id}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-else clickable v-close-popup  @click="signuserterms(false)">
                <q-item-section>
                  <q-item-label>Disagree userterms v{{getLatestUserterms.id}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup  @click="userterms_modal=true">
                <q-item-section>
                  <q-item-label>View latest userterms v{{getLatestUserterms.id}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

        </div>
      </q-card-section>
    </transition>

      <q-btn
        v-if="account == getAccountName"
        :icon="view == 'header' ? 'mdi-dots-vertical' : 'mdi-close'"
        flat
        round
        dense
        class="absolute-top-right q-ma-md"
        @click="changeView"
      />
    </q-card>



    <q-dialog v-model="userterms_modal" maximized>
      <q-card class="overflow-hidden">
        <q-card-section>
            <page-header :title="`Userterms v${getLatestUserterms.id}`"/>
            <q-btn icon="close" flat round dense v-close-popup class="q-ma-md absolute-top-right"/>
            <div class="q-mt-md">
              <latest-userterms signButtons/>
            </div>

        </q-card-section>
      </q-card>
    </q-dialog>


  </div>
</template>

<script>
import { mapGetters } from "vuex";
import profilePic from "components/profile-pic";
import updateProfilePic from "components/update-profile-pic";
import dateString from "components/date-string";
import latestUserterms from "components/latest-userterms";
import pageHeader from "components/page-header";
import {openURL} from "quasar";
export default {
  name: "profileHeader",
  props: {
    account: ""
  },
  components: {
    profilePic,
    updateProfilePic,
    dateString,
    latestUserterms,
    pageHeader
  },
  data() {
    return {
      edit_avatar: false,
      view: "header",
      is_unregging: false,
      is_clearing_profile: false,
      userterms_dropdown_open: false,
      is_signing_terms: false,
      is_member: false,
      userterms_modal: false
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getIsGuardian: "group/getIsGuardian",
      getIsMember: "user/getIsMember",
      getSelectedBlockExplorer: "user/getSelectedBlockExplorer",
      getRequireUsertermsAgreement: "user/getRequireUsertermsAgreement",
      getLatestUserterms: "group/getLatestUserterms",
      getCoreConfig: "group/getCoreConfig",
    }),
    userterms_enabled(){
      if(this.getCoreConfig){
        return this.getCoreConfig.conf.userterms;
      }
      else{
        return false;
      }
      
    }
  },
  methods:{
    openURL,
    changeView(){
      if(this.view !="header"){
        this.view = 'header';
      }
      else{
        this.view = 'more'
      }
    },
    async unregmember(){
      let action = {
        account: this.getActiveGroup,
        name: "unregmember",
        data: {
          actor: this.getAccountName
        }
      };
      this.is_unregging = true;
      let res = await this.$store.dispatch("ual/transact", { actions: [action], disable_signing_overlay: true  });
      if(res && res.trxid){
        this.$store.commit('user/setIsMember', false);
        this.is_member = false;
      }
      this.is_unregging = false;


    },
    async delprofile(){
      let action = {
        account: this.getActiveGroup,
        name: "delprofile",
        data: {
          actor: this.getAccountName
        }
      };
      this.is_clearing_profile = true;
      let res = await this.$store.dispatch("ual/transact", { actions: [action], disable_signing_overlay: true  });
      if(res && res.trxid){
        this.$store.commit('user/delProfile', this.getAccountName);
      }
      this.is_clearing_profile = false;


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
    account:{
      immediate: true,
      handler: async function(newV, oldV){
        if(newV && newV != oldV){
          this.is_member = await this.$store.dispatch('user/fetchIsMember', this.account);
        }
        
      }
    }
  }
};
</script>
