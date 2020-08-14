<template>
  <div>
    <q-card
      v-if="group.state"
      class="full-height overflow-hidden relative-position"
    >
      <q-tab-panels
        v-model="view_mode"
        :style="{ backgroundColor: getGroupColor }"
        style="min-height:200px"
        animated 
        transition-prev="fade" 
        transition-next="fade"
      >
        <q-tab-panel name="main" class="no-padding" style="min-height:200px">
          <div class="column justify-between overflow-hidden">
            <div
              class="row text-uppercase justify-center items-center text-white text-weight-light"
              style="min-height:115px"
            >
              <q-img
                contain
                v-if="group.ui.logo"
                :src="group.ui.logo"
                style=" max-width:70%; filter: brightness(0) invert(1); max-height:70px"
                spinner-color="white"
              >
                <q-tooltip content-class="bg-secondary" :delay="500">
                  account: {{ group.groupname }}
                </q-tooltip>
              </q-img>

              <div v-else>{{ group.groupname }}</div>
            </div>
            <group-tags :tags="group.tags" class="text-white q-mb-xs" />

            <div
              style="background: rgba(0,0,0,0.1); height:60px"
              class="full-width row justify-between items-center absolute-bottom"
            >
              <div>
                <q-btn
                  round
                  :color="group.is_fav ? 'yellow' : 'white'"
                  flat
                  icon="star"
                  size="md"
                  @click="
                    $store.commit('user/setFavouriteGroups', group.groupname);
                    group.is_fav = !group.is_fav;
                  "
                />
              </div>
              <div>
                <q-btn
                  v-if="getUiUrl.startsWith('.')"
                  label="Visit Group"
                  :to="getUiUrl"
                  flat
                  size="sm"
                  text-color="white"
                  :style="{ backgroundColor: getGroupColor }"
                />
                <q-btn
                  v-else
                  label="Visit Group"
                  @click="openURL(getUiUrl)"
                  icon="link"
                  flat
                  size="sm"
                  text-color="white"
                  :style="{ backgroundColor: group.ui.hexcolor }"
                >
                  <q-tooltip
                    content-class="bg-secondary"
                    :delay="500"
                    anchor="center left"
                    self="center right"
                    :offset="[10, 10]"
                  >
                    {{ getUiUrl }}
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="info" style="min-height:200px">
          <transition enter-active-class="animated fadeIn" leave-active-class="animated zoomOut" mode="out-in" >
            <div v-if="info_is_loading" class="q-mt-xl text-center" >
              <q-spinner  color="white" size="40px"/>
            </div>
            <div v-else class="q-mt-xl text-center" >
              <div class="ellipsis-3-lines">{{group_info.about}}</div>
            </div>
          </transition>
        </q-tab-panel>
      </q-tab-panels>
      <div class="absolute-top row justify-end q-pa-sm full-width">
        <transition mode="out-in" enter-active-class="animated zoomIn"  >
          <q-icon :name="view_mode=='main'?'mdi-dots-vertical': 'mdi-close'" color="white" class="cursor-pointer" size="24px" mode="in-out" @click="switchViewMode" :key="view_mode"/>
        </transition>
      </div>
      <!-- {{group}} -->
    </q-card>
  </div>
</template>

<script>
import { openURL } from "quasar";
import { isValidUrl } from "../imports/validators.js";
import groupTags from "components/group-tags";
export default {
  name: 'groupCard',
  components: {
    groupTags
  },
  props: {
    group: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      view_mode: "main",
      group_info: {
        about: ""
      },
      info_is_loading: false,
    
    };
  },
  computed: {
    getUiUrl() {
      let res = `./manage/${this.group.groupname}`;
      if (this.group.ui.custom_ui_url) {
        if (isValidUrl(this.group.ui.custom_ui_url)) {
          res = this.group.ui.custom_ui_url;
        }
      }
      return res;
    },
    getGroupColor(){
      return this.group.ui.hexcolor.startsWith('#') ? this.group.ui.hexcolor : `#${this.group.ui.hexcolor}`;
    },
  },
  methods: {
    openURL,

    switchViewMode(){
      if(this.view_mode == 'main'){
        this.view_mode = 'info';
        this.fetchGroupInfo();
      }
      else{
        this.view_mode = 'main';
      }
    },
    fetchGroupInfo(){

      this.group_info.about = this.group.meta.about;


      this.info_is_loading = true;
      setTimeout(()=>{
        this.info_is_loading = false;
      }, 500)
    }
  }
};
</script>
