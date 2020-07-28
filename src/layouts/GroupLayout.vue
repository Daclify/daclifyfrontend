<template>
  <q-layout view="hHh Lpr lff">
    <!-- Be sure to play with the Layout demo on docs "hHh Lpr fff" -->

    <!-- (Optional) The Header -->
    <q-header>
      <q-toolbar style="height:60px" class="bg-secondary">
        <q-btn
          flat
          round
          dense
          :icon="leftDrawer ? 'close' : 'menu'"
          @click="leftDrawer = !leftDrawer"
          class="q-mr-xs"
        />
        <!-- <main-logo /> -->
        <div
          class="row items-center"
          v-if="getActiveGroupConfig && getActiveGroupConfig.ui.logo"
        >
          <img
            :src="getActiveGroupConfig.ui.logo"
            style="max-height:40px; max-width:200px"
            class="gt-xs"
          />
          <img
            :src="getActiveGroupConfig.ui.logo"
            style="height:25px"
            class="lt-sm"
          />
        </div>
        <span v-else class="text-primary text-h5 text-uppercase">{{
          getActiveGroup
        }}</span>

        <q-toolbar-title> </q-toolbar-title>
        <login-network-switcher />
      </q-toolbar>
    </q-header>

    <!-- (Optional) The Footer -->
    <q-footer class="bg-secondary" style="height:80px">
      <div></div>
    </q-footer>

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-drawer
      v-model="leftDrawer"
      behavior="default"
      side="left"
      :width="275"
      :bordered="false"
      :show-if-above="false"
      content-class="bg-secondary"
      :mini="miniState"
      @mouseover="/*miniState = false*/"
      @mouseout="/*miniState = false*/"
    >
      <q-list class="absolute-top" >
        <q-item clickable style="height:60px" v-ripple:primary>
          <q-item-section avatar>
            <q-icon name="mdi-account-group" color="primary" style="margin-top:-4px"/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-primary text-uppercase" style="margin-left:-29px">{{ getActiveGroup }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label>
              <span class="text-capitalize">{{menu_mode}} <q-icon name="mdi-export" /></span>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-menu
          fit
          transition-show="scale"
          transition-hide="scale"
        >
          <q-list style="min-width: 200px" class="primary-hover-list" separator >

            <q-item v-if="getCoreConfig && menu_mode=='management'" clickable  v-close-popup class="text-right">
              <q-item-section side>
                <q-btn round icon="close" flat color="primary" />
              </q-item-section>
              <q-item-section v-if="getCoreConfig.conf.member_registration" @click="menu_mode='members'">
                <q-item-label>Members</q-item-label>
                <q-item-label caption>Switch To Member Menu</q-item-label>
              </q-item-section>
              <q-item-section v-else>
                <q-item-label>Members Disabled</q-item-label>
                <!-- <q-item-label caption>This group doesn't accept member registrations</q-item-label> -->
              </q-item-section>
            </q-item>

            <q-item v-if="menu_mode=='members'" clickable  v-close-popup class="text-right">
              <q-item-section side>
                <q-btn round icon="close" flat color="primary" />
              </q-item-section>
              <q-item-section @click="menu_mode='management'">
                <q-item-label>Management</q-item-label>
                <q-item-label caption>Switch To Management Menu</q-item-label>
              </q-item-section>
            </q-item>

          </q-list>
        </q-menu>
      </q-list>


      <q-scroll-area :style="`height:calc(100% - 60px); margin-top: 60px; `" class="overflow-hidden">

        <transition tag="div" appear enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutLeft" mode="out-in">
          <management-menu v-if="menu_mode=='management'" key="management_menu"/>
          <members-menu v-if="menu_mode=='members'" key="members_menu"/>
        </transition>

        <q-list class="text-grey-4">

          <q-item clickable @click="loadGroup(getActiveGroup)" >
            <q-item-section avatar>
              <q-icon v-if="!group_is_loading" name="refresh" />
              <q-spinner v-else color="primary" size="20px" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Reload Group</q-item-label>
              <!-- <q-item-label caption>mining stats</q-item-label> -->
            </q-item-section>
          </q-item>

          <q-item clickable to="/browse">
            <q-item-section avatar>
              <q-icon  name="search" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Browse Groups</q-item-label>
              <!-- <q-item-label caption>mining stats</q-item-label> -->
            </q-item-section>
          </q-item>



          <!-- <q-item clickable >
            <q-item-section avatar>
              <q-icon  name="mdi-school" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Documentation</q-item-label>
              <q-item-label caption>stay tuned</q-item-label>
            </q-item-section>
          </q-item> -->

        </q-list>
        
      </q-scroll-area>
      <q-toggle v-model="miniState" class="absolute-bottom-right">
        <q-tooltip content-class="bg-primary" :delay="500">
          Toggle mini menu
        </q-tooltip>
      </q-toggle>
    </q-drawer>

    <q-page-container class=" text-black  overflow-hidden" style="padding-bottom:80px">
      <transition
        appear
        enter-active-class="animated fadeInRight"
        mode="out-in"
      >
        <router-view v-if="getActiveGroup" />
      </transition>
      <q-page-scroller
        position="bottom-right"
        :scroll-offset="150"
        :offset="[18, 18]"
      >
        <q-btn fab icon="keyboard_arrow_up" color="primary" />
      </q-page-scroller>
    </q-page-container>
    
  </q-layout>
