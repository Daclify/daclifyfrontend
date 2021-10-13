<template>
  <div>
<!-- 
          <q-card >
            <q-expansion-item clickable group="index" v-model="expanded">
              <template v-slot:header>
                
                  <q-item-section avatar>
                    <profile-pic :size="60"  :account="guardian.account" class="shadow-3"/> 
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-weight-light text-h6">
                      <profile-link :account ="guardian.account" />
                    </q-item-label>
                    <q-item-label caption>Guardian</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <imalive-btn v-if="guardian.account == getAccountName" />
                  </q-item-section>
                
              </template>
              <q-separator />
              <div>
                <q-tabs  v-model="active_tab" class="text-primary" dense align="left">
                  <q-tab label="Info" name="info" />
                  <q-tab label="Profile" name="profile"  />
                  <q-tab icon="mdi-check" name="actions"  />
                </q-tabs>
                <q-separator />

                <q-tab-panels v-model="active_tab" animated style="height:215px">
                  <q-tab-panel name="info" class="overflow-hidden">
                    <div class="row q-col-gutter-xs ">
                    <q-item  class="col-xs-12">
                      <q-item-section avatar class="row justify-center items-center">
                        <q-circular-progress
                          show-value
                          class=""
                          :value="getImAliveStats"
                          size="35px"
                          :thickness="0.2"
                          color="primary"
                          center-color="transparent"
                          track-color="grey-4"
                        >
                          <q-icon name="mdi-heart" size="20px" :color="`primary`" :style="`filter: grayscale(${100-getImAliveStats}%); margin-top:3px`" />
                          <q-tooltip :delay="100" anchor="center right" self="center left" :offset="[10, 10]" content-class="bg-primary">
                            <span>Activity Level: <b>{{getImAliveStats.toFixed(0)}}%</b></span>
                          </q-tooltip>
                        </q-circular-progress>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-light">Last Active</q-item-label>
                        <q-item-label caption>
                          <span v-if="!guardian.last_active.startsWith('1970')"><date-string :date="guardian.last_active" /></span>
                          <span v-else>Not been Active Yet</span>
                          </q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item class="col-xs-12">
                      <q-item-section avatar class="row justify-center items-center">
                          <q-icon name="mdi-account-plus" size="25px" color="primary" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-light">Guardian Since</q-item-label>
                        <q-item-label caption><date-string :date="guardian.joined" /></q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item class="col-xs-12">
                      <q-item-section avatar class="row justify-center items-center">
                          <q-icon name="mdi-weight" size="22px" color="primary" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-light">Weight</q-item-label>
                        <q-item-label caption>{{guardian.weight}}</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item class="col-xs-12">
                      <q-item-section avatar class="row justify-center items-center">
                          <q-icon name="mdi-shield-lock" size="25px" color="primary" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-light">Permission</q-item-label>
                        <q-item-label caption>@{{guardian.authority}}</q-item-label>
                      </q-item-section>
                    </q-item>

                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="profile" class="overflow-hidden no-padding">
                    <q-scroll-area :visible="true" :thumb-style="thumbStyle" style="height: 200px; width:100%">
                      <div v-if="!profile_is_loading" class="q-px-md q-pb-md q-pt-xs">
                        <profile-text :account="guardian.account" :profile_data="profile_data" />
                        <q-btn color="primary" dense class="full-width" label="full profile" :to="`/members/${getActiveGroup}/profile/${guardian.account}`"/>
                      </div>
                      <div v-else class="column justify-center items-center" style="height:200px">
                        <q-spinner color="primary" size="40px"/>
                      </div>
                    </q-scroll-area>
                    
                  </q-tab-panel>
                </q-tab-panels>
              </div>
            </q-expansion-item>
          </q-card> -->




    <q-card class="guardian-card" >
 
      <q-item>
        <q-item-section avatar>
          <profile-pic :size="60"  :account="guardian.account" class="shadow-3"/> 
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-weight-light text-h6">
            <profile-link :account ="guardian.account" />
          </q-item-label>
          <q-item-label caption>Guardian</q-item-label>
        </q-item-section>
        <q-item-section side>
          <imalive-btn v-if="guardian.account == getAccountName" />
        </q-item-section>
      </q-item>

