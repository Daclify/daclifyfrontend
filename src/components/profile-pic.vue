<template>
          <q-avatar :size="`${size}px`" :class="$q.dark.isActive ? 'bg-secondary' :'bg-grey-3'" >
            
            <q-img v-if="profilepic" :class="{'cursor-pointer': tooltip}"  class="fit" :src="profilepic" spinner-color="primary" :spinner-size="`${size*0.8}px`" @load="$emit('loaded')" @error="$emit('error')" >
              <q-tooltip v-if="tooltip" :delay="250" content-class="bg-secondary">
                {{account}}
              </q-tooltip>
            </q-img>
            <q-icon v-else name="person" color="primary" :size="`${size*0.8}px`"/>
            <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
              <q-icon
                v-if="icon"
                :name="icon"
                :color="iconColor"
                class="absolute-bottom-right round hover-rotate cursor-pointer"
                :class="iconBackground"
                :size="`${size*0.4}px`"
                @click="$emit('iconClick')"
              >
                <q-tooltip v-if="tooltip" :delay="400" content-class="bg-primary">
                  Guardian
                </q-tooltip>
              </q-icon>
            </transition>
            
            <!-- <q-badge floating color="negative">inactive</q-badge> -->
          </q-avatar>
</template>

<script>
import { isValidUrl } from "../imports/validators.js";
import { mapGetters } from "vuex";
export default {
  name: 'profilePic',
  props:{
    size:{
      type: Number,
      default: 20
    },
    border:{
      type: String,
      default: 'primary'
    },
    icon:{
      type: String,
      default: ''
    },
    iconColor:{
      type: String,
      default: 'primary'
    },
    iconBackground:{
      type: String,
      default: 'bg-secondary'
    },
    account:{
      type: String,
      default: ""
    },
    url:{
      type: String,
      default: ""
    },
    tooltip:{
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      getAvatar: "group/getAvatar"
    }),
    profilepic(){
      if(this.url){
        return this.url;
      }
      if(this.account){
        let p = this.getAvatar(this.account);
        if(isValidUrl(p) ){
          return p;
        }
      }
      

    }
  }
}
</script>
<style>

</style>
