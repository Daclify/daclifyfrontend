<template>
  <div class="row q-col-gutter-md">
    <div class="col-xs-12">
      Compose content
    </div>
    
    <q-input
      class="col-xs-12 col-md-6"
      ref="filescope"
      label="Category"
      autocomplete="off"
      outlined
      bottom-slots
      maxlength="12"
      v-model.trim="upload_action.data.file_scope"
      placeholder="Choose a file category (ex. userterms)"
      :rules="[
        val => !!val || '* Required',
        isValidAccountName
      ]"
    >
      <template v-slot:prepend>
        <q-icon name="mdi-shape" />
      </template>
    </q-input>

    <q-input
      class="col-xs-12 col-md-6"
      ref="title"
      label="Title"
      autocomplete="off"
      outlined
      bottom-slots
      maxlength="60"
      v-model.trim="publish_action.data.title"
      placeholder="Title (optional)"
      :rules="[
      ]"
    >
      <template v-slot:prepend>
        <q-icon name="mdi-file-document" />
      </template>
    </q-input>

    <div class="col-xs-12">
      <div class="">preview</div>
      <q-input
        :outlined="false"
        :autogrow="true"
        label="Content" 
        v-model="upload_action.data.content" 
        
        type="textarea"
        placeholder="Markdown supported"
      />
    </div>

    <div class="col-xs-12 row justify-between items-center">
      <threshold-badge v-if="publish_action.account" label :threshold="getLinkedThresholdForContractAction(publish_action.account, publish_action.name)"/>
      <div class="row justify-end items-center">
        <q-badge v-if="is_uploading" color="secondary" class="q-mr-xs">waiting for upload signature</q-badge>
        <propose-bucket-btn @click-propose="emitPropose" @click-bucket="emitBucket" label="publish" :disabled="false" :loading="is_uploading"/>
      </div>
    </div>

    <!-- <pre>{{publish_action}}</pre> -->
    <!-- <pre>{{upload_action}}</pre> -->
  </div>
</template>

<script>
import {
  isValidAccountName
} from "../../imports/validators";
import { mapGetters } from "vuex";
import thresholdBadge from "components/thresholds/threshold-badge";
import proposeBucketBtn from "components/actions/propose-bucket-btn";
import {get_content_from_trace} from "../../imports/helpers.js"; //get_content_from_trace(trxid, block_num, actionname, datakey )

export default {
  name: "filePublisher",
  props:{
    content:""
  },
  components:{
    thresholdBadge,
    proposeBucketBtn
  },
  data() {
    return {
      step: "editcontent", //editcontent,upload,publish
      is_uploading: false,
      is_publishing: false,

      upload_action:{
        account:"",
        name:"fileupload",
        data:{
          uploader:"",
          file_scope:"",
          content:""
        }

      },
      publish_action:{
        account:"",
        name:"filepublish",
        data:{
          file_scope:"",
          trx_id:"",
          title:"",
          block_num:""
        }
      }
    };
  }, //getActiveGroup: "group/getActiveGroup",
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getIsMember: "user/getIsMember",
      getLinkedThresholdForContractAction:"group/getLinkedThresholdForContractAction"
    })
  },
  methods: {
    isValidAccountName,
    async upload(){

      this.is_uploading= true;
      let res = await this.$store.dispatch("ual/transact", { actions: [this.upload_action], disable_signing_overlay: true });
      if(res && res.trxid){
        // console.log(res)
        this.publish_action.data.block_num = res.block_num;
        this.publish_action.data.trx_id = res.trxid;
        this.publish_action.data.file_scope = this.upload_action.data.file_scope;
        await new Promise((resolve) => {setTimeout(resolve, 2000)});
        let x = await get_content_from_trace(res.trxid, res.block_num, "fileupload", "content" );
        console.log("receipt",res.block_num, "fetched",x.block_num);

        if(x && x.found){
          this.publish_action.data.block_num = x.block_num
        }
        //do publishing here
        
      }

      this.is_uploading= false;

    },
    async emitPropose(){
      this.$refs.filescope.validate()
      if(this.$refs.filescope.hasError){
        return;
      }
      await this.upload();
      let action = JSON.parse(JSON.stringify(this.publish_action));
      const payload = {
        actions: [action],
        title: `Add new file in category "${action.data.file_scope}"`,
        description: 'todo'     
      }
      console.log('file publish', payload)
      this.$emit('propose', payload);
    },
    async emitBucket(){
      this.$refs.filescope.validate()
      if(this.$refs.filescope.hasError){
        return;
      }
      await this.upload();
      let action = JSON.parse(JSON.stringify(this.publish_action))
      this.$emit('addtobucket', action);     
    },
  },
  mounted(){

  },
  watch:{
    getAccountName: {
      immediate: true,
      handler:function (newV, oldV){
        if(this.getAccountName){
          this.upload_action.account = this.publish_action.account = this.getActiveGroup;
          this.upload_action.data.uploader = this.getAccountName;
          if(this.content){
            this.upload_action.data.content = this.content;
          }
        }
      }
    }

  }
};
</script>
