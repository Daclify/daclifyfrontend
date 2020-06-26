<template>
  <div class="relative-position">
    <transition appear enter-active-class="animated fadeIn"  mode="out-in">
    <div :key="active_icon_index">
    <q-icon
      :name="getMatchedIcons[active_icon_index].name"
      :class="getMatchedIcons[active_icon_index].class ? getMatchedIcons[active_icon_index].class: ''"
      :size="getMatchedIcons[active_icon_index].size"
      
    />
      <div v-if="getMatchedIcons[active_icon_index].count>1" class="absolute" style="font-size:10px; top:4px; left:3px">
        x{{getMatchedIcons[active_icon_index].count}}
      </div>
    </div>
    </transition>
  </div>
</template>

<script>
import {action_icon_map} from '../imports/action_icon_map';
export default {
  name: "proposalIcon",
  props: {
    actions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      active_icon_index: 0
    };
  },
  computed: {

    getMatchedIcons() {
      let res = [];
      for(let i = 0; i < this.actions.length; i++){
        let action = this.actions[i];
        let icon_obj = action_icon_map.get(action.name);
        let already_added = res.findIndex(r => r.name == icon_obj.name);
        if(already_added != -1){
          res[already_added].count++;
        }
        else{
          icon_obj.count = 1;
          res.push(icon_obj );
        }
      }
      return res;
    }
  },
  methods: {
    updateIconIndex(){
      let count = this.getMatchedIcons.length;
      if(count -1 == this.active_icon_index){
        this.active_icon_index = 0;
      }
      else{
        this.active_icon_index++;
      }
    }
  },
  mounted(){
    if(this.getMatchedIcons.length > 1){
      this.icon_timer = setInterval(()=>{
        this.updateIconIndex();
      },5000);
    }

  },
  beforeDestroy(){
    clearInterval( this.icon_timer );
    this.icon_timer = null;
  },
};
</script>
