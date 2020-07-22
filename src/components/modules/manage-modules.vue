<template>
  <q-card class="">
    <!-- {{getModules}} -->
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title :shrink="true">
        <span v-if="add_module_view">Manage Modules</span>
        <span v-else>Modules</span>
      </q-toolbar-title>
      <q-space />
      <q-btn
        round
        dense
        :icon="add_module_view ? 'mdi-minus' : 'mdi-plus'"
        color="secondary"
        @click="add_module_view = !add_module_view"
      >
        <q-tooltip content-class="bg-secondary" :delay="500">
          <span v-if="!add_module_view">manage modules</span>
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
      <div v-if="!add_module_view" key="modules">
        <q-list
          v-if="getModulesWithFilter.length"
          class="primary-hover-list"
          bordered
          separator
          striped
        >
          <q-item
            v-for="module in getModulesWithFilter"
            :key="module.module_name"
            clickable
          >
            <q-item-section side>
              <q-badge>{{ module.module_name }}</q-badge>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>
                slave permission {{module.slave_permission}}
              </q-item-label>
            </q-item-section>

          </q-item>
        </q-list>
        <q-list v-else bordered separator striped>
          <no-items text="No modules" />
        </q-list>
      </div>
      <q-card-section  v-else class="relative-position" key="add">
        <!-- <q-btn icon="close"  round dense  class="q-ma-md " @click="add_payment_view=false"/> -->
        <action-proposer>
          <template slot-scope="scope">
            <link-module @propose="scope.propose" @addtobucket="scope.addtobucket" />
          </template>
        </action-proposer>
      </q-card-section>
    </transition>


  </q-card>
</template>

<script>
import { mapGetters } from "vuex";
import actionProposer from "components/actions/action-proposer";
import linkModule from "components/modules/link-module";
import noItems from "components/no-items";

export default {
  name: "manageModules",
  components: {
    actionProposer,
    linkModule,
    noItems
  
  },
  data() {
    return {
      add_module_view: false
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
  methods: {}
};
</script>
