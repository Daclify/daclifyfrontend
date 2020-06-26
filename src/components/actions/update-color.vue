<template>
  <div>
    <div class="row">
      <div
        v-for="palette_c in palette"
        :style="`background-color: ${palette_c}; width: ${palette_size}; height:${palette_size}`"
        :key="`${palette_c}`"
        @click="setNewColor(palette_c)"
        class="row items-center justify-center cursor-pointer"
      >
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
          <q-icon v-if="new_hexcolor == palette_c" name="check" color="white" />
        </transition>
      </div>
    </div>
    <div class="text-grey-7">{{new_hexcolor}}</div>
    <div class="q-mt-md row justify-end">
      <q-btn
        v-if="isColorChanged"
        icon="remove_red_eye"
        round
        size="sm"
        flat
        color="primary"
        @click="setNewColor(getActiveGroupConfig.ui.hexcolor)"
      />
      <div class="q-mb-xs">
      <propose-bucket-btn @click-propose="emitPropose" @click-bucket="emitBucket" label="Update Color" :disabled="!isColorChanged"/>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { colors } from "quasar";
import proposeBucketBtn from "components/actions/propose-bucket-btn";
// destructuring to keep only what is needed
const { setBrand, getBrand } = colors;
export default {
  name: 'updatecolor',
  components:{
    proposeBucketBtn
  },
  data() {
    return {
      palette:['#019A9D', '#D9B801', '#E8045A', '#B2028A', '#7DC6EC', '#7CB342', '#F4511E', '#FF9A17', '#798CEF','#9E8D67', '#3399FF'],
      palette_size: "35px",
      new_hexcolor: '',
    };
  },
  computed: {
    ...mapGetters({
      getActiveGroup: "group/getActiveGroup",
      getActiveGroupConfig: "group/getActiveGroupConfig",
      getAppConfig: "app/getAppConfig"
    }),
    isColorChanged(){
      if(this.getActiveGroupConfig && this.new_hexcolor != this.getActiveGroupConfig.ui.hexcolor ){
        return true;
      }
      else{
        return false;
      }
    }
  },
  methods: {
    setNewColor(c){
      this.new_hexcolor = c;
      setBrand("primary", c);
    },


    emitPropose(){
      let action = {
        account: this.getAppConfig.groups_contract,
        name: "updatecolor",
        data: {
          groupname: this.getActiveGroup,
          hexcolor: this.new_hexcolor
        }
      };

      const payload = {
        actions: [action],
        description: `Proposal to update the UI color "${this.getActiveGroup}"`,
        title: 'Update Color'     
      }
      this.$emit('propose', payload);
    },
    emitBucket(){
      let action = {
        account: this.getAppConfig.groups_contract,
        name: "updatecolor",
        data: {
          groupname: this.getActiveGroup,
          hexcolor: this.new_hexcolor
        }
      };
      this.$emit('addtobucket', action);     
    },

  },
  watch: {
    getActiveGroupConfig: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          this.new_hexcolor = this.getActiveGroupConfig.ui.hexcolor.toUpperCase();
        }
      }
    }
  }
};
</script>
