<template>
<div class="text-white" style="min-height:200px">
  <div class="center-page-content">
  <div  class="  row q-col-gutter-md  ">

    <div :class="colsetup">
      <div class="q-pa-sm">
        
        <div class="text-h6 q-mb-md">
          <img  src="~assets/animus-logo-small.png" style="height:60px" class="cursor-pointer q-mt-sm"/>
          <!-- <router-link to="/" tag="a" class="text-link text-caption" style="display:block">
            Pricing
          </router-link>
          <router-link to="/" tag="a" class="text-link text-caption" style="display:block">
            Upgrade To DAC
          </router-link>
          <router-link to="/" tag="a" class="text-link text-caption" style="display:block">
            Documentation
          </router-link> -->
        </div>
      </div>
    </div>
    <div :class="colsetup">
      <div class="q-pa-sm">
        <div class="text-h6 text-weight-light q-mb-md">Sponsors & Partners</div>
        <q-img  src="https://i.ibb.co/cYGz2xq/36450.png" style="width:80px" contain class="cursor-pointer" @click="openURL('https://boid.com')" />
        <q-img  src="~assets/animus-logo-small.png" style="width:80px" contain class="cursor-pointer" @click="openURL('https://www.animus.is')" />
      </div>
    </div>
   
    <div :class="colsetup">
       
      <div v-if="true" class="q-pa-sm ">
          
          <div class="text-h6 text-weight-light q-mb-md ">Follow Us</div>
          <q-btn dense color="primary" round  @click="openURL(getAppConfig.social.telegram)" class="q-mr-md">
            <q-tooltip content-class="bg-primary">Visit our Telegram</q-tooltip>
            <q-icon name="img:statics/vectors/social/001-telegram.svg" size="24px"/>
          </q-btn>
          <q-btn dense color="primary" round  @click="openURL(getAppConfig.social.github)">
            <q-tooltip content-class="bg-primary">Visit our Github repos</q-tooltip>
            <q-icon name="img:statics/vectors/social/027-github.svg" size="24px"/>
          </q-btn>
      </div>
    </div>
  </div>
  
  <q-separator dark class="q-mt-lg"/>

  <div class="row justify-end">© Daclify by Animus {{new Date().getFullYear()}}</div>
  </div>
  

</div>
</template>

<script>
import { mapGetters } from "vuex";
import { openURL } from "quasar";
export default {
  // name: 'ComponentName',
  data() {
    return {
      colsetup: "col-xs-12 col-sm-6 col-md-4"
    };
  },
  computed: {
    ...mapGetters({
      getAppConfig: "app/getAppConfig"
    })
  },
  methods: {
    openURL
  }
};
</script>
