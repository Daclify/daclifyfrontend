<template>
  <div>
    <q-card>

    <transition
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
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
              <span v-if="getIsMember">Custodian</span>
            </q-item-label
            >
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
      </q-card-section>

      <q-card-section v-if="view == 'more'" key="more">
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
        </div>
      </q-card-section>
    </transition>

      <q-btn
        v-if="account == getAccountName"
        :icon="view == 'header' ? 'mdi-dots-vertical' : 'mdi-close'"
        flat
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
export default {
  name: "profileHeader",
  props: {
    account: ""
  },
  components: {
    profilePic,
    updateProfilePic
  },
  data() {
    return {
      edit_avatar: false,
      view: "header",
      is_unregging: false,
      is_clearing_profile: false
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
      if(res && res.transactionId && res.status == "executed"){
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
      if(res && res.transactionId && res.status == "executed"){
        this.$store.commit('user/delProfile', this.getAccountName);
      }
      this.is_clearing_profile = false;


    }
  },

};
</script>
