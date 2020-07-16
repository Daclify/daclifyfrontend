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
              <span v-if="getIsCustodian(account)">Custodian</span>
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
        <div class="row justify-end">
          <date-string v-if="getIsMember" prepend="Member since:" :date="getIsMember.member_since" />
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
            v-if="getIsMember"
            color="primary"
            :label="`Agreed userterms v`+getIsMember.agreed_userterms_version"
            :split="true"
            v-model="userterms_dropdown_open"
            @click="userterms_dropdown_open=true"
            :loading="is_signing_terms"
          >
            <q-list class="primary-hover-list">
              <q-item  clickable v-close-popup  @click="signuserterms(false)">
                <q-item-section>
                  <q-item-label>Disagree</q-item-label>
                  <q-item-label caption>sign disagreement</q-item-label>
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import profilePic from "components/profile-pic";
import updateProfilePic from "components/update-profile-pic";
import dateString from "components/date-string";
export default {
  name: "profileHeader",
  props: {
    account: ""
  },
  components: {
    profilePic,
    updateProfilePic,
    dateString
  },
  data() {
    return {
      edit_avatar: false,
      view: "header",
      is_unregging: false,
      is_clearing_profile: false,
      userterms_dropdown_open: false,
      is_signing_terms: false
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getIsCustodian: "group/getIsCustodian",
      getIsMember: "user/getIsMember"
    })
  },
  methods:{
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
        this.$store.commit('user/delProfile', this.getAccountName);
      }
      this.is_signing_terms = false;


    }
  },

};
</script>
