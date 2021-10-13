<template>


    <q-splitter v-model="splitterModel" separator-class="bg-secondary" :horizontal="false" v-if="getNewCoreConfig">
      <template v-slot:separator>
        <q-btn icon="compare_arrows" round color="primary" dense size="11px">
        </q-btn>
      </template>

      <template v-slot:before>
        <div class="q-pa-md">

          <q-tree
            control-color="primary"
            :nodes="getGroupTree()"
            node-key="label"
            selected-color="primary"
            :selected.sync="selected"
            :expanded.sync="expanded"

            :default-expand-all="false"
            :accordion="true"
          >
            <template v-slot:default-header="prop">
              <div  class="row items-center">
                <q-icon
                  v-if="prop.node.icon"
                  :name="prop.node.icon"
                  color=""
                  size="28px"
                  class="q-mr-sm"
                />
                <div>{{ prop.node.label }}</div>
              </div>
            </template>
            <!-- <template v-slot:default-body="prop">
              <div v-if="prop.node.test">
                <span class="text-caption">{{ prop.node.test }}</span>
              </div>
            </template> -->
          </q-tree>
        </div>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="selected"
          animated
          class="full-height "
          transition-prev="jump-up"
          transition-next="jump-up"
        >

          <q-tab-panel :name="getActiveGroup.toUpperCase()" class="overflow-hidden">
            <page-header :title="getActiveGroup" />
            <p>
              This is the main account of the group.
            </p>
          </q-tab-panel>

          <q-tab-panel name="Core" class="overflow-hidden">
            <page-header title="Core Module" />
            <p>
              This module is enabled by default and can't be turned off. It
              enables all core features of the group account.
            </p>
            <p>
              You can enable additional functionallity in the "Modules" section.
            </p>
            <p>
              Configure the group by clicking the items.
            </p>
          </q-tab-panel>


          <q-tab-panel name="Members" class="overflow-hidden">
            <page-header title="Members" />
            <set-members />
          </q-tab-panel>

          <q-tab-panel name="Guardians" class="overflow-hidden">
            <page-header title="Guardians" />
            <set-guardians />
          </q-tab-panel>

          <q-tab-panel name="Maintainer Account" class="overflow-hidden">
            <page-header title="Maintainer Account" />
            <p>The maintainer account (can be an other group!) will be added to the groups "owner" permission. This means that this account will (also) have full control over the group. By leaving this field blank this feature is disabled and the guardians are the only controlling accounts.  </p>
            <set-maintainance-account />
          </q-tab-panel>

          <q-tab-panel name="Proposals" class="overflow-hidden">
            <page-header title="Proposals" />
            <set-proposals />
          </q-tab-panel>

          <q-tab-panel name="Internal Accounting" class="overflow-hidden">
            <page-header title="Internal Accounting" />
            <set-internal-accounting />
          </q-tab-panel>

          <q-tab-panel name="Update Code" class="overflow-hidden">
            <page-header title="Update Core Code" />
            <code-deployer :module="{module_name:'core', slave_permission:{actor: getActiveGroup, permission:'owner'}, has_contract:true}" />
          </q-tab-panel>


          <q-tab-panel name="Color" class="overflow-hidden">
            <page-header title="UI Color" />
            <action-proposer>
              <template slot-scope="scope">
                <update-color @propose="scope.propose" @addtobucket="scope.addtobucket"/>
              </template>
            </action-proposer>
          </q-tab-panel>



        </q-tab-panels>
      </template>
    </q-splitter>

</template>

<script>

var testtree = [
  {
    label: "testtttt",
    // avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    icon: "mdi-account-group",
    children: [
      {
        label: "Core",
        icon: "mdi-settings",
        children: [
          { label: "Guardians", test: "bbbbb" },
          { label: "Proposals" },
          { label: "Members" },
          { label: "Internal Accounting" },
          { label: "Maintainer Account" }
        ]
      },

      {
        label: "Meta & UI",
        icon: "mdi-television-guide",
        children: [
          { label: "Color" },
          { label: "Logo" },
          { label: "About" },
          
        ]
      },
      {
        label: "Update Code",
        icon: "mdi-file-upload"
      },
    ]
  }
];


import { mapGetters } from "vuex";

import setGuardians from "components/config/set-guardians";
import setInternalAccounting from "components/config/set-internal-accounting";
import setProposals from "components/config/set-proposals";
import setMaintainanceAccount from "components/config/set-maintainance-account";
import setMembers from "components/config/set-members";
import pageHeader from "components/page-header";
import actionProposer from "components/actions/action-proposer";
import updateColor from "components/actions/update-color";
import codeDeployer from "components/deployer/code-deployer";

export default {
  name: "groupSubaccounts",
  components: {
    setGuardians,
    setInternalAccounting,
    setProposals,
    setMembers,
    pageHeader,
    updateColor,
    actionProposer,
    codeDeployer,

    setMaintainanceAccount
  },
  data() {
    return {
      splitterModel: 40,
      selected: "Modules",
      expanded: [],
      expand_all: false
    };
  },
  computed: {
    ...mapGetters({
      getActiveGroup: "group/getActiveGroup",
      getNewCoreConfig: "group/getNewCoreConfig"
    })
  },
  methods: {
    getGroupTree() {
      testtree[0].label = this.getActiveGroup.toUpperCase();
      return testtree;
    }
  },
  mounted(){
    this.expanded.push(this.$route.params.groupname.toUpperCase() );
  }
};
</script>
