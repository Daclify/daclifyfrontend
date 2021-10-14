<template>
  <q-page class=" bg-dark full-height">

    <div class="header_box relative-position">
      <q-parallax src="statics/images/15410.jpg" :height="500">
        <div class="text-center text-primary" style="">
          <div
            style="background:#272822F2"
            class=" text-h3  text-white text-uppercase text-weight-light"
          >
            eosio Group accounts
          </div>
          <div class=" bg-white text-secondary text-weight-bold" style="font-size:17px">
            Start As Group - Proceed As DAC
          </div>

          <split-btn />
        </div>
      </q-parallax>
    </div>
    <div class="q-pa-md center-page-content text-white">
      <div class="text-white text-center q-mb-x1" style="font-size: calc(16px + 1.8vw);" >EMPOWEREMENT OF DECENTRALIZED COMMUNITIES</div>


<!-- TODO -->

      <!-- <div class=" q-mt-md q-pb-xl row q-col-gutter-lg text-weight-medium">
        <q-intersection transition="scale" class="col-xs-12 col-sm-6">
          
            <h5 class="text-center">For Existing Projects</h5>
            <p>ds sd qs  dq sd qs dssssssssssssssssssss ssssssssss ssssssss ssssssssssssssss sssssssssssssssssss sssssssssssssssssss q d qs</p>
          
        </q-intersection>
        <q-intersection transition="scale" class="col-xs-12 col-sm-6">
        
            <h5 class="text-center" >For Startups</h5>
            <p>eeeeeeeeeee eeeeeeeeeee eeeeeeee eeeeeeee eeeeeeee eeeeeeee  eee eeeeeeeeeeeeeeeee eeeeeeeeee ee ee eee</p>
          
        </q-intersection>
      </div> -->



      <div class="">
        <comparison-table style="width:100%"/>
      </div>




      <div class=" q-mt-md q-pb-xl row q-col-gutter-lg text-grey-9 text-weight-medium">
        <q-intersection transition="scale" class="col-xs-12 col-sm-6">
            <whatisdac  />
        </q-intersection>
        <q-intersection transition="scale" class="col-xs-12 col-sm-6">
            <whydac  />
        </q-intersection>
        <q-intersection transition="scale" class="col-xs-12 col-sm-6">
            <modules  />
        </q-intersection>
        <q-intersection transition="scale" class="col-xs-12 col-sm-6">
            <onchain  />
        </q-intersection>
      </div>
  
    </div>
  </q-page>
</template>

<style></style>

<script>
import { mapGetters } from "vuex";
import splitBtn from "components/split-btn";
import comparisonTable from "components/home/comparison-table";
import whatisdac from "components/home/whatisdac";
import whydac from "components/home/whydac";
import modules from "components/home/modules";
import onchain from "components/home/onchain";

export default {
  name: "PageIndex",
  components: {
    splitBtn,
    comparisonTable,
    whatisdac,
    whydac,
    modules,
    onchain
    },
  data() {
    return {
      showYouTubeVideo: false,
      video_is_loaded: false,
      contentStyle: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        color: '#555'
      },

      contentActiveStyle: {
        backgroundColor: '#eee',
        color: 'black'
      },

      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      }
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
    })
  }
};
</script>

<style>
.header_box {
  border-bottom: 5px solid var(--q-color-primary);
}
</style>
