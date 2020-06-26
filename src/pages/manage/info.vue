<template>
  <q-page padding class="constrain-page-width">
    <div v-if="getActiveGroupConfig" class="row q-col-gutter-md">

      <div class="col-xs-12">
        <q-card>
          
          <q-card-section >
            <q-btn icon="mdi-pencil"  color="secondary" size="sm" text-color="primary" round  class="absolute-top-right q-mr-md q-mt-md" />
            <q-img v-if="getActiveGroupConfig.ui.logo" :src="getActiveGroupConfig.ui.logo"  style="width:100%; max-width:300px;">
              <template v-slot:error>
                <div class="text-weight-light bg-transparent flex">
                  <span class="text-primary" >error loading logo</span>
                </div>
              </template>
            </q-img>
            <div v-else class="text-primary text-h5" >No Logo</div>
          </q-card-section>
          <q-card-section >
            <div class="row justify-between">
              <q-item class="no-padding q-mr-sm">
                <q-item-section>
                  <q-item-label>Group Account</q-item-label>
                  <q-item-label caption>
                    <a :href="getSelectedBlockExplorer.base+getSelectedBlockExplorer.account+getActiveGroupConfig.groupname" target="_blank" class="text-link row items-center">
                      <q-icon name="search" size="16px"/>
                      <span>{{getActiveGroupConfig.groupname}}</span>
                    </a>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="no-padding">
                <q-item-section>
                  <q-item-label >
                    <group-tags :tags="getActiveGroupConfig.tags" content-class="bg-primary text-white"/>
                  </q-item-label>
                </q-item-section>
              </q-item>
              
            </div>
            <div class="q-mt-md">About</div>
            <q-markdown
              class="text-caption text-weight-light"
              :src="getActiveGroupConfig.meta.about"
              :no-abbreviation="false"
            >
            </q-markdown>


            <div class="text-weight-light row justify-between items-center">
            <div>
              <group-links :links="getActiveGroupConfig.meta.links" />
            </div>
              <q-item>
                  <q-item-section >
                    <q-item-label caption class="text-right">Created</q-item-label>
                    <q-item-label ><date-string :date="getActiveGroupConfig.creation_date" /></q-item-label>

                  </q-item-section>
              </q-item>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div  class="col-xs-12">
        <q-card>
          
          <div class="row justify-between items-center">
            <clap-for-group />
            <group-notification-manager />
          </div>
          
        </q-card>
      </div>

      <div v-if="getCoreConfig" class="col-xs-12">
        <q-card class="primary-hover-list">
           <core-version-manager />
        </q-card>
      </div>


      <div class="col-xs-12 col-sm-6 col-lg-4">
        <q-card class="primary-hover-list">
          <q-item clickable :to="`/manage/${getActiveGroup}/custodians`">
            <q-item-section avatar>
              <q-icon name="mdi-account-key" color="primary" size="xl"/>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-light text-h5 text-grey-7">Custodians</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label class=" text-h5 text-grey-7">{{getNumberCustodians}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </div>

      <div v-if="getElectionsState" class="col-xs-12 col-sm-6 col-lg-4">
        <q-card class="primary-hover-list">
          <q-item clickable>
            <q-item-section avatar>
              <q-icon name="mdi-account-card-details" color="primary" size="xl"/>
              <q-tooltip content-class="bg-secondary" :delay="500"  anchor="center right" self="center left" :offset="[10, 10]">
                <div>Active Candidates: {{getElectionsState.active_candidate_count}}</div>
                <div>Inactive Candidates: {{getElectionsState.inactive_candidate_count}}</div>
              </q-tooltip>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-light text-h5 text-grey-7">Candidates</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label class=" text-h5 text-grey-7">{{getElectionsState.active_candidate_count}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </div>

      <div v-if="getCoreConfig && getCoreConfig.conf.member_registration" class="col-xs-12 col-sm-6 col-lg-4">
        <q-card class="primary-hover-list">
          <q-item clickable >
            <q-item-section avatar>
              <q-icon name="mdi-account-multiple-check" color="primary" size="xl"/>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-light text-h5 text-grey-7">Members</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label v-if="getCoreState" class=" text-h5 text-grey-7">{{getCoreState.state.member_count}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </div>

      <div v-if="getCoreConfig && getCoreConfig.conf.maintainer_account" class="col-xs-12 col-sm-6 col-lg-4">
        <q-card class="primary-hover-list">
          <q-item clickable >
            <q-item-section avatar>
              <q-icon name="mdi-settings-transfer" color="primary" size="xl"/>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-light text-h5 text-grey-7">Maintainer Account</q-item-label>
              <q-item-label caption >{{getCoreConfig.conf.maintainer_account}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </div>

      <div v-if="getElectionsContract" class="col-xs-12 col-sm-6 col-lg-8">
        <q-card class="primary-hover-list">
          <new-election-timer />
        </q-card>
      </div>
      

    </div>

   
    <!-- <pre>{{getActiveGroupConfig}}</pre> -->
 

  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import {openURL} from "quasar";
import groupTags from "components/group-tags";
import groupLinks from "components/group-links";
import clapForGroup from "components/clap-for-group";
import groupNotificationManager from "components/group-notification-manager";
import dateString from "components/date-string"

import newElectionTimer from "components/modules/elections/new-election-timer";

import coreVersionManager from "components/core-version-manager";


export default {
  name: "PageIndex",
  components: {
    groupTags,
    groupLinks,
    coreVersionManager,
    clapForGroup,
    groupNotificationManager,
    newElectionTimer,
    dateString

  },
  data() {
    return {

    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getActiveGroupConfig: "group/getActiveGroupConfig",
      getCoreConfig: "group/getCoreConfig",
      getCoreState: "group/getCoreState",
      getNumberCustodians: "group/getNumberCustodians",
      getSelectedBlockExplorer: "user/getSelectedBlockExplorer",
      getElectionsContract: "elections/getElectionsContract",
      getElectionsState: "elections/getElectionsState"
    })
  },
  methods: {
    openURL,
  }


};
</script>
