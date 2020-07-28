<template>
  <div>
    <!-- {{file_scopes}} -->
    <q-card>
      <q-toolbar class="bg-secondary text-white shadow-2"> 
        <q-toolbar-title :shrink="true">
          <span v-if="!add_document_view">Documents</span>
          <span v-else>Add document</span>
        </q-toolbar-title>
        <q-space />
        <q-btn
          round
          dense
          :icon="add_document_view ? 'mdi-minus' : 'mdi-plus'"
          color="primary"
          @click="add_document_view = !add_document_view"
        >
          <q-tooltip content-class="bg-secondary" :delay="500">
            <span v-if="!add_document_view">add document</span>
            <span v-else>Go back to documents</span>
          </q-tooltip>
        </q-btn>
      </q-toolbar>
      <transition  enter-active-class="animated zoomIn" leave-active-class="animated zoomOut" mode="out-in">
        <div v-if="!add_document_view" key="index">
          <div v-if="is_loading" class="row items-center justify-center">
            <q-spinner color="primary" size="42" />
          </div>
          <q-list
            v-else
            class="primary-hover-list"
            separator
            striped
          >
            <q-expansion-item clickable v-for="type in file_scopes" :key="type.scope" group="index">
              <template v-slot:header>
                <q-item-section>
                  <q-item-label>{{type.scope}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>{{type.count/2}}</q-item-label>
                </q-item-section>
              </template>
              <q-separator />
              <div>
                <index-items :file_scope="type.scope" @loadfile="$emit('loadfile', $event)" />
              </div>
            </q-expansion-item>
            <no-items v-if="file_scopes.length==0" text="No files found" />
          </q-list>
        </div>
        <div v-else key="add">
          <q-card-section>
            <action-proposer>
              <template slot-scope="scope">
                  <file-publisher :content="`this is test content`" @propose="scope.propose" @addtobucket="scope.addtobucket" />
              </template>
            </action-proposer>
          </q-card-section>
        </div>
      </transition>
    </q-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import indexItems from "components/dacfiles/index-items";
import noItems from "components/no-items";
import actionProposer from "components/actions/action-proposer";
import filePublisher from "components/dacfiles/file-publisher";
export default {
  name: 'filesIndex',
  components:{
    indexItems,
    noItems,
    filePublisher,
    actionProposer
  },
  data () {
    return {
      file_scopes: [],
      is_loading: false,
      add_document_view: false
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup"
    })
  },
  methods:{
    async loadFilesIndex(){
      this.is_loading = true;
      let res = await this.$eos.api.rpc.get_table_by_scope({
        json: true,
        code: this.getActiveGroup,
        table: "dacfiles",
        limit: -1
      }).catch(e => false);
      if(res && res.rows.length){
        this.file_scopes = res.rows;
      }
      this.is_loading = false;
    }
  },
  mounted(){
    this.loadFilesIndex();
  }
}
</script>
