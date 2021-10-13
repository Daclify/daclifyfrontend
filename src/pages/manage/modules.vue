<template>
  <q-page padding class="constrain-page-width">

    <!-- <kitten test="fff"/> -->


    <q-card>
      <div
        class="row bg-secondary items-center justify-between"
        style="height:60px"
      >
        <div class="q-ml-md"><page-header title="Configuration" colorClass="text-primary" /></div>
        <div class="q-mx-md">
          <q-btn
            :disabled="!getCoreConfigDeltas"
            v-if="view_panel == 'config_view'"
            :label="
              `changes (${
                getCoreConfigDeltas ? getCoreConfigDeltas.length : 0
              })`
            "
            @click="view_panel = 'update_view'"
            color="primary"
          />
          <q-btn
            v-if="view_panel == 'update_view'"
            flat
            :label="`go back`"
            @click="view_panel = 'config_view'"
            color="primary"
          />
        </div>
      </div>
      <q-tab-panels
        keep-alive
        v-model="view_panel"
        animated
        class="fit "
        transition-prev="scale"
        transition-next="scale"
      >
        <q-tab-panel name="config_view" class="no-padding overflow-hidden">
          <config-editor />
        </q-tab-panel>
        <q-tab-panel name="update_view" class="no-padding overflow-hidden">
          <config-updater />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>



    <manage-modules class="q-mt-md" />

    <!-- {{ getNewCoreConfig }} -->
  </q-page>
</template>

<script>
import vue from 'vue';
import { mapGetters } from "vuex";
import pageHeader from "components/page-header";


import configEditor from "components/config/config-editor";
import configUpdater from "components/config/config-updater";



import manageModules from "components/modules/manage-modules"



// const kitten = window.httpVueLoader('http://localhost:8080/statics/test_component.vue');


export default {
  name: "groupSubaccounts",
  components: {
    pageHeader,
    configEditor,
    configUpdater,
    manageModules
  },
  data() {
    return {
      view_panel: "config_view",
      splitterModel: 40,
      selected: "Modules"

      // conf: {
      //   max_guardians: this.$store.state.group.newCoreConfig.conf.max_guardians,
      //   inactivate_cust_after_sec: this.$store.state.group.newCoreConfig.conf.inactivate_cust_after_sec,
      //   exec_on_threshold_zero: this.$store.state.group.newCoreConfig.conf.exec_on_threshold_zero,
      //   proposal_archive_size: this.$store.state.group.newCoreConfig.conf.proposal_archive_size,
      //   enable_member_registration: this.$store.state.group.newCoreConfig.conf.enable_member_registration,
      //   enable_withdraw: this.$store.state.group.newCoreConfig.conf.enable_withdraw
      // }
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getGuardians: "group/getGuardians",
      getActiveGroup: "group/getActiveGroup",
      getCoreConfigDeltas: "group/getCoreConfigDeltas",
      getNewCoreConfig: "group/getNewCoreConfig"
    })
  
  },
  methods: {
    getGroupTree() {
      testtree[0].label = this.getActiveGroup.toUpperCase();
      return testtree;
    }
  },

};
</script>
