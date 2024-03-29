<template>
  <div>
    <div>
      <!-- <page-header :title="getFileTitle()"/> -->
      <q-card style="min-height: 300px">
        <q-toolbar class="bg-secondary text-white shadow-2">
          <q-toolbar-title :shrink="true">
            <span v-if="!raw" class="text-capitalize">{{ getFileTitle() }}</span>
            <q-input
              v-else
              dense
              v-model="file_title"
              :input-style="{ padding: 0, color: '#fff' }"
            />
          </q-toolbar-title>
          <q-space />
          <q-btn
            v-if="content"
            :icon="raw ? 'mdi-minus' : 'mdi-pencil'"
            round
            dense
            color="primary"
            @click="raw = !raw"
          >
            <q-tooltip class="bg-secondary" :delay="500">
              Edit document
            </q-tooltip>
          </q-btn>
          <q-btn
            v-if="content"
            icon="mdi-trash-can"
            round
            dense
            style="margin-left: 3px"
            color="primary"
            @click="handleRemoveFile"
          >
            <q-tooltip class="bg-secondary" :delay="500">
              Remove document
            </q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-card-section>
          <transition
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            mode="out-in"
          >
            <div v-if="is_loading" class="row justify-center" key="loading">
              <q-spinner size="66px" color="primary" />
            </div>
            <div v-else key="loaded">
              <q-markdown
                v-if="!raw"
                class="text-weight-light"
                :src="error ? 'could not find content' : content"
                :no-abbreviation="false"
              >
              </q-markdown>
              <div v-else>
                <action-proposer>
                  <template v-slot="scope">
                    <file-editer
                      :fileid="file.id"
                      :filetitle="file_title"
                      :filescope="file.filescope"
                      :filecontent="content"
                      @propose="scope.propose"
                      @addtobucket="scope.addtobucket"
                    />
                  </template>
                </action-proposer>
              </div>
              <div v-if="!content" class="text-caption">No file selected</div>
            </div>
          </transition>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import pageHeader from "components/page-header";
import { get_content_from_trace } from "../../imports/helpers.js"; //get_content_from_trace(trxid, block_num, actionname, datakey )
import actionProposer from "components/actions/action-proposer";
import fileEditer from "components/dacfiles/file-editer";
import {notifyError, notifySuccess} from '../../imports/notifications';

export default defineComponent({
  name: "fileViewer",
  components: {
    pageHeader,
    actionProposer,
    fileEditer
  },
  props: {
    file: "",
  },
  data() {
    return {
      content: "",
      error: false,
      is_loading: false,
      raw: false,
      file_title: ""
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
    })
  },
  methods: {
    getFileTitle() {
      if (this.file) {
        return this.file.title ? this.file.title : "version " + this.file.id;
      } else {
        return "file viewer";
      }
    },
    async get_uploaded_content_from_block(file) {
      this.content = "";
      this.raw = false;
      this.error = false;
      this.is_loading = true;

      let x = await get_content_from_trace(
        file.trx_id,
        file.block_num,
        "fileupload",
        "content",
        this
      );
      if (!x.error) {
        this.content = x.content;
      } else {
        this.error = true;
      }

      this.is_loading = false;
    },
    async updateDocument() {
      this.raw = false;
    },
    async handleRemoveFile() {
      const delete_action = {
        account: this.getAccountName ? this.getActiveGroup : "",
        name: "filedelete",
        data: {
          file_scope: this.file.filescope,
          id: this.file.id,
        },
      };

      const deleteAction = JSON.parse(JSON.stringify(delete_action));

      const payload = {
        actions: [deleteAction],
        title: `Remove a file in category "${deleteAction.data.file_scope}"`,
        description: "Remove a file",
      };

      try {
        const res = await this.$store.dispatch("group/propose", {
          data: payload,
          vm: this,
        });

        if (res && res.trxid) {
          notifySuccess({ message: `File ${this.file.id} of category ${this.file.filescope} was removed successfully!` });
        } else {
          const error_msg = res.message || res;
          notifyError({ message: `${error_msg}`});
        }
      } catch (e) {
        notifyError({ message: `${e.message}`});
      }
    }
  },
  watch: {
    file: {
      immediate: true,
      handler: function (newV, oldV) {
        if (newV && newV != oldV) {
          this.get_uploaded_content_from_block(newV);
          this.file_title = this.getFileTitle();
        }
      },
    }
  },
});
</script>
