<template>
  <q-page padding class="constrain-page-width">
    <!-- <div v-if="getActiveGroupConfig" class="row q-col-gutter-md"> -->


    <transition-group
      v-if="getActiveGroupConfig"
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
      class="row q-col-gutter-md"
      tag="div"
    >

      <div class="col-xs-12" key="header_info">
        <q-card class="relative-position">
          
          <q-card-section >
            <update-logo :show_edit="allowed_to_edit" class="q-mb-md"/>

            <div class="row justify-between">
              <q-item class="no-padding q-mr-sm">
                <q-item-section>
                  <q-item-label>Group Account</q-item-label>
                  <q-item-label caption>
                    <explorer-link :accountname="getActiveGroupConfig.groupname" />
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
            <div class="q-mt-md">
              <div>About</div>
              <q-markdown
         
                class="text-caption text-weight-light"
                :src="getActiveGroupConfig.meta.about"
                :no-abbreviation="false"
              >
              </q-markdown>

            </div>


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

      <div  class="col-xs-12" key="clap_info">
        <q-card>
          
          <div class="row justify-between items-center">
            <clap-for-group />
            <!-- <group-notification-manager /> -->
          </div>
          
        </q-card>
      </div>


      <div class="col-xs-12 col-sm-6 col-lg-4" key="guardians_info">
        <q-card class="primary-hover-list">
          <q-item clickable :to="`/manage/${getActiveGroup}/guardians`">
            <q-item-section avatar>
              <q-icon name="mdi-account-key" color="primary" size="xl"/>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-light text-h5 text-grey-7">Guardians</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label class=" text-h5 text-grey-7">{{getNumberGuardians}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </div>

      <div v-if="getElectionsState" class="col-xs-12 col-sm-6 col-lg-4" key="candidates_info">
        <q-card class="primary-hover-list">
          <q-item clickable :to="`/members/${getActiveGroup}/elections`">
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

      <div v-if="getCoreConfig && getCoreConfig.conf.member_registration" class="col-xs-12 col-sm-6 col-lg-4" key="members_info">
        <q-card class="primary-hover-list">
          <q-item clickable :to="`/manage/${getActiveGroup}/members`">
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

      <div v-if="getCoreConfig && getCoreConfig.conf.maintainer_account.actor" class="col-xs-12 col-sm-6 col-lg-4" key="maintainer_account">
        <q-card class="primary-hover-list">
          <q-item clickable >
            <q-item-section avatar>
              <q-icon name="mdi-settings-transfer" color="primary" size="xl"/>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-light text-h5 text-grey-7">Maintainer Account</q-item-label>
              <q-item-label caption >{{getCoreConfig.conf.maintainer_account.actor}}@{{getCoreConfig.conf.maintainer_account.permission}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </div>

      <div v-if="getElectionsContract" class="col-xs-12 col-sm-6 col-lg-8" key="new_election">
        <q-card class="primary-hover-list" >
          <new-election-timer />
        </q-card>
      </div>
      

    <!-- </div> -->
    </transition-group>

   
    <!-- <pre>{{getActiveGroupConfig}}</pre> -->
 

  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import {openURL} from "quasar";
import updateLogo from "components/meta/update-logo";
import groupTags from "components/group-tags";
import groupLinks from "components/group-links";
import clapForGroup from "components/clap-for-group";
import groupNotificationManager from "components/group-notification-manager";
import dateString from "components/date-string";
import explorerLink from "components/explorer-link";
import newElectionTimer from "components/modules/elections/new-election-timer";




export default {
  name: "PageIndex",
  components: {
    updateLogo,
    groupTags,
    groupLinks,
    clapForGroup,
    groupNotificationManager,
    newElectionTimer,
    dateString,
    explorerLink

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
      getNumberGuardians: "group/getNumberGuardians",
      getSelectedBlockExplorer: "user/getSelectedBlockExplorer",
      getElectionsContract: "elections/getElectionsContract",
      getElectionsState: "elections/getElectionsState",
      getIsGuardian: "group/getIsGuardian"
    }),
    allowed_to_edit() {
      if(this.getIsGuardian(this.getAccountName)){
        return true
      }
      else{
        return false
      }
    }
  },
  methods: {
    openURL,
  }


};
</script>
