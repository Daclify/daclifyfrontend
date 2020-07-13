<template>
      <q-list class="primary-hover-list" :class="$q.dark.isActive? `bg-dark`:`bg-grey-3`"  :separator="!$q.dark.isActive">

        <!-- <q-item v-if="getIsMember" clickable :to="`/members/${getActiveGroup}/dashboard`">
          <q-item-section avatar>
            <q-icon name="mdi-view-dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item> -->

        <q-item  v-if="getIsMember" clickable :to="`/members/${getActiveGroup}/profile/${getAccountName}`">
          <q-item-section avatar>
            <q-icon name="mdi-face-profile" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Profile</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="getModuleByName('elections')" clickable :to="`/members/${getActiveGroup}/elections`">
          <q-item-section avatar>
            <q-icon name="mdi-vote" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Elections</q-item-label>
            <!-- <q-item-label caption>mining stats</q-item-label> -->
          </q-item-section>
        </q-item>

        <q-item v-if="!getIsMember" clickable :to="`/members/${getActiveGroup}/register`">
          <q-item-section avatar>
            <q-icon name="mdi-account-plus" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Register</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="getIsMember" clickable :to="`/members/${getActiveGroup}/my-tokens`">
          <q-item-section avatar>
            <q-icon name="mdi-currency-usd" />
          </q-item-section>
          <q-item-section>
            <q-item-label>My Tokens</q-item-label>
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
      getAccountName: "ual/getAccountName",
      getModuleByName: "group/getModuleByName",
      getIsMember: "user/getIsMember",
    })
  },

}
</script>
