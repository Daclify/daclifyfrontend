<template>
  <q-card class="">
    <!-- {{getModules}} -->
    <q-toolbar class="bg-secondary text-white shadow-2">
      <q-toolbar-title :shrink="true">
        <span v-if="manage_module">Manage Modules</span>
        <span v-else>Modules</span>
      </q-toolbar-title>
      <q-space />
      <q-btn
        round
        dense
        :icon="manage_module ? 'mdi-minus' : 'mdi-plus'"
        color="primary"
        @click="manage_module = !manage_module"
      >
        <q-tooltip content-class="bg-secondary" :delay="500">
          <span v-if="!manage_module">manage modules</span>
          <span v-else>Go back to modules</span>
        </q-tooltip>
      </q-btn>
    </q-toolbar>
    <transition
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
      mode="out-in"
      tag="div"
    >
      <div v-if="!manage_module" key="modules">
        <q-list
          class="primary-hover-list"
          separator
          striped
        >
          <q-expansion-item 
            v-for="module in getModulesWithFilter"
            :key="module.module_name"
            clickable
            group="modules"
          >
            <template v-slot:header>
              <q-item-section side>
                <q-badge>{{ module.module_name }}</q-badge>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>
                  slave permission {{module.slave_permission}}
                </q-item-label>
              </q-item-section> 
            </template>
            <q-separator />
            <div>
              <q-card-section>
                <code-deployer :module="module" />
              </q-card-section>
            </div>
          </q-expansion-item>
          <no-items v-if="!getModulesWithFilter.length" text="No modules" />
        </q-list>

      </div>
      <q-card-section  v-else class="relative-position" key="add">
        <!-- <q-btn icon="close"  round dense  class="q-ma-md " @click="add_payment_view=false"/> -->
        <q-tabs
          v-model="manage_module_view"
          dense
          class=" text-primary"
          align="left"
          inline-label
        > 
          <q-tab label="link module" name="link" />
          <q-tab label="new account" name="create" />
          
        </q-tabs>
        <q-separator/>
        <q-tab-panels
          v-model="manage_module_view"
          style="min-height:200px"
          animated 
          transition-prev="fade" 
          transition-next="fade"
          class="overflow-hidden"
        >
          <q-tab-panel name="link" class="no-padding overflow-hidden" style="min-height:200px">
            <action-proposer>
              <template slot-scope="scope">
                <link-module @propose="scope.propose" @addtobucket="scope.addtobucket" :slave_permission="slave_permission"/>
              </template>
            </action-proposer>
          </q-tab-panel>
          <q-tab-panel name="create" class="no-padding overflow-hidden" style="min-height:200px">
            <new-account @requestLink="handleLinkRequest" />
          </q-tab-panel>
        </q-tab-panels>

      </q-card-section>
    </transition>


  </q-card>
</template>

<script>
import { mapGetters } from "vuex";
import actionProposer from "components/actions/action-proposer";
import linkModule from "components/modules/link-module";
import newAccount from "components/modules/new-account";
import codeDeployer from "components/deployer/code-deployer";
import noItems from "components/no-items";

export default {
  name: "manageModules",
  components: {
    actionProposer,
    linkModule,
    noItems,
    codeDeployer,
    newAccount
  
  },
  data() {
    return {
      manage_module: false,
      manage_module_view:"link",
      slave_permission: {actor:"", permission:""}
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getModules: "group/getModules",
      getActiveGroup: "group/getActiveGroup",

    }),
    getModulesWithFilter() {
      return this.getModules;
    }
  },
  methods: {
    handleLinkRequest(e){
      this.slave_permission = e;
      this.manage_module_view = "link"

    }
  }
};
</script>
