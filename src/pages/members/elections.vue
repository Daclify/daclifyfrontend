<template>
  <q-page padding class="constrain-page-width">
   <page-header title="Elections"/>
   <q-tabs v-model="selected_tab" class="bg-secondary text-white" align="left" indicator-color="primary">
      <q-tab label="Vote" name="vote" />
      <div v-if="getIsMember">
        <q-tab v-if="getIsCandidate" label="my candidacy" name="manage candidacy">
          <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut" appear>
            <q-badge class="tab-badge-margin" v-if="getIsCandidate.state==1" color="positive" floating key="active">active</q-badge>
            <q-badge class="tab-badge-margin" v-if="getIsCandidate.state==2" color="warning" floating key="paused">paused</q-badge>
            <q-badge class="tab-badge-margin" v-if="getIsCandidate.state==3" color="negative" floating key="fired">fired</q-badge>
          </transition>
        </q-tab>
        <q-tab v-else label="register as candidate" name="register candidacy" />
      </div>

   </q-tabs>

    <!-- enum candidate_state : uint8_t {
      UNREGISTERED = 0,
      ACTIVE = 1,
      PAUSED = 2,
      FIRED = 3
    }; -->

    <div v-if="selected_tab == 'vote'" class="q-pt-md">
      <list-user-votes class="z-max"/>
      <list-candidates />
    </div>

    <div v-if="selected_tab == 'register candidacy'" class="q-pt-md">
       <register-candidate  @navigate="selected_tab = $event"/>
    </div>

    <div v-if="selected_tab == 'manage candidacy'" class="q-pt-md">
      <manage-candidacy @navigate="selected_tab = $event"/>
    </div>


   
  <!-- <pre>{{getElectionsConfig}}</pre>
  <pre>{{getElectionsState}}</pre> -->

   
   
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";

import pageHeader from "components/page-header";
import listUserVotes from "components/modules/elections/list-user-votes";
import listCandidates from "components/modules/elections/list-candidates";
import registerCandidate from "components/modules/elections/register-candidate";
import manageCandidacy from "components/modules/elections/manage-candidacy";

export default {
  name: "vote",
  components: {
    pageHeader,
    listUserVotes,
    listCandidates,
    registerCandidate,
    manageCandidacy
  },
  data() {
    return {
      selected_tab: "vote"
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getElectionsContract: "elections/getElectionsContract",
      getElectionsConfig: "elections/getElectionsConfig",
      getElectionsState: "elections/getElectionsState",
      getIsCandidate: "elections/getIsCandidate",
      getIsMember: "user/getIsMember",
      getActiveGroup: "group/getActiveGroup",
    })
  },
  methods: {

  },
  mounted(){
    //this.$store.dispatch("group/fetchChildAccounts", this.getActiveGroup);

  },
  // watch: {
  //   'getElectionsContract' () { this.$store.dispatch("elections/loadElectionsRoutine")},
  //   'getAccountName'() {this.$store.dispatch("elections/loadElectionsRoutine")}
  // }
  watch:{
    getElectionsContract: {
      immediate: true,
      handler(newVal, oldVal) {
        if(newVal){
          this.$store.dispatch("elections/loadElectionsRoutine")
        }
      }
    },
    // getAccountName: {
    //   immediate: true,
    //   handler(newVal, oldVal) {
    //     if(newVal){
    //       this.$store.dispatch("elections/loadElectionsRoutine")
    //     }
    //   }
    // },
  }

};
</script>
<style>
.tab-badge-margin{
  margin-top: -2px;
}
</style>
