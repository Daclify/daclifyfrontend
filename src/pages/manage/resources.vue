<template>
  <q-page padding class="constrain-page-width">
    <page-header title="Resources"/>
    <!-- {{resource_carousel_slide}} -->
    <!-- {{getChunkSize}} -->
    <q-carousel
      v-model="resource_carousel_slide"
      :keep-alive="false"
      :navigation="false"
      infinite
      :arrows="getChunkSize < 3"
      control-color="primary"
      transition-prev="slide-right"
      transition-next="slide-left"
      :swipeable="true"
      animated
      :padding="false"
      height="185px"
      class="resource-carousel bg-transparent"
    >
      <q-carousel-slide 
        v-for="(chunk, si) in chunkArray(resourceComponents, getChunkSize)" 
        :name="si" 
        class="no-padding"
        style="overflow: visible !important"
        :key="si"
      >
        <div class="row q-col-gutter-md">
          <div v-for="(item) in chunk" :key="item.key" class="col-xs-12 col-sm-6 col-md-4">
            <q-card class="q-pb-md no-shadow border-primary" >
              <component  v-bind:is="item.component" ></component>
              <q-btn round icon="settings" flat color="primary" class="absolute-top-right q-ma-sm" @click="dialog_Resource_warning.type=item.key; dialog_Resource_warning.visible = true"/>
            </q-card>
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>






    <q-tabs v-model="active_tab" class="text-primary q-mt-md" dense align="left">
      <q-tab label="buy ram" name="buyram"></q-tab>
      <q-tab label="sell ram" name="sellram"></q-tab>

    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="active_tab" animated class="bg-transparent q-mt-md" transition-prev="fade" transition-next="fade">
      <q-tab-panel name="buyram" class="overflow-hidden no-padding">
        <action-proposer>
          <template slot-scope="scope">
            <buy-ram @propose="scope.propose" @addtobucket="scope.addtobucket" />
          </template>
        </action-proposer>
      </q-tab-panel>
      <q-tab-panel name="sellram" class="overflow-hidden no-padding">
        <action-proposer>
          <template slot-scope="scope">
            <sell-ram  @propose="scope.propose" @addtobucket="scope.addtobucket"/>
          </template>
        </action-proposer>
      </q-tab-panel>

    </q-tab-panels> 


    <q-dialog v-model="dialog_Resource_warning.visible">
      <q-card class="overflow-hidden" style="min-width:350px">
        <q-card-section>
            <page-header :title="`${dialog_Resource_warning.type.toUpperCase()} Warning Level`"/>
            <q-btn icon="close" flat round dense v-close-popup class="q-ma-md absolute-top-right"/>
            <div class="q-mt-xl">
              <q-slider
                
                :value="getResourceWarningLevels[dialog_Resource_warning.type]"
                :min="1"
                :max="99"
                :label-always="true"
                label
                label-color="primary"
                :label-value="getResourceWarningLevels[dialog_Resource_warning.type]+'%'"
                color="primary"
                @input="updateResourceWarningLevel"
              />
            </div>

            <p class="text-grey-7 text-caption">Set a warning level for the groups {{dialog_Resource_warning.type.toUpperCase()}} consumption.</p>
        </q-card-section>
      </q-card>
    </q-dialog>


  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import netResource from "components/net-resource";
import cpuResource from "components/cpu-resource";
import ramResource from "components/ram-resource";
import actionProposer from "components/actions/action-proposer";

import pageHeader from "components/page-header";
import buyRam from "components/actions/buy-ram";
import sellRam from "components/actions/sell-ram";
import {chunkArray} from "../../imports/helpers";


export default {
  name: 'groupRecources',
  components:{
    netResource,
    cpuResource,
    ramResource,
    pageHeader,
    actionProposer,
    buyRam,
    sellRam
  },
  data () {
    return {
      resourceComponents:[
        {key:'ram',component:ramResource},
        {key:'cpu',component:cpuResource}, 
        {key:'net',component:netResource} 
      ],
      resource_carousel_slide:0,
      dialog_Resource_warning:{
        visible:false,
        type: '' //ram, cpu or net
      },
      active_tab:'',

    }
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getThresholds: "group/getThresholds",
      getActiveGroup: "group/getActiveGroup",
      getThresholdLinks: "group/getThresholdLinks",
      getResourceWarningLevels: "user/getResourceWarningLevels"
    }),
    getChunkSize() {
      //col-xs-12 col-sm-6 col-lg-4
      let size = 1;
      if (this.$q.screen.gt.xs) {
        size = 2;
      }
      if (this.$q.screen.gt.sm) {
        size = 3;
      }
      return size;
    }
  },
  methods:{
    chunkArray,
    updateResourceWarningLevel(e){
      let res = {};
      res[this.dialog_Resource_warning.type] = e;
      this.$store.commit("user/setResourceWarningLevels", res);
    },
  },
  watch:{
    getChunkSize: function(newV, oldV){
      if(newV != oldV){
        this.resource_carousel_slide=0;
      }
    }
  }
}
</script>
<style>
.resource-carousel .q-carousel__prev-arrow{
  display:none;
}
/* .q-carousel__slides-container, .q-panel.scroll, .resource-carousel.q-carousel.q-panel-parent.resource-carousel.bg-transparent{
  overflow: visible !important;
} */
</style>
