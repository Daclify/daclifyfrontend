<template>
  <q-page class=" bg-dark full-height">
    <!-- <div class="diagonal"></div> -->
    <div class="header_box relative-position">
      <!-- https://svg-clipart.com/blue/P9e4bp8-crowd-clipart -->
      <!-- ./statics/images/bg.jpg -->
      <q-parallax src="statics/images/bg.jpg" :height="500">
        <div class="text-center text-primary" style="">
          <div
            style="background:#272822F2"
            class=" text-h3  text-white text-uppercase text-weight-light"
          >
            eosio Group accounts
          </div>
          <div class=" bg-primary text-secondary text-weight-bold" style="font-size:17px">
            Start As Group - Proceed As DAC
          </div>

          <split-btn />
        </div>
      </q-parallax>
    </div>
    <div class="center-page-content q-pa-md text-white q-gutter-xl">
      <h4 class="row justify-center text-white">EMPOWEREMENT OF DECENTRALIZED COMMUNITIES</h4>
        <div class="fit row inline wrap justify-center">
          <comparison-table style="max-width:700px"/>
        </div>

    <div class="row justify-center q-gutter-xl text-grey-9 offset-1 text-weight-medium">
       <q-card style="max-width:510px; height:600px">
          <q-card-section  class="bg-white">
              <img src="~assets/dac1.jpg" style="max-width:100%; max-height:300px">
          </q-card-section>
    
          <q-card-section style="font-size:17px">
            <b>What is a DAC?</b>
          </q-card-section>
      
          <q-card-section class="q-pt-none">
            <q-scroll-area
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
              style="height: 190px; max-width: 100%"
            >                  
              <div
                v-for="n in 1"
                :key="n"
                class="q-pa-xs"
              >
             Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.
              </div>
            </q-scroll-area>
          </q-card-section>
        </q-card>
          
            <q-card style="max-width:510px; height:600px">
              <q-card-section class="bg-white">
              <img src="~assets/question.jpg" style="max-width:100%; max-height:300px">
              </q-card-section>
                <q-card-section style="font-size:17px">
                  <b>Why would you create a DAC?</b>
                </q-card-section>
                <q-card-section class="q-pt-none">
                <q-scroll-area
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
              style="height: 190px; max-width: 100%"
            >                  
              <div
                v-for="n in 1"
                :key="n"
                class="q-pa-xs"
              >
                     Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.
              </div>
            </q-scroll-area>
                </q-card-section>
            </q-card>
            
            <q-card style="max-width:510px; height:600px">
              <q-card-section class="bg-white text-center">
              <img src="~assets/modules.jpg" class="flex-center" style="max-width:100%; max-height:300px">
              </q-card-section>
                <q-card-section style="font-size:17px">
                  <b>Modules</b>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <q-scroll-area
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
              style="height: 190px; max-width: 100%"
            >                  
              <div
                v-for="n in 1"
                :key="n"
                class="q-pa-xs"
              >
                   Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.
              </div>
            </q-scroll-area>
                </q-card-section>
            </q-card>
            <q-card style="max-width:510px; height:600px">
              <q-card-section>
              <img src="~assets/blockchain.jpg" style="max-width:100%; max-height:300px">
              </q-card-section>
                <q-card-section style="font-size:17px">
                  <b>On-chain</b>
                </q-card-section>
                <q-card-section class="q-pt-none">
                 <q-scroll-area
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
              style="height: 190px; max-width: 100%"
            >                  
              <div
                v-for="n in 1"
                :key="n"
                class="q-pa-xs"
              >
                     Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.
              </div>
            </q-scroll-area>
                </q-card-section>
            </q-card>
        </div>
  
    </div>
  </q-page>
</template>

<style></style>

<script>
import { mapGetters } from "vuex";
import splitBtn from "components/split-btn";
import comparisonTable from "components/home/comparison-table";

export default {
  name: "PageIndex",
  components: {
    splitBtn,
    comparisonTable
    
  },
  data() {
    return {
      showYouTubeVideo: false,
      video_is_loaded: false
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",

    })
  },
  methods: {
    makeVisible (el, animation) {
      el.classList.add("animated", animation, "v-enter-to");
      el.classList.remove('invisible');
    }
  }
};
</script>

<style>
.diagonal {
  height: 400px;
  background-image: url("../statics/images/diagonal.svg");
  background-repeat: no-repeat;
  background-size: cover;
  margin-top: -30px;
}
.bottom-info-box {
  width: 304px;
  height: 177px;
  border: 1px solid var(--q-color-secondary);
  border-radius: 8px;
  box-sizing: border-box;
}
.header_box {
  border-bottom: 5px solid var(--q-color-primary);
}
</style>