</template>

<script>
import { colors } from "quasar";
const { getBrand } = colors;
import { mapGetters } from "vuex";
import loginNetworkSwitcher from "components/ual/login-network-switcher";
import managementMenu from "components/menus/management-menu";
import membersMenu from "components/menus/members-menu";
import {notifyInfo} from '../imports/notifications.js';


export default {
  // name: 'LayoutName',
  components: {
    loginNetworkSwitcher,
    managementMenu,
    membersMenu
  },
  data() {
    return {
      leftDrawer: true,
      miniState: this.$store.state.user.miniState,
      group_is_loading: false,
      selected_group: "",
      menu_mode: "management"
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getActiveGroupConfig: "group/getActiveGroupConfig",
      getCoreConfig: "group/getCoreConfig",
      getElectionsConfig: "elections/getElectionsConfig"
    }),
    groupconfigAndAccountLoaded(){
      return {getActiveGroupConfig: this.getActiveGroupConfig, getAccountName: this.getAccountName}
    }
  },
  methods: {
    getBrand,
    async loadGroup(groupname) {
      this.group_is_loading = true;
      await this.$store.dispatch("group/loadGroupRoutine", {
        groupname: groupname
      });
      await new Promise(resolve => setTimeout(resolve, 400));
      this.$q.addressbarColor.set(getBrand('primary'));
      this.group_is_loading = false;
    }

  },
  mounted(){
    if(this.$route.path.startsWith('/manage') ){
      this.menu_mode = 'management';
    }
    else if(this.$route.path.startsWith('/members') ){
      this.menu_mode = 'members';
    }
  },

  watch: {
    "$route.params.groupname": {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal && newVal != oldVal) {
          this.loadGroup(newVal);
        } else {
          //this.$store.dispatch('user/loggedOutRoutine');
        }
      }
    },
    menu_mode: {
      immediate: false,
      handler(newVal, oldVal) {
        if (newVal =="members") {
          console.log(`/members/${this.$route.params.groupname}/dashboard`)
          if (this.$route.path.split('/')[1] === 'members') return
          if(this.getAccountName){
            this.$router.push(`/members/${this.$route.params.groupname}/profile/${this.getAccountName}`).catch(err => {});
          }
          else{
            if(this.getElectionsConfig && this.getElectionsConfig.elections){
              this.$router.push(`/members/${this.$route.params.groupname}/elections`).catch(err => {});
            }
            else{
              this.$router.push(`/members/${this.$route.params.groupname}/register`).catch(err => {});
            }
            
          }
          
          notifyInfo({message: `you switched to members menu.`})
        } else {
          //this.$store.dispatch('user/loggedOutRoutine');
          this.$router.push(`/manage/${this.$route.params.groupname}`).catch(err => {});
          notifyInfo({message: `you switched to management menu.`})
        }
      }
    },

    groupconfigAndAccountLoaded:{
      immediate: true,
      handler(newV, oldV){
        if(newV && this.getAccountName && this.getActiveGroupConfig){
          this.$store.dispatch('user/fetchIsMember', this.getAccountName)
        }
      }
    },

    miniState:{
      immediate:true,
      handler(newVal, oldval){
        this.$store.commit('user/setMiniState', newVal );
      }
    }

  }
};
</script>
