<template>
  <q-page padding class="constrain-page-width">
    <div class="row q-col-gutter-md">
      <div class="col-xs-12">
        <profile-header :account="account"/>
      </div>
      <div class="col-xs-12" v-if="getElectionsContract && userVotes">

          <display-votes :votes="userVotes"/>

      </div>
      <div class="col-xs-12">
        <!-- {{isProfileChanged}} -->
        <!-- {{getMyOldProfile}} -->
        <q-card v-if="profile_data">
          <q-card-section>
            <!-- {{profile_data}} -->
            <q-tabs
              v-model="active_tab"
              class="text-primary"
              dense
              align="left"
            >
              <q-tab
                v-if="account == getAccountName"
                class="text-grey"
                name="text"
                @mouseover="edit_tab_show=true" @mouseout="edit_tab_show=false"
              >
                <div >
                <q-icon name="edit" class="q-mr-xs"/>
                <span v-show="edit_tab_show" key="t">edit</span>
                </div>
              </q-tab>
              <q-tab :label="`Profile`" name="textview">
                <q-icon
                  name="mdi-pencil"
                  v-if="
                    isProfileChanged &&
                      isProfileChanged.find(ipc => ipc.path == 'text')
                  "
                />
              </q-tab>
              <q-tab
                :label="`Links (${profile_data.links.length})`"
                name="links"
              >
                <q-icon
                  name="mdi-pencil"
                  v-if="
                    isProfileChanged &&
                      isProfileChanged.find(ipc => ipc.path == 'links')
                  "
                />
              </q-tab>
              <q-tab
                :label="`Gallery (${profile_data.gallery.length})`"
                name="gallery"
              >
                <q-icon
                  name="mdi-pencil"
                  v-if="
                    isProfileChanged &&
                      isProfileChanged.find(ipc => ipc.path == 'gallery')
                  "
                />
              </q-tab>
              <!-- <q-tab
                :label="`Files (${profile_data.files.length})`"
                name="files"
              >
                <q-icon
                  name="mdi-pencil"
                  v-if="
                    isProfileChanged &&
                      isProfileChanged.find(ipc => ipc.path == 'files')
                  "
                />
              </q-tab> -->
              <q-tab
                v-if="mutated_load_my_payments"
                label="my payments"
                name="mypayments"
              >
              </q-tab>
              <!-- <q-btn class="absolute-right" icon="check" /> -->
              <div
                class="absolute-right overflow-hidden"
                v-if="profile_data && profile_data.account == getAccountName"
              >
                <transition
                  enter-active-class="animated fadeInRight"
                  leave-active-class="animated fadeOutRight"
                >
                  <q-btn
                    v-if="isProfileChanged"
                    :class="!!isProfileChanged ? '' : ''"
                    label="update"
                    color="primary"
                    @click="updateProfileDataKey"
                    :loading="is_transacting"
                  >
                    <q-tooltip content-class="bg-secondary" :delay="700">
                      Click update when you are ready. 
                    </q-tooltip>
                  </q-btn>
                </transition>
              </div>
            </q-tabs>
            <q-separator />
            <q-tab-panels
              v-model="active_tab"
              animated
              transition-prev="fade"
              transition-next="fade"
              
            >
           
              <q-tab-panel name="text" class="overflow-hidden no-padding">
                <text-edit :account="account" :profile_data="profile_data" />
              </q-tab-panel>
              <q-tab-panel name="textview" class="overflow-hidden no-padding">
                <profile-text :account="account" :profile_data="profile_data" class="q-mt-md" />
              </q-tab-panel>
              <q-tab-panel name="links" class="overflow-hidden no-padding">
                <profile-links
                  :account="account"
                  :profile_data="profile_data"
                  class="q-mt-md"
                />
              </q-tab-panel>
              <q-tab-panel name="files" class="overflow-hidden no-padding">
                <profile-files
                  :account="account"
                  :profile_data="profile_data"
                />
              </q-tab-panel>
              <q-tab-panel name="gallery" class="overflow-hidden no-padding">
                <profile-gallery
                  :account="account"
                  :profile_data="profile_data"
                />
              </q-tab-panel>
              <q-tab-panel name="mypayments" class="overflow-hidden no-padding">
                <my-payments :payments="my_payments"  class="q-mt-md"/>
              </q-tab-panel>
            </q-tab-panels>

            <q-separator class="q-my-md" />
            <div class="row justify-between items-center ">
              <div v-if="profile_data" class="text-caption text-grey">
                <date-string
                  prepend="Updated:"
                  :date="profile_data.last_update"
                />
              </div>

            </div>
            <!-- {{profile_data}}
            <div>{{getMyOldProfile}}</div>
            <div>{{isProfileChanged}}</div> -->
          </q-card-section>
        </q-card>
      </div>
      <!-- <external-component  account="piecesnbits1" /> -->
      <!-- <component-loader :comp_id="102" /> -->
     
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";

