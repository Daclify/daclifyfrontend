<template>
  <q-input
    ref="input"
    :value="new_avatar"
    label="new avatar url"
    outlined
    bottom-slots
    @input="load_new_avatar"
    :rules="[
      val => !!val || '* Required',
      isHttps,
      isValidUrl
    ]"
  >
    <template v-slot:append>
      <!-- <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" >
            <q-icon v-if="model_accountname" name="close" @click="model_accountname=''; $emit('input', '')" class="cursor-pointer"/>
          </transition> -->
    </template>
    <template v-slot:prepend>
      <profile-pic :size="40" :url="new_avatar" @loaded="new_avatar_loaded=true" @error="new_avatar_loaded=false" />
    </template>
    <template v-slot:after>
      <q-btn icon="check" round color="primary" @click="update_avatar" :disabled="!new_avatar_is_valid" :loading="is_transacting" />
    </template>
  </q-input>
</template>

<script>
import { isValidUrl, isHttps } from "../imports/validators.js";
import profilePic from "components/profile-pic";
import { mapGetters } from "vuex";
export default {
  name: "editProfilePic",
  components: {
    profilePic
  },
  props: {},
  data() {
    return {
      new_avatar: "",
      new_avatar_loaded: false,
      is_transacting: false
    };
  },
  computed: {
    ...mapGetters({
      getAvatar: "group/getAvatar",
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",

    }),
    new_avatar_is_valid(){
      let res = false;
      if(this.new_avatar != this.getAvatar(this.getAccountName) && this.new_avatar_loaded && !this.$refs.input.hasError){
        res = true;
      }
      return res;
    }
  },
  mounted() {
    this.new_avatar = this.getAvatar(this.getAccountName) || "";
  },
  methods: {
    isValidUrl,
    isHttps,
    load_new_avatar(n) {
      this.new_avatar = n.trim();
    },
    async update_avatar(){
      this.is_transacting = true;
      let action = {
        account: this.getActiveGroup,
        name: "updateavatar",
        data:{
          actor: this.getAccountName,
          img_url: this.new_avatar,

        }
      };
      let res = await this.$store.dispatch("ual/transact", { actions: [action], disable_signing_overlay: true });
      if(res && res.trxid){
        this.$store.commit('group/updateAvatar', {account: this.getAccountName, img_url: this.new_avatar});
        this.$emit("updated");
      }
      else{
        this.$emit("error");
   
      }
      this.is_transacting = false;
    }
  }
};
</script>
<style></style>
