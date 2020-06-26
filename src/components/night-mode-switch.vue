<template>
  <div>
    <q-icon v-if="iconOnly" name="mdi-theme-light-dark" size="24px" @click="toggleNightMode" class="cursor-pointer" :class="{'rotate-180': getIsDark }" />
    <q-btn v-else color="white" round @click="toggleNightMode" flat dense>
      <q-icon name="mdi-theme-light-dark" :class="{'rotate-180': getIsDark }" />
    </q-btn>
  </div>
</template>



<script>
import { mapGetters } from "vuex";
export default {
  // name: 'ComponentName',
  props:{
    iconOnly:{
      type: Boolean,
      default:false
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      getIsDark: "user/getIsDark",

    })

  },
  methods:{
    toggleNightMode(){
      this.$q.dark.toggle();
      this.$store.commit('user/setIsDark', !this.getIsDark );
    }
  }

}
</script>
