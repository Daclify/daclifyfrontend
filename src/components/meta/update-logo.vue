<template>
  <div>
    <div class="row items-center">
      <q-img v-if="getActiveGroupConfig.ui.logo" :src="getActiveGroupConfig.ui.logo"  style="width:100%; max-width:300px;">
          <template v-slot:error>
            <div class="text-weight-light bg-transparent flex">
              <span class="text-primary" >error loading logo</span>
            </div>
          </template>
      </q-img>
      <div v-else class="row text-primary text-h5" >
        No Logo
        <div v-if="show_edit">
          <q-btn :icon="edit?'mdi-close':'mdi-pencil'" flat size="sm" text-color="primary" round  :to="get_edit_logo_url()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import { isValidUrl, isHttps } from "../../imports/validators.js";
export default {
  name: 'updateLogo',
  props:{
    show_edit:{
      type:Boolean,
      default:false
    }
  },
  computed: {
    ...mapGetters({
      getActiveGroup: "group/getActiveGroup",
      getActiveGroupConfig: "group/getActiveGroupConfig",
      getAppConfig: "app/getAppConfig"
    }),

  },
  data () {
    return {
      edit:false,

    }
  },
  methods:{
    get_edit_logo_url(){
      return `/manage/${this.getActiveGroup}/new-proposal?action=updatelogo&contract=${this.getAppConfig.groups_contract}&groupname=${this.getActiveGroup}`
    }
  }


}
</script>
