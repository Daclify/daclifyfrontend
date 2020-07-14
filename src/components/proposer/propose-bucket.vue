<template>
  <div>
    <q-card class="overflow-hidden">
      <!-- expand-icon-class="display-none" -->
      <q-expansion-item 
         
        class="bg-secondary" 
        v-model="bucket_opened" 
        :switch-toggle-side="false" 
        expand-icon-class="display-none"
        @hide="bucket_view=='view_raw_bucket' ? bucket_view='bucket_list' : ''"
        >
        <template v-slot:header >
          <q-item-section avatar>
            <div class="relative-position" style="height:70px; width:70px">
              <!-- <q-icon size="70px" :name="actionBucketSvg"  class="absolute"/> -->
              <bucket-svg :color="thumbStyle.backgroundColor" :size="70"/>
              <!-- <svg  class="svg_bucket" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" >
                <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                  <path d="M4598.7,4997.9c-518.1-78-740.2-136-1096.3-288.1C2348.1,4223.7,1489.8,3173.4,1239.8,1939c-46-226.1-94-690.2-74-738.2c6-18,94-72,196.1-120c538.1-254.1,1508.4-438.1,2676.7-510.1c424.1-26,1516.4-26,1940.5,0c1220.3,76,2268.6,286.1,2766.7,554.2c108,60,106,48,74,396.1c-138,1454.4-1064.3,2690.7-2418.7,3230.9c-450.1,178-910.2,262.1-1428.4,258.1C4794.7,5007.9,4626.7,5003.9,4598.7,4997.9z M5576.9,4543.7C6969.3,4287.7,8041.6,3255.4,8337.6,1883c24-108,38-202.1,34-208.1c-6-4-66,14-136,42c-564.1,224.1-1642.4,366.1-2956.8,388.1c-1448.4,24-2732.7-114-3460.9-372.1c-92-32-174.1-56-178-50c-18,18,60,354.1,130,568.1c248.1,742.2,716.2,1350.4,1378.4,1786.5c428.1,282.1,936.2,468.1,1454.4,534.1C4804.7,4595.8,5374.8,4579.8,5576.9,4543.7z"/>
                  <path d="M1277.8,642.7c0,0,260.1-974.3,578.2-2164.6c500.1-1878.5,584.2-2174.6,638.2-2252.6c370.1-538.1,1098.3-898.2,2008.5-996.2c252.1-26,824.2-26,1072.3,2c892.2,96,1574.4,446.1,1926.5,988.3c90,138,96,164,658.2,2250.6c312.1,1160.3,570.2,2124.6,574.2,2142.6c8,26-50,12-278.1-64C7345.4,176.6,5352.8,26.5,3586.4,180.6c-878.2,78-1714.5,234.1-2156.6,406.1C1345.8,620.7,1277.8,644.7,1277.8,642.7z"/>
                </g>
              </svg> -->
              <number-pop-animation :input_value="getActionBucket.length" class="absolute" style="top:35px; left:21px"/>
            </div>

            
            <!-- <q-icon name="mdi-basket" color="primary" size="70px" >
            
            </q-icon> -->
          </q-item-section>

          <q-item-section>
            <div class="text-weight-light text-h6 text-white">Action Bucket</div>
            <q-item-label caption class="gt-xs text-grey-6">The bucket holds multiple actions to propose at once.</q-item-label>
          </q-item-section>

          <q-item-section side @click.stop>
            <q-icon 
              :name="bucket_menu_visible ? 'menu_open' : 'menu'"
              class="cursor-pointer"
            >
              <q-menu
                @before-show="bucket_menu_visible = true"
                @hide="bucket_menu_visible = false;"
              >
                <q-list dense style="min-width: 100px" class="primary-hover-list">
                  <q-item clickable v-close-popup @click="bucket_opened=!bucket_opened">
                    <q-item-section>{{bucket_opened ? 'Close' : 'Open'}}</q-item-section>
                  </q-item>
                  <q-item :disabled="!getActionBucket.length" clickable v-close-popup @click="handleViewRawClick">
                    <q-item-section>View raw</q-item-section>
                  </q-item>
                  <q-item :disabled="!getActionBucket.length" clickable v-close-popup @click="$store.commit('bucket/setActionBucket', [])">
                    <q-item-section>Delete all</q-item-section>
                  </q-item>
                  <q-item :disabled="!getActionBucket.length" clickable v-close-popup @click="exportBucket">
                    <q-item-section>Save to file</q-item-section>
                  </q-item>

                  
                </q-list>
              </q-menu>
            </q-icon>
          </q-item-section>
        </template>
        <!-- end header -->
        <q-separator />
        <q-tab-panels 
          v-model="bucket_view" 
          animated
          transition-prev="scale"
          transition-next="scale"
        >
          <q-tab-panel name="bucket_list" class="overflow-hidden no-padding">
            <div >
              <q-list class="primary-hover-list" separator>
                <q-item v-if="!getActionBucket.length" >
                  <q-item-section>
                    <q-item-label>Bucket is empty</q-item-label>
                  </q-item-section>
                </q-item>

                <draggable v-model="draggable_action_bucket" ghost-class="ghost" handle=".drag_handle">
                  <transition-group
                    enter-active-class="animated zoomIn"
                    leave-active-class="animated zoomOut"
                  >
                    <bucket-item  v-for="(action,i) in getActionBucket" :key="action.unique_id" :action="action" :i="i"/>
                  </transition-group>
                </draggable>

              </q-list>
              <!-- {{getActionBucket}} -->
              <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                <div v-if="getActionBucket.length" class="row items-center justify-between q-pa-md bg-secondary">
                  <div class="row no-wrap q-pl-xs" v-if="getActionBucket.length > 1">
                    <q-icon name="mdi-subdirectory-arrow-left" color="primary" class="rotate-90" size="24px" />
                    <div class="text-caption text-grey-5 q-pt-sm q-pl-xs"><i>drag to order</i></div>
                  </div>
                  <q-space v-else/>
                  <q-btn :disabled="!getActionBucket.length" label="next" @click="bucket_view='bucket_meta'" color="primary" size="md"/>
                </div>
              </transition>
            </div>
          </q-tab-panel>
          <q-tab-panel name="bucket_meta" class="overflow-hidden">
            <div class="q-col-gutter-md">
              <q-input label="Title" v-model="propose_title" outlined />
              <div>
                <div class=" cursor-pointer text-caption" @click="preview_description=!preview_description">
                  ({{preview_description?'Edit':'Preview'}})
                </div>
                <q-markdown
                  style="min-height:145px"
                  v-if="preview_description"
                  class="text-weight-light"
                  :src="propose_description"
                  :no-abbreviation="false"
                >
                </q-markdown>
                <q-input v-else label="Description" placeholder="markdown supported" v-model="propose_description" type="textarea" outlined />
              </div>
              <div class="row items-center justify-between">
                <q-btn flat label="back" @click="bucket_view='bucket_list'" color="primary" size="md"/>
                <q-btn :disabled="!propose_title || !propose_description" label="propose" @click="propose" color="primary" size="md"/>
              </div>
            </div>
            <!-- <pre class="text-black">{{getActionBucket}}</pre> -->
          </q-tab-panel>
          <q-tab-panel name="request_signature" class="overflow-hidden">
            <div style="height:200px" class="column justify-center items-center">
              <q-spinner size="36px" color="primary"  @click="bucket_view='bucket_meta'" class="cursor-pointer"/>
              <div class="text-grey-5">Waiting for signature</div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="trx_success" class="overflow-hidden">
            <div style="height:200px" class="column justify-center items-center">
              <q-icon name="mdi-check-circle-outline" size="48px" color="positive" @click="bucket_view='bucket_meta'" class="cursor-pointer"/>
              <div class="text-grey-5">Transaction successful</div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="trx_error" class="overflow-hidden">
            <div style="height:200px" class="column justify-center items-center">
              <q-icon name="mdi-alert-circle-outline" size="48px" color="negative" @click="bucket_view='bucket_meta'" class="cursor-pointer" />
              <div class="text-grey-5">Transaction error</div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="view_raw_bucket" class="overflow-hidden text-secondary">
            <q-btn icon="close" unelevated style="z-index:99" round class="absolute-top-right q-ma-md" @click="bucket_view='bucket_list'" size="sm" color="secondary"/>
            <q-scroll-area :visible="true" :thumb-style="thumbStyle" style="height: 250px; width:100%">
            <div v-html="getRawBucketContent" >
            </div>
            </q-scroll-area>

          </q-tab-panel>
        </q-tab-panels>
      </q-expansion-item>
    </q-card>
  </div>
