<template>
      <q-btn-dropdown
      v-if="getChildAccounts"
      color="primary"
      :label="label"
      split
      v-model="dropdown_open"
      @click="dropdown_open=true"
    >
      <q-list class="primary-hover-list">

        <q-item v-for="child in getChildAccounts" clickable v-close-popup :key="child.account_name" @click="label = child.account_name">
          <q-item-section>
            <q-item-label>{{child.account_name}}</q-item-label>
            <q-item-label caption>parent: {{child.parent}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="label != 'select'" clickable v-close-popup @click="label = 'select'" >
          <q-item-section>
            <q-item-label>clear</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: 'childAccountSelector',
  data () {
    return {
      label: 'select',
      dropdown_open: false
    }
  },
  computed: {
    ...mapGetters({
      getChildAccounts: "group/getChildAccounts",
      getActiveGroup: "group/getActiveGroup"
    })
  },
  mounted(){
    if(!this.getChildAccounts){
      this.$store.dispatch("group/fetchChildAccounts", this.getActiveGroup);
    }
  }
}
</script>