<div v-if="!minify">
      <q-tabs  v-model="active_tab" class="text-primary" dense align="left">
        <q-tab label="Info" name="info" />
        <q-tab label="Profile" name="profile"  />
        <!-- <q-tab icon="mdi-check" name="actions"  /> -->
      </q-tabs>
      <q-separator />

      <q-tab-panels v-model="active_tab" animated style="height:215px">
        <q-tab-panel name="info" class="overflow-hidden">
          <div class="row q-col-gutter-xs ">
          <q-item  class="col-xs-12">
            <q-item-section avatar class="row justify-center items-center">
              <q-circular-progress
                show-value
                class=""
                :value="getImAliveStats"
                size="35px"
                :thickness="0.2"
                color="primary"
                center-color="transparent"
                track-color="grey-4"
              >
                <q-icon name="mdi-heart" size="20px" :color="`primary`" :style="`filter: grayscale(${100-getImAliveStats}%); margin-top:3px`" />
                <q-tooltip :delay="100" anchor="center right" self="center left" :offset="[10, 10]" content-class="bg-primary">
                  <span>Activity Level: <b>{{getImAliveStats.toFixed(0)}}%</b></span>
                </q-tooltip>
              </q-circular-progress>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-light">Last Active</q-item-label>
              <q-item-label caption>
                <span v-if="!guardian.last_active.startsWith('1970')"><date-string :date="guardian.last_active" /></span>
                <span v-else>Not been Active Yet</span>
                </q-item-label>
            </q-item-section>
          </q-item>

          <q-item class="col-xs-12">
            <q-item-section avatar class="row justify-center items-center">
                <q-icon name="mdi-account-plus" size="25px" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-light">Guardian Since</q-item-label>
              <q-item-label caption><date-string :date="guardian.joined" /></q-item-label>
            </q-item-section>
          </q-item>

          <q-item class="col-xs-12">
            <q-item-section avatar class="row justify-center items-center">
                <q-icon name="mdi-weight" size="22px" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-light">Weight</q-item-label>
              <q-item-label caption>{{guardian.weight}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item class="col-xs-12">
            <q-item-section avatar class="row justify-center items-center">
                <q-icon name="mdi-shield-lock" size="25px" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-light">Permission</q-item-label>
              <q-item-label caption>@{{guardian.authority}}</q-item-label>
            </q-item-section>
          </q-item>

          </div>
        </q-tab-panel>

        <q-tab-panel name="profile" class="overflow-hidden no-padding">
          <q-scroll-area :visible="true" :thumb-style="thumbStyle" style="height: 200px; width:100%">
            <div v-if="!profile_is_loading" class="q-px-md q-pb-md q-pt-xs">
              <profile-text :account="guardian.account" :profile_data="profile_data" />
              <q-btn color="primary" dense class="full-width" label="full profile" :to="`/members/${getActiveGroup}/profile/${guardian.account}`"/>
            </div>
            <div v-else class="column justify-center items-center" style="height:200px">
              <q-spinner color="primary" size="40px"/>
            </div>
          </q-scroll-area>
          
        </q-tab-panel>
      </q-tab-panels>
</div>
    </q-card>

  </div>
</template>

<script>
import { mapGetters } from "vuex";

import {colors} from 'quasar';
const{getBrand} = colors;
import profileText from "components/profile/profile-text";
import profileLink from "components/profile-link";
import imaliveBtn from "components/imalive-btn";
import profilePic from "components/profile-pic";
import dateString from "components/date-string"
export default {
  name: "guardianCard",
  components: {
    imaliveBtn,
    profilePic,
    dateString,
    profileText,
    profileLink
  },
  props:{
    guardian:{
      type: Object,
      default: ()=>{return {};}
    },
    minify:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      expanded: true,
      profile_is_loading: false,
      profile_data: '',
      active_tab: "info",
      thumbStyle: {
        right: "0px",
        borderRadius: "5px",
        backgroundColor: getBrand('primary'),
        width: "5px",
        opacity: 0.75
      }
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getCoreConfig: "group/getCoreConfig",
      getActiveGroup: "group/getActiveGroup",
    }),
    getImAliveStats(){
      let res = 0;
      if(this.getCoreConfig && this.getCoreConfig.conf.inactivate_cust_after_sec){
        let last_active = new Date(this.guardian.last_active+".000+00:00").getTime();
        let now = new Date().getTime(); 

        let imalive_period = this.getCoreConfig.conf.inactivate_cust_after_sec*1000;

        let inactive_for_ms = now - last_active;
        let perc = 100-(inactive_for_ms/imalive_period*100)
         res = perc >=0 ? perc : 0;

      }
      return res;

    }
  },
  methods: {
    async getProfile() {
      this.profile_is_loading =true;
      this.profile_data = await this.$store.dispatch("group/fetchProfile", this.guardian.account);
      this.profile_is_loading = false;
    }
  },
  watch:{
    active_tab: function(newVal, oldVal){
      if(newVal == 'profile' && this.profile_data == ''){
        this.getProfile();
      }
    }
  }

};
</script>

<style >


</style>
