<template>
  <q-layout view="lhh Lpr fff">
    <q-header :elevated="true" reveal>
      <q-toolbar style="height:60px" class="bg-secondary" >
        <main-logo />
        <q-toolbar-title>
          
        </q-toolbar-title>

        <q-tabs shrink stretch class="q-mr-sm " indicator-color="primary" align="right">
          <!-- <q-route-tab  label="pricing" to="/mine" /> -->
          <!-- <q-route-tab  label="docs" to="/docs/getting-started" /> -->
        </q-tabs>
        <login-network-switcher :avatar="false" />


      </q-toolbar>
    </q-header>

  


    <q-page-container >

      <router-view />
      <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
        <q-btn fab icon="keyboard_arrow_up" color="primary" />
      </q-page-scroller>
    </q-page-container>



    <q-footer class="bg-secondary footer-border-top"  >
      <footer-content />
    </q-footer>
  </q-layout>
</template>

<script>
import { openURL, colors } from 'quasar';
const { setBrand, getBrand } = colors;
import { mapGetters } from "vuex";
import loginBtn from 'components/ual/login-btn';
import loginNetworkSwitcher from 'components/ual/login-network-switcher';
import footerContent from 'components/footer-content';
import mainLogo from 'components/main-logo';

export default {
  name: 'HomeLayout',
  components:{
    loginBtn,
    footerContent,
    loginNetworkSwitcher,
    mainLogo
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getShouldRenderLoginModal: "ual/getShouldRenderLoginModal"
    })
  },
  methods: {
    openURL

  },
  mounted(){
    //reset group
    this.$store.dispatch('group/resetStore');

  },
  beforeMount(){
    setBrand('primary', '#7DC6EC');
    this.$q.addressbarColor.set(getBrand('secondary'));
  }
}
</script>

<style>
.footer-border-top{
  border-top: 5px solid  var(--q-color-primary) !important;
}
</style>
