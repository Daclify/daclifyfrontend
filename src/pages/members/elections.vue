<template>
  <q-page padding class="constrain-page-width">
   <page-header title="Elections"/>
   <q-tabs v-model="selected_tab" class="bg-secondary text-white" align="left" indicator-color="primary">
      <q-tab label="Vote" name="vote" />
      <div v-if="getIsMember">
        <q-tab v-if="getIsCandidate" label="my candidacy" name="manage candidacy">
          <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut" appear>
            <q-badge v-if="!getIsCandidate.is_active" color="primary" floating>paused</q-badge>
          </transition>
        </q-tab>
        <q-tab v-else label="register as candidate" name="register candidacy" />
      </div>

   </q-tabs>


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
