<template>
  <div>
    <q-input
      v-model="upload_action.data.content"
      type="textarea"
      autogrow
      :input-style="{ padding: 0 }"
      borderless
    />
    <div class="text-right q-mt-md">
      <q-btn
        label="update"
        color="primary"
        @click="emitPropose"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { isValidAccountName } from "../../imports/validators";
import { mapGetters } from "vuex";
import thresholdBadge from "components/thresholds/threshold-badge";
import proposeBucketBtn from "components/actions/propose-bucket-btn";
import { get_content_from_trace } from "../../imports/helpers.js"; //get_content_from_trace(trxid, block_num, actionname, datakey )

export default defineComponent({
  name: "fileEditer",
  props: {
    filecontent: "",
    filescope: "",
    filetitle: "",
    fileid: 0
  },
  components: {
    thresholdBadge,
    proposeBucketBtn,
  },
  data() {
    return {
      step: "editcontent", //editcontent,upload,publish
      is_uploading: false,
      is_publishing: false,

      delete_action: {
        account: "",
        name: "filedelete",
        data: {
          file_scope: this.filescope,
          id: this.fileid,
        },
      },
      upload_action: {
        account: "",
        name: "fileupload",
        data: {
          uploader: "",
          file_scope: this.filescope,
          content: this.filecontent,
        },
      },
      publish_action: {
        account: "",
        name: "filepublish",
        data: {
          file_scope: "",
          trx_id: "",
          title: this.filetitle,
          block_num: "",
        },
      },
    };
  }, //getActiveGroup: "group/getActiveGroup",
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getIsMember: "user/getIsMember",
      getLinkedThresholdForContractAction: "group/getLinkedThresholdForContractAction",
    }),
  },
  methods: {
    isValidAccountName,
    async upload() {
      this.is_uploading = true;
      let res = await this.$store.dispatch("ual/transact", {
        actions: [this.upload_action],
        disable_signing_overlay: true,
      });
      if (res && res.trxid) {
        // console.log(res)
        this.publish_action.data.block_num = res.block_num;
        this.publish_action.data.trx_id = res.trxid;
        this.publish_action.data.file_scope = this.upload_action.data.file_scope;
        await new Promise((resolve) => {
          setTimeout(resolve, 2000);
        });
        let x = await get_content_from_trace(
          res.trxid,
          res.block_num,
          "fileupload",
          "content",
          this
        );
        console.log("receipt", res.block_num, "fetched", x.block_num);

        if (x && x.found) {
          this.publish_action.data.block_num = x.block_num;
        }
        //do publishing here
      }

      this.is_uploading = false;
    },
    async emitPropose() {
      await this.upload();
      let action = JSON.parse(JSON.stringify(this.publish_action));
      let deleteAction = JSON.parse(JSON.stringify(this.delete_action));

      const payload = {
        actions: [deleteAction, action],
        title: `Add new file in category "${action.data.file_scope}"`,
        description: "todo",
      };
      console.log("file publish", payload);
      this.$emit("propose", payload);
    },
    async emitBucket() {
      await this.upload();
      let action = JSON.parse(JSON.stringify(this.publish_action));
      this.$emit("addtobucket", action);
    },
  },
  mounted() {},
  watch: {
    getAccountName: {
      immediate: true,
      handler: function (newV, oldV) {
        if (this.getAccountName) {
          this.upload_action.account = this.delete_action.account = this.publish_action.account = this.getActiveGroup;
          this.upload_action.data.uploader = this.getAccountName;
          if (this.content) {
            this.upload_action.data.content = this.content;
          }
        }
      },
    }
  },
});
</script>
