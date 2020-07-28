<template>
  <div>

    <q-card>
      <q-toolbar class="bg-secondary text-white shadow-2">
        <q-toolbar-title :shrink="true">
          <span>Hooks</span>
        </q-toolbar-title>
        <q-space />
      </q-toolbar>
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
      </q-list>
    </q-card>
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
      file_scopes: [],
      is_loading: false
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
      else{
        return [];
      }
      this.is_loading = false;
    }
  },
  mounted(){
    this.loadFilesIndex();
  }
}
</script>
