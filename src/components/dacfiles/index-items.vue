<template>
  <div>
    <div v-if="is_loading" class="row items-center justify-center">
      <q-spinner color="primary" size="42" />
    </div>
    <q-list v-else separator>
      <q-item v-for="file in files" :key="file.id" clickable dense>
        <q-item-section avatar @click="$emit('loadfile', file)" >
          <q-icon name="mdi-file-document" />
        </q-item-section>
        <q-item-section style="margin-left:-25px">
          <q-item-label  >
            <span @click="$emit('loadfile', file)">{{file.title?file.title:`version ${file.id}`}}</span>
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label caption>
            <date-string prepend="published" :date="file.published" />
          </q-item-label>
        </q-item-section>
        <!-- <q-item-section side>
          <q-btn label="load" flat color="positive" dense size="sm" @click="$emit('loadfile', file)"/>
        </q-item-section> -->
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import dateString from "components/date-string";
export default {
  name: 'indexItems',
  props:{
    file_scope:""
  },
  components:{
    dateString
  },
  data () {
    return {
      is_loading: false,
      files: []
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
    })
  },
  methods:{
    async loadFiles(){
      this.is_loading = true;
      let res  = await this.$eos.api.rpc.get_table_rows({
        json: true,
        code: this.getActiveGroup,
        scope: this.file_scope,
        table: "dacfiles",
        limit: -1
        // lower_bound : this.getAccountName,
        // upper_bound : this.getAccountName,
        // index_position : 2,
        // key_type : 'i64',
        // reverse : true,
        // show_payer : false,
     });
     if(res && res.rows && res.rows.length){
       this.files = res.rows;
     }
     this.is_loading = false;
    }
  },
  mounted(){
    this.loadFiles();
  }
}
</script>
