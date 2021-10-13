<template>
  <q-page padding class="constrain-page-width">
    <page-header title="New Proposal" />
    <propose-bucket />

    <q-tabs
      v-model="active_tab"
      class="text-primary q-mt-md"
      dense
      align="left"
    >
      <q-tab label="Advanced" name="advanced" />
      <!-- <q-tab label="Profile" name="profile" /> -->
    </q-tabs>
    <q-separator class="q-mb-md" />

    <q-tab-panels
      v-model="advanced_slide"
      animated
      transition-prev="scale"
      transition-next="scale"
      class=" bg-transparent"
    >
      <q-tab-panel name="action_selection" class="no-padding overflow-hidden " >
        <find-account v-model="selected_contract" />
        <list-actions v-if="selected_contract"  ref="listactions" :action_name="selected_action_name" :contract="selected_contract" @action-select="showActionFields" class="q-mt-md" />

      </q-tab-panel>
      <q-tab-panel name="action_fields" class="no-padding overflow-hidden">
        <q-btn icon="close" round flat  class="absolute-top-right" color="primary" @click="goBackToActionSelection"/>
        <!-- {{active_action_fields}} -->
        <action-fields :fields="active_action_fields" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import pageHeader from "components/page-header";
import proposeBucket from "components/proposer/propose-bucket";
import listActions from "components/proposer/list-actions";
import findAccount from "components/form/find-account";
import actionFields from "components/proposer/action-fields";
// import {openURL} from "quasar";
// import {isValidUrl} from "../../imports/validators.js"

export default {
  name: "newProposal",
  components: {
    pageHeader,
    proposeBucket,
    findAccount,
    listActions,
    actionFields
  },
  data() {
    return {
      active_tab: "advanced",
      selected_contract: "",
      selected_action_name: "",//not in use but if set the component will load with this action name set as filter

      advanced_slide: "action_selection",
      active_action_fields:false
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getActiveGroupConfig: "group/getActiveGroupConfig",
      getNumberGuardians: "group/getNumberGuardians"
    })
  },
  methods: {
    goBackToActionSelection(){
      let uri = window.location.search.substring(1); 
      let params = new URLSearchParams(uri);
      params.delete("action");
      window.history.replaceState({}, '', `${location.pathname}?${params}`);
      this.selected_action_name="";
      this.advanced_slide='action_selection';
    },
    showActionFields(e){

      e.contract = this.selected_contract;
      e.fields = e.fields.map(f =>{
        f.value = '';
        return f;
      })
      this.active_action_fields = e;
      let uri = window.location.search.substring(1); 
      let params = new URLSearchParams(uri);
      this.active_action_fields.fields.forEach(f =>{
        f.value=params.get(f.name)||"";
      })
      this.advanced_slide ="action_fields"
      
    }
  },
  created(){
        let uri = window.location.search.substring(1); 
        let params = new URLSearchParams(uri);
        for (const [key, value] of params) {
          switch (key) {
            case "contract":
              this.selected_contract=value;
              break;
            case "action":
              this.selected_action_name=value;
              this.$refs //.listactions.handleActionClick({icon:"", name:value,type:value})
              break;
          }
          console.log(key, value)
        }
        //window.history.replaceState({}, '', `${location.pathname}?${params}`);
        
        
        // console.log(params.get("var_name"));
  }
};
</script>
