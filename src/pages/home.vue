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
    <div class="center-page-content q-pa-md text-white">
      <h5>Home page is in development</h5>
      <p class="invisible" v-scroll-fire="(el)=>{makeVisible(el, 'fadeIn')}">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

    
      <!-- <comparison-table style="max-width:700px"/> -->
      
      
      <div class="row justify-center">
        <img src="~assets/daclify-d-transparent.svg"  style="width:300px;" class="invisible" v-scroll-fire="(el)=>{makeVisible(el, 'fadeInDown')}"/>
      </div>
      <div class="row justify-center">
        <img src="~assets/daclify-d-transparent.svg"  style="width:300px;" class="invisible" v-scroll-fire="(el)=>{makeVisible(el, 'fadeInUp')}"/>
      </div>
      <div class="row justify-between ">
        <img src="~assets/daclify-d-transparent.svg"  style="width:30px;" class="invisible" v-scroll-fire="(el)=>{makeVisible(el, 'fadeInLeft')}"/>
        <img src="~assets/daclify-d-transparent.svg"  style="width:30px;" class="invisible" v-scroll-fire="(el)=>{makeVisible(el, 'fadeInRight')}"/>
      </div>
      <div class="row justify-center">
        <img src="~assets/daclify-d-transparent.svg"  style="width:300px;" class="invisible" v-scroll-fire="(el)=>{makeVisible(el, 'fadeInUp')}"/>
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
