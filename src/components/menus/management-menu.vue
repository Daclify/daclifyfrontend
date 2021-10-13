<template>
      <q-list class="primary-hover-list" :class="$q.dark.isActive? `bg-dark`:`bg-grey-3`"  :separator="!$q.dark.isActive">

        <q-item clickable :to="`/manage/${getActiveGroup}`" exact>
          <q-item-section avatar>
            <q-icon name="mdi-cellphone-information" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Group Info</q-item-label>
            <!-- <q-item-label caption>mining stats</q-item-label> -->
          </q-item-section>
        </q-item>

        <q-item clickable :to="`/manage/${getActiveGroup}/guardians`">
          <q-item-section avatar>
            <q-icon name="mdi-account-key" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Guardians</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable :to="`/manage/${getActiveGroup}/wallet`">
          <q-item-section avatar>
            <q-icon name="mdi-wallet" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Wallet</q-item-label>
            <!-- <q-item-label caption>mining stats</q-item-label> -->
          </q-item-section>
        </q-item>

        <q-item v-if="getModuleByName('payroll')" clickable :to="`/manage/${getActiveGroup}/payroll`">
          <q-item-section avatar>
            <q-icon name="mdi-account-cash"  />
          </q-item-section>
          <q-item-section>
            <q-item-label>Payroll</q-item-label>
            <!-- <q-item-label caption>mining stats</q-item-label> -->
          </q-item-section>
        </q-item>

        <q-item v-if="getModuleByName('hooks')" clickable :to="`/manage/${getActiveGroup}/hooks`">
          <q-item-section avatar>
            <q-icon name="mdi-anchor"  />
          </q-item-section>
          <q-item-section>
            <q-item-label>Hooks</q-item-label>
            <!-- <q-item-label caption>mining stats</q-item-label> -->
          </q-item-section>
        </q-item>

        <q-item clickable :to="`/manage/${getActiveGroup}/proposals`">
          <q-item-section avatar>
            <q-icon name="mdi-file-key" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Proposals</q-item-label>
          </q-item-section>
          <q-item-section side>
            <!-- $route.path!=`/manage/${getActiveGroup}/new-proposal` -->
            <q-btn 
              unelevated 
              round 
              :flat="false" 
              size="sm" 
              :color="$route.path!=`/manage/${getActiveGroup}/new-proposal` ? 'secondary' : 'primary'" 
              :to="`/manage/${getActiveGroup}/new-proposal`"
            >
              <q-icon v-if="getActionBucket.length==0" name="add" color="white" />
              <span v-else>{{getActionBucket.length}}</span>
              <q-tooltip content-class="bg-secondary">
                <span v-if="getActionBucket.length==0">New Proposal</span>
                <span v-else>{{`Bucket contains ${getActionBucket.length} actions`}}</span>
              </q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>

        <q-item clickable :to="`/manage/${getActiveGroup}/members`">
          <q-item-section avatar>
            <q-icon name="mdi-account-multiple"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Members</q-item-label>
            <!-- <q-item-label caption>mining stats</q-item-label> -->
          </q-item-section>
        </q-item>

        <q-item clickable :to="`/manage/${getActiveGroup}/thresholds`">
          <q-item-section avatar>
            <q-icon name="mdi-chart-gantt" class="rotate-270"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Thresholds</q-item-label>
            <!-- <q-item-label caption>mining stats</q-item-label> -->
          </q-item-section>
        </q-item>

        <q-item clickable :to="`/manage/${getActiveGroup}/files`">
          <q-item-section avatar>
            <q-icon name="mdi-file-document"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Files</q-item-label>
            <!-- <q-item-label caption>mining stats</q-item-label> -->
          </q-item-section>
        </q-item>

        <q-item clickable :to="`/manage/${getActiveGroup}/resources`">
          <q-item-section avatar>
            <q-icon name="mdi-alpha-r-circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Resources</q-item-label>
            <!-- <q-item-label caption>mining stats</q-item-label> -->
          </q-item-section>
          <q-item-section side >
            <transition appear enter-active-class="animated zoomIn" leave-active-class="animated zoomOut" >
              <q-btn v-if="getResourcesLowWarning.length" color="grey-3" round unelevated size="sm" icon="mdi-alert" text-color="negative">
                <q-tooltip content-class="bg-secondary">
                  <div v-for="warning in getResourcesLowWarning" :key="warning.type">
                    {{`Group consumed ${warning.perc_used.toFixed(2)}% of its ${warning.type}`}}
                  </div>
                </q-tooltip>
              </q-btn>
            </transition>
          </q-item-section>
        </q-item>

        <q-item clickable :to="`/manage/${getActiveGroup}/modules`">
          <q-item-section avatar>
            <q-icon name="mdi-settings"  />
          </q-item-section>
          <q-item-section>
            <q-item-label>Configuration</q-item-label>
            <!-- <q-item-label caption>mining stats</q-item-label> -->
          </q-item-section>
        </q-item>


      </q-list>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: 'managementmenu',
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      getActiveGroup: "group/getActiveGroup",
      getResourcesLowWarning: "group/getResourcesLowWarning",
      getActionBucket: "bucket/getActionBucket",
      getModuleByName: "group/getModuleByName",
    })
  },

}
</script>
