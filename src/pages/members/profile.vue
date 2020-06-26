<template>
  <q-page padding class="constrain-page-width">
    <div class="row q-col-gutter-md">
      <div class="col-xs-12">
        <q-card>
          <q-card-section>
            <q-item>
              <q-item-section avatar>
                <profile-pic
                  style="margin-left:-15px"
                  :size="100"
                  iconColor="white"
                  iconBackground="bg-primary"
                  :account="account"
                  :tooltip="false"
                  :icon="account == getAccountName ? 'mdi-plus' : ''"
                  @iconClick="edit_avatar = !edit_avatar"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-light text-h4">{{
                  account
                }}</q-item-label>
                <q-item-label v-if="getIsCustodian(account)" caption
                  >Custodian</q-item-label
                >
              </q-item-section>
              <!-- <q-item-section side>
            <imalive-btn v-if="custodian.account == getAccountName" />
          </q-item-section> -->
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
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-12" v-if="getElectionsContract">
        <q-card>
          {{votedFor}}
        </q-card>
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
                label="(Edit)"
                class="text-grey"
                name="text"
              >
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
              <q-tab
                :label="`Files (${profile_data.files.length})`"
                name="files"
              >
                <q-icon
                  name="mdi-pencil"
                  v-if="
                    isProfileChanged &&
                      isProfileChanged.find(ipc => ipc.path == 'gallery')
                  "
                />
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
              <q-tab-panel name="text" class="overflow-hidden">
                <text-edit :account="account" :profile_data="profile_data" />
              </q-tab-panel>
              <q-tab-panel name="textview" class="overflow-hidden">
                <profile-text :account="account" :profile_data="profile_data" />
              </q-tab-panel>
              <q-tab-panel name="links" class="overflow-hidden">
                <profile-links
                  :account="account"
                  :profile_data="profile_data"
                />
              </q-tab-panel>
              <q-tab-panel name="files" class="overflow-hidden">
                <profile-files
                  :account="account"
                  :profile_data="profile_data"
                />
              </q-tab-panel>
              <q-tab-panel name="gallery" class="overflow-hidden">
                <profile-gallery
                  :account="account"
                  :profile_data="profile_data"
                />
              </q-tab-panel>
            </q-tab-panels>

            <div class="row justify-between items-center">
              <div v-if="profile_data" class="text-caption text-grey">
                <date-string
                  prepend="Updated:"
                  :date="profile_data.last_update"
                />
              </div>
              <!-- <div v-if="profile_data && profile_data.account==getAccountName && active_tab != 'textview'" class="text-caption">
          <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
            <q-btn  v-if="isProfileChanged" label="update" class="pulse" color="primary" @click="updateProfileDataKey" :loading="is_transacting"/>
          </transition>
        </div> -->
            </div>
            <!-- {{profile_data}} -->
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
import profilePic from "components/profile-pic";
import updateProfilePic from "components/update-profile-pic";
import profileText from "components/profile_data/profile-text";
import profileLinks from "components/profile_data/profile-links";
import profileFiles from "components/profile_data/profile-files";
import profileGallery from "components/profile_data/profile-gallery";
import textEdit from "components/profile_data/text-edit";
import dateString from "components/date-string";
import { diff } from "deep-diff";

import componentLoader from "components/component-loader";
//window.httpVueLoader('http://localhost:8080/statics/test_component.vue')
//const externalComponent = httpVueLoader("https://raw.githubusercontent.com/eosgroups/eosgroups-frontend/master/src/components/external-component.vue");
export default {
  name: "profile",
  components: {
    profilePic,
    updateProfilePic,
    profileText,
    profileLinks,
    profileFiles,
    profileGallery,
    textEdit,
    dateString,
    componentLoader
    // externalComponent
    // externalComponent: window.httpVueLoader("https://raw.githack.com/eosgroups/eosgroups-frontend/master/src/components/external-component.vue")
  },
  data() {
    return {
      profile_data: null,
      account: null,
      edit_avatar: false,
      active_tab: "textview",
      is_transacting: false,
      votedFor: []
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getIsCustodian: "group/getIsCustodian",
      getMyOldProfile: "group/getMyOldProfile",
      getElectionsContract: "elections/getElectionsContract"
      // getActiveGroupConfig: "group/getActiveGroupConfig",
      // getCoreConfig: "group/getCoreConfig"
    }),
    isProfileChanged() {
      if(this.getMyOldProfile && this.profile_data && this.profile_data.account == this.getMyOldProfile.account){
        return diff(this.getMyOldProfile, this.profile_data);
      }
      
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
      if (res && res.transactionId && res.status == "executed") {
        //this.$store.commit('group/updateAvatar', {account: this.getAccountName, img_url: this.new_avatar});
        this.$store.commit(
          "group/setMyOldProfile",
          JSON.parse(JSON.stringify(this.profile_data))
        );
      } else {
        //return false;
      }
      this.is_transacting = false;
    },
    async getUserVotes(){
      if(this.getElectionsContract){
        this.votedFor = await this.$store.dispatch('elections/fetchUserVotes', {voter:this.account} );
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
          this.getUserVotes();
          //console.log(this.profile_data)
        } else {

          //this.$store.dispatch('user/loggedOutRoutine');
        }
      }
    },
    // getAccountName:{
    //   immediate: true,
    //   handler(newVal, oldVal){
    //     if(this.account == this.getAccountName && this.profile_data){
    //       this.$store.commit("group/setMyOldProfile", JSON.parse(JSON.stringify(this.profile_data)))
    //     }
    //   }
    // }
  }
};
</script>
