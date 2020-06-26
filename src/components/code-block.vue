<template>
  <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut"  mode="out-in" tag="div">
    <div class="relative-position" v-if="!is_loading_remote_code">
      <!-- <q-scroll-area :visible="true" horizontal style="height: 100%; width:100%"> -->
      <vue-code-highlight>{{ remote_snippet || code }}</vue-code-highlight>
      <!-- </q-scroll-area> -->
      <q-btn
        v-if="copy"
        class="absolute-top-right q-ma-sm"
        unelevated
        size="sm"
        :icon="iconname"
        round
        color="primary"
        v-clipboard:copy="remote_snippet || code"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
      >
        <q-tooltip content-class="bg-secondary">
          {{ msg }}
        </q-tooltip>
      </q-btn>
    </div>
    <div v-else class="row justify-center" style="height:200px">
      <q-spinner color="primary" size="48" />
    </div>
  </transition>
</template>

<script>
import { component as VueCodeHighlight } from "vue-code-highlight";
import "../css/prism-coy.css"; //ok
// import  '../../node_modules/vue-code-highlight/themes/prism-okaidia.css';//ok
// import  '../../node_modules/vue-code-highlight/themes/prism-tomorrow.css';//ok

export default {
  // name: 'ComponentName',
  components: {
    VueCodeHighlight
  },
  props: {
    code: {
      type: String,
      default: ""
    },
    copy: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      iconname: "file_copy",
      msg: "copy",
      remote_snippet: "",
      is_loading_remote_code: false
    };
  },

  methods: {
    onCopy: function(e) {
      console.log("You just copied: " + e.text);
      this.iconname = "check";
      this.msg = "success";
      setTimeout(() => {
        this.iconname = "file_copy";
        this.msg = "copy";
      }, 1000);
    },
    onError: function(e) {
      alert("Failed to copy texts");
    },
    async fetchCodeSnippet(url) {
      this.is_loading_remote_code = true;
      let res = await this.$axios.get(url);
      // console.log(res)
      this.remote_snippet = res.data;
      this.is_loading_remote_code = false;
    }
  },
  async mounted() {
    if (this.code.startsWith("http")) {
      this.fetchCodeSnippet(this.code);
    }
  }
};
</script>