import profileText from "components/profile/profile-text";
import profileHeader from "components/profile/profile-header";
import profileLinks from "components/profile/profile-links";
import profileFiles from "components/profile/profile-files";
import profileGallery from "components/profile/profile-gallery";
import textEdit from "components/profile/text-edit";

import myPayments from "components/modules/payroll/my-payments";
import displayVotes from "components/modules/elections/display-votes";

import dateString from "components/date-string";
import { diff } from "deep-diff";

import componentLoader from "components/component-loader";
//window.httpVueLoader('http://localhost:8080/statics/test_component.vue')
//const externalComponent = httpVueLoader("https://raw.githubusercontent.com/eosgroups/eosgroups-frontend/master/src/components/external-component.vue");
export default {
  name: "profile",
  components: {
    profileHeader,
    profileText,
    profileLinks,
    profileFiles,
    profileGallery,
    textEdit,
    dateString,

    myPayments,
    displayVotes,
    
    componentLoader
    // externalComponent
    // externalComponent: window.httpVueLoader("https://raw.githack.com/eosgroups/eosgroups-frontend/master/src/components/external-component.vue")
  },
  data() {
    return {
      profile_data: null,
      account: null,

      edit_tab_show: false,
      
      active_tab: "textview",
      is_transacting: false,
      userVotes: [],
      my_payments: []
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getIsGuardian: "group/getIsGuardian",
      getMyOldProfile: "group/getMyOldProfile",
      getElectionsContract: "elections/getElectionsContract",
      getModuleByName: "group/getModuleByName",
      
      
      // getActiveGroupConfig: "group/getActiveGroupConfig",
      // getCoreConfig: "group/getCoreConfig"
    }),
    isProfileChanged() {
      if(this.getMyOldProfile && this.profile_data && this.profile_data.account == this.getMyOldProfile.account){
        return diff(this.getMyOldProfile, this.profile_data);
      }
    },
    mutated_load_my_payments(){
      let payroll = this.getModuleByName("payroll");
      return (this.getAccountName == this.account &&  payroll)
    }

  },
  methods: {
    async updateProfileDataKey() {
      this.is_transacting = true;
      let must_stringify = true;
      let actions = [];
      if (!this.isProfileChanged) return;
      for (let i = 0; i < this.isProfileChanged.length; i++) {
        const key = this.isProfileChanged[i].path[0];

        let action = {
          account: this.getActiveGroup,
          name: "updatprofile",
          data: {
            actor: this.getAccountName,
            key: key,
            data:
              key == "text"
                ? this.profile_data[key]
                : JSON.stringify(this.profile_data[key])
          }
        };
        actions.push(action);
      }

      let res = await this.$store.dispatch("ual/transact", {
        actions: actions,
        disable_signing_overlay: true
      });
      if (res && res.trxid) {
        //this.$store.commit('group/updateAvatar', {account: this.getAccountName, img_url: this.new_avatar});
        
        this.$store.commit("group/updateProfileTimestamp", {account:this.getAccountName,timestamp:res.block_time});
        this.$store.commit("group/setMyOldProfile",JSON.parse(JSON.stringify(this.profile_data)) );
      } else {
        //return false;
      }
      this.is_transacting = false;
    },
    async getUserVotes(){
      if(this.getElectionsContract){
        this.userVotes = await this.$store.dispatch('elections/fetchUserVotes', {voter:this.account} );
      }
    }
  },

  watch: {
    "$route.params.accountname": {
      immediate: true,
      async handler(newVal, oldVal) {
        
        if (newVal && newVal != oldVal) {

          this.account = newVal;
          this.profile_data = await this.$store.dispatch("group/fetchProfile",this.account);
          this.active_tab= "textview";
          this.getUserVotes();
          //console.log(this.profile_data)
        } else {

          //this.$store.dispatch('user/loggedOutRoutine');
        }
      }
    },

    // getAccountName:{
    //   immediate: true,
    //   handler: function(newV, oldV){
    //     if(newV && newV != oldV && newV == this.account){

    //     }
    //   }
    // },
    mutated_load_my_payments:{
      immediate: true,
      handler: async function(newV, oldV){
        if(newV && newV!= oldV){
          this.my_payments = await this.$store.dispatch("payroll/fetchUserPayments", {contract: this.getModuleByName("payroll").slave_permission.actor, account: this.account});
        }
      }
    }

  }
};
</script>