</template>

<script>
import {colors} from 'quasar';
const {getBrand} = colors;
import { mapGetters } from "vuex";
import draggable from 'vuedraggable';
import numberPopAnimation from 'components/number-pop-animation';
// import authorizationDisplay from 'components/proposer/authorization-display';
// import thresholdBadge from 'components/thresholds/threshold-badge';
import bucketSvg from 'components/proposer/bucket-svg';
import bucketItem from 'components/proposer/bucket-item';
import { saveAs } from "file-saver";
const prettyHtml = require('json-pretty-html').default;
// var html = prettyHtml(json, json.dimensions);
export default {
  name: 'proposeBucket',
  components:{
    draggable,
    numberPopAnimation,
    // thresholdBadge,
    // authorizationDisplay,
    bucketSvg,
    bucketItem
  },
  data () {
    return {
      preview_description:false,
      bucket_opened: false,
      bucket_view: "bucket_list",
      propose_title:'',
      propose_description:'',
      bucket_menu_visible: false,
      raw_bucket_content:'',
      thumbStyle: {
        right: "-16px",
        borderRadius: "5px",
        backgroundColor: getBrand('primary'),
        width: "5px",
        opacity: 0.75
      }
    }
  },
  computed: {
    ...mapGetters({
      getActionBucket: "bucket/getActionBucket",
      getLinkedThresholdForContractAction: "group/getLinkedThresholdForContractAction"
    }),
    draggable_action_bucket: {
        get() {
            return this.getActionBucket;
        },
        set(value) {
          this.$store.commit('bucket/setActionBucket', value)
        }
    },
    getRawBucketContent(){
      const html = prettyHtml(this.clone_bucket() );
      return html;
    },

  },
  methods:{
    clone_bucket(){
      let data = JSON.parse(JSON.stringify(this.getActionBucket));
      data.forEach(d => {
        delete d.unique_id;
      });
      return data;
    },
    exportBucket() {
      if (this.getActionBucket.length == 0) return;
      let clone = this.clone_bucket();
      let blob = new Blob([JSON.stringify(clone, null, 4)], {
        type: "text/plain;charset=utf-8"
      });
      saveAs(blob, `action_bucket_${Date.now()}.json`);
    },
    handleViewRawClick(){
      if(!this.getActionBucket.length){
        this.bucket_view='bucket_list';
        this.bucket_opened=true;
        return;
      } 
      this.bucket_opened=true; 
      this.bucket_view='view_raw_bucket';
    },

    async propose(){
      this.bucket_view ="request_signature";
      let actions = JSON.parse(JSON.stringify(this.getActionBucket) );
      actions.forEach(a =>{
        a.data = a.hex;
        delete a.hex;
        delete a.unique_id;
      });

      let res = await this.$store.dispatch("group/propose", {
        actions: actions,
        description: this.propose_description,
        title: this.propose_title
      });

      if(res && res.trxid){
        this.$store.commit('bucket/setActionBucket', []);
        this.bucket_view ="trx_success";
      }
      else{
       this.bucket_view ="trx_error";
      }
      setTimeout(()=>{
        this.bucket_view ="bucket_list";
      }, 1500);
    }
  }
}
</script>
<style>
.drag_handle{
  cursor: grab !important;
}
.drag_handle:active{
  cursor: grabbing !important;
}


.ghost{
  background: var(--q-color-primary);
  
}



</style>
