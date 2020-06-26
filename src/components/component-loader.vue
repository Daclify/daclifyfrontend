<template>
  <component v-if="component" :is="component" :class="do_hashes_match ? '' :'hashes_not_match'" />
</template>

<script>
import {sha256} from "../imports/helpers.js";
import { mapGetters } from "vuex";
export default {
  name: 'componentLoader',
  props:{
    comp_id:{
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      component:false,
      remote_hash: false,
    }
  },
  computed: {
    ...mapGetters({
      getComponentRegistry: "app/getComponentRegistry",
    }),
    do_hashes_match(){
      if(this.component && this.remote_hash){
        return this.getComponentRegistry[this.comp_id].hash[0] == this.remote_hash;
      }
      else{
        return true;
      } 
    }
  },

  methods:{
    async loadComponent(){
      httpVueLoader.httpRequest = async (url) => {
          let res = await this.$axios.get(url).catch(e => e.status);
          if(res && res.data){
            this.remote_hash = sha256(res.data);
            console.log(this.remote_hash)
            if(this.remote_hash == this.getComponentRegistry[this.comp_id].hash[0] ){
              return res.data;
            }
            
          }
      }

      let component_url = this.getComponentRegistry[this.comp_id].src[0];
      try{
        this.component = await httpVueLoader(component_url);
      }
      catch(e){
        console.log("error loading external component")
      }
      
    }
  },

  async mounted(){
    this.loadComponent();
    // console.log("remote_hash", remote_hash)
  }
}
</script>
<style>
  .hashes_not_match{
    border: 2px solid red;
  }
</style>
