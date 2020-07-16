<template>
  <div>
    <!-- {{file_scopes}} -->
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title :shrink="true">
        <span>Documents</span>
      </q-toolbar-title>
      <q-space />
      <!-- <q-btn
        round
        dense
        :icon="add_threshold_link ? 'mdi-minus' : 'mdi-plus'"
        color="secondary"
        @click="add_threshold_link = !add_threshold_link"
      >
        <q-tooltip content-class="bg-secondary" :delay="500">
          <span >Add threshold link</span>
          <span v-else>Go back to threshold links</span>
        </q-tooltip>
      </q-btn> -->
    </q-toolbar>
    <q-list
      class="primary-hover-list"
      bordered
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
    </q-list>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import indexItems from "components/dacfiles/index-items";
export default {
  name: 'filesIndex',
  components:{
    indexItems
  },
  data () {
    return {
      file_scopes: []
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
      let res = await this.$eos.rpc.get_table_by_scope({
        json: true,
        code: this.getActiveGroup,
        table: "dacfiles",
        limit: -1
      }).catch(e => false);
      if(res && res.rows.length){
        this.file_scopes = res.rows;
      }
      else{
        return [];
      }
    }
  },
  mounted(){
    this.loadFilesIndex();
  }
}
</script>
