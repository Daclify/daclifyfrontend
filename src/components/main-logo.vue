<template>
  <div class="q-mt-xs relative-position">
    <router-link to="/" >
      <!-- <transition-group enter-active-class="animated fadeInUp" leave-active-class="animated zoomOut" > -->
        <img src="~assets/daclify-logo-small-white.png" key="s" style="height:50px" class="cursor-pointer gt-xs" />
        <img src="~assets/daclify-logo-small-white.png" key="b" style="height:40px" class="cursor-pointer lt-sm" />
      <!-- </transition-group> -->
    </router-link>
    <!-- <span class="bg-primary rounded-borders inline q-ml-xs" >BETA</span> -->
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  // name: 'ComponentName',
  data() {
    return {

    };
  }
})
</script>
