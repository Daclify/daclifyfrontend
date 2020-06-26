<template>
  <div v-if="profile_data.gallery">
    <div class="q-mb-xs row justify-end">
      <q-btn dense flat :icon="mode=='carousel'?'mdi-view-carousel' :'mdi-grid'" @click="mode=='carousel' ? mode='grid' : mode='carousel'" color="primary">
        <q-tooltip content-class="bg-primary" :delay="500" anchor="center left" self="center right">
          {{mode=='carousel'?'switch to grid mode':'switch carousel mode'}}
        </q-tooltip>
      </q-btn>
    </div>
    <q-carousel
      v-if="mode == 'carousel'"
      v-model="slide"
      transition-prev="slide-right"
      transition-next="slide-left"
      swipeable
      animated
      control-color="primary"
      navigation
      arrows
      height="350px"
    >
      <q-carousel-slide
        v-for="(photo, i) in profile_data.gallery"
        :key="i"
        :name="i"
        class="column no-wrap"
      >
        <q-video
          v-if="isYouTubeUrl(photo.url) === true"
          class="absolute-full"
          :src="photo.url"
        />
        <q-img
          v-else
          class="rounded-borders col-6 full-height"
          contain
          spinner-color="primary"
          :src="photo.url"
        >
          <div class="absolute-bottom text-subtitle1 text-center">
            {{ photo.caption }}
          </div>
          <template v-slot:error>
            <div class="absolute-full flex flex-center bg-negative text-white">
              Cannot load image
            </div>
          </template>
        </q-img>
        <!-- </div> -->
      </q-carousel-slide>
    </q-carousel>

    <!-- <div  class="q-gutter-md row items-start"> -->
      <transition-group v-if="mode == 'grid'" appear enter-active-class="animated zoomIn" leave-active-class="animated zoomOut" class="q-gutter-md row items-start">
        <div
          v-for="photo in profile_data.gallery"
          :key="photo.url"
        >
          <q-video v-if="isYouTubeUrl(photo.url) === true" :src="photo.url" />
          <q-img v-else contain :src="photo.url" spinner-color="primary" style="height:150px; width:100px">
            <!-- <div class="absolute-bottom text-subtitle1 text-center">
              {{ photo.caption }}
            </div> -->
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white">
                Cannot load image
              </div>
            </template>
          </q-img>
        </div>
      </transition-group>
    <!--</div> -->

    <!-- <pre>{{profile_data.profile.links}}</pre> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isYouTubeUrl } from "../../imports/validators";
export default {
  // name: 'ComponentName',
  name: "profilePhotos",
  props: {
    account: {
      type: String,
      default: ""
    },
    profile_data: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {},
  data() {
    return {
      slide: 0,
      mode: "grid"
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup"

      // getActiveGroupConfig: "group/getActiveGroupConfig",
      // getNumberCustodians: "group/getNumberCustodians"
    })
  },
  methods: {
    isYouTubeUrl
  }
};
</script>
