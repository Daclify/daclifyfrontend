<template>
  <div>
    <q-input
      v-model="newLink"
      v-if="getAccountName == profile_data.account"
      outlined
      dense
      class="q-mb-md"
      bottom-slots
      hint=""
      placeholder="add new link"
      
    >
      <template v-slot:before>
        <q-btn icon="mdi-plus" @click="addLink" color="primary" round/>
      </template>
    </q-input>
    <div v-if="profile_data.links.length">
      <div
        v-for="(link, i) in profile_data.links"
        :key="link"
        class="text-link cursor-pointer"
      >
        <span @click="openURL(link)">{{ link }}</span>
        <q-btn
          icon="mdi-delete"
          @click="removeLink(i)"
          dense
          size="sm"
          flat
          color="negative"
        />
      </div>
    </div>

    <!-- <pre>{{profile_data.profile.links}}</pre> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isValidUrl } from "../../imports/validators.js";
import { openURL } from "quasar";
export default {
  // name: 'ComponentName',
  name: "profileLinks",
  props: {
    account: {
      type: String,
      default: ""
    },
    profile_data: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {},
  data() {
    return {
      newLink: ""
    };
  },
  methods: {
    openURL,
    addLink() {
      if (isValidUrl(this.newLink) === true) {
        this.profile_data.links.push(this.newLink);
      }
    },
    removeLink(i) {
      this.profile_data.links.splice(i, 1);
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup"

      // getActiveGroupConfig: "group/getActiveGroupConfig",
      // getNumberCustodians: "group/getNumberCustodians"
    })
  }
};
</script>
