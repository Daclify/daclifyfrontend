<template>
  <div>
    <q-dialog
      v-model="getShouldRenderLoginModal"
      persistent
      transition-show="flip-down"
      transition-hide="flip-up"
    >
      <q-card class="text-white" style="width:350px">
        <q-bar class="bg-secondary">
          <div>{{bar_msg}}</div>
          <q-space />
          <q-btn
            dense
            flat
            icon="close"
            @click="$store.commit('ual/setShouldRenderLoginModal', false); resetUI()"
          >
            <q-tooltip content-class="bg-secondary text-white">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <q-carousel
            v-model="slide"
            transition-prev="scale"
            transition-next="scale"
            animated
            control-color="red"
            class="no-padding"
          >
            <q-carousel-slide name="wallet_selection" class="no-padding">
              <div v-if="getAuthenticators.length" class="column no-wrap">
                <authenticator-btn
                  v-for="(authenticator,i) in getAuthenticators"
                  :authenticator="authenticator"
                  :key="`${i}auth`"
                  @login="handleAuthenticatorSelection"
                />
              </div>
              <div
                v-else
                class="text-black"
              >No authenticators are available for your current browser and/or device.</div>
            </q-carousel-slide>

            <q-carousel-slide name="accountname_input" class="column no-wrap justify-between">
              <div class="text-black">Input your accountname</div>
              <q-input type="text" v-model="accountname" autofocus @keyup.enter.native="connectAuthenticator(authenticator)" />
              <div class="column">
                <q-btn
                  label="continue"
                  color="primary"
                  class="full-width"
                  @click="connectAuthenticator(authenticator)"
                  
                />
                <q-btn label="back" flat color="primary" class="q-mt-sm" @click="resetUI" />
              </div>
            </q-carousel-slide>

            <q-carousel-slide name="error" class="column no-wrap justify-between">
              <div class="text-red">{{error_msg}}</div>
              <div class="column">
                <q-btn label="back" flat color="primary" class="q-mt-sm" @click="resetUI" />
              </div>
            </q-carousel-slide>
          </q-carousel>
        </q-card-section>
      </q-card>
    </q-dialog>

    <signing-overlay />
  </div>
</template>

<script>
import { UAL } from "universal-authenticator-library";
import { mapGetters } from "vuex";
import authenticatorBtn from "components/ual/authenticator-btn";
import signingOverlay from "components/ual/signing-overlay";

import {notifyError, notifySuccess} from '../../imports/notifications.js';

export default {
  name: "UAL",
  components: {
    authenticatorBtn,
    signingOverlay
  },
  //props: ["chains", "authenticators", "appName"],
  data() {
    return {
      ual: null,

      bar_msg: "",
      error_msg: "",

      slide: "wallet_selection",
      accountname: "",

      authenticator: null
    };
  },
  computed: {
    ...mapGetters({
      getShouldRenderLoginModal: "ual/getShouldRenderLoginModal",
      getActiveAuthenticator: "ual/getActiveAuthenticator",
      getAuthenticators: "ual/getAuthenticators",
      getActiveNetwork: "ual/getActiveNetwork"
    })
  },
  methods: {
    async handleAuthenticatorSelection(authenticator) {
      this.authenticator = authenticator;
      let shouldRequestAccountName = await authenticator.shouldRequestAccountName();
      if (shouldRequestAccountName) {
        this.bar_msg = authenticator.getStyle().text;
        this.slide = "accountname_input";
      } else {
        this.connectAuthenticator(authenticator);
      }
    },

    async connectAuthenticator(authenticator) {
      let authenticator_name = authenticator.getStyle().text;
      this.bar_msg = `Connecting to ${authenticator_name} ...`;

      let users;
      try {
        console.log("authenticator object", authenticator);
        if (this.accountname) {
          console.log("login authenticator");
          users = await authenticator.login(this.accountname);
        } else {
          users = await authenticator.login();
        }
        if (!users) {
          return;
        }

        const account_name = await users[0].getAccountName();
        console.log(' xxx debug ual users:', users);
        this.$store.commit("ual/setSESSION", {
          accountName: account_name,
          authenticatorName: authenticator_name,
          network: this.getActiveNetwork
        });
        this.$store.commit("ual/setAccountName", account_name);
        this.$store.commit("ual/setActiveAuthenticator", authenticator);
        this.$store.commit("ual/setShouldRenderLoginModal", false);
        notifySuccess({message:`Welcome ${account_name}, you are connected to ${this.getActiveNetwork} with ${authenticator_name}.`});
        this.resetUI();
      } catch (err) {
        this.bar_msg = "";

        console.log("Error cause", err.cause ? err.cause : "");
        let m = "Service unavailable";
        if (authenticator) {
          m = authenticator.getError() || err;
          m += ` ${authenticator.getStyle().text} `;
          m += err.cause ? err.cause : "";
          m += ` ${authenticator.getOnboardingLink()}`;
        }
        this.authenticator.reset();
        this.error_msg = m;
      }
    },
    resetUI() {
      this.bar_msg = this.error_msg = this.accountname = "";
      this.slide = "wallet_selection";
    }

  },
  mounted() {
    this.$store.dispatch("ual/initUAL");
    this.$store.dispatch("ual/attemptAutoLogin");
  },



  watch: {
    error_msg: function(newv, oldv) {
      console.log("oldv", oldv);
      console.log("newv", newv);
      if (newv) {
        this.slide = "error";
      }
    }
  }
};
</script>

<style>
.authenticator_not_available {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
  opacity: 0.5;
  filter: alpha(opacity=50);
  background-color: #c6c6c6 !important;
  order: 1;
}
</style>
