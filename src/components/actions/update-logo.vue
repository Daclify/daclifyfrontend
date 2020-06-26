<template>
  <div>
    <div class="row">
      <q-img v-if="getActiveGroupConfig" :src="new_logo" style="max-width:250px" />
    </div>
    <div class="q-mt-md">
      <q-input outlined v-model="new_logo" placeholder="Logo URL" />
    </div>
    <div class="q-mt-md row justify-end">
      <q-btn :disabled="!isLogoChanged" label="update" color="primary" @click="proposeLogoUpdate" />
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'updateLogo',
  data() {
    return {
      new_logo:''
    };
  },
  computed: {
    ...mapGetters({
      getActiveGroup: "group/getActiveGroup",
      getActiveGroupConfig: "group/getActiveGroupConfig",
      getAppConfig: "app/getAppConfig"
    }),
    isLogoChanged(){
      if(this.getActiveGroupConfig && this.new_logo != this.getActiveGroupConfig.ui.logo ){
        return true;
      }
      else{
        return false;
      }
    }
  },
  methods: {

    async proposeLogoUpdate() {
      let action = {
        account: this.getAppConfig.groups_contract,
        name: "updatelogo",
        data: {
          groupname: this.getActiveGroup,
          logo: this.new_logo
        }
      };

      const title = `Update Logo`;
      const description = `Propose to update the logo.`;

      this.$store.dispatch("group/propose", {
        actions: [action],
        description: description,
        title: title
      });
    }
  },
  watch: {
    getActiveGroupConfig: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          this.new_logo = this.getActiveGroupConfig.ui.logo;
        }
      }
    }
  }
};
</script>
