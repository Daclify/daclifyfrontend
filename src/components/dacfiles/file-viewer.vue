<template>
  <div>


    <div>
      <!-- <page-header :title="getFileTitle()"/> -->
      <q-card style="min-height:300px">
        <q-toolbar class="bg-primary text-white shadow-2">
          <q-toolbar-title :shrink="true">
            <span class="text-capitalize">{{getFileTitle()}}</span>
          </q-toolbar-title>
          <q-space />
        </q-toolbar>
        <q-card-section>
          <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
            <div v-if="is_loading" class="row justify-center" key="loading">
              <q-spinner size="66px" color="primary" />
            </div>
            <q-markdown
              key="view"
              v-else
              class="text-weight-light"
              :src="error?'could not find content':content"
              :no-abbreviation="false"
            >
            </q-markdown>
          </transition>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import pageHeader from "components/page-header";
export default {
  name: "fileViewer",
  components:{
    pageHeader
  },
  props: {
    file: ""
  },
  data() {
    return {
      content: "",
      error:false,
      is_loading:false
    };
  },
  methods: {
    getFileTitle(){
      if(this.file){
        return this.file.title?this.file.title:'version '+this.file.id;
      }
      else{ 
        return "file viewer";
      }
      
    },
    async get_uploaded_content_from_block(file) {
      this.content = "";
      this.error = false;
      this.is_loading = true;
      let startblock = file.block_num;
      let endblock = startblock+10;

      let found = false;

      let block;
      while( !found && startblock !=endblock && !this.error){
        block = await this.$eos.rpc.get_block(startblock);
        console.log(startblock)
        console.log(block)
        if(block && block.transactions.length){
          let transaction = block.transactions.find(trx => trx.trx.id == file.trx_id);
          if(transaction){
            let data = transaction.trx.transaction.actions.find(a => a.name == "fileupload").data.content;
            if(data !==undefined){
              this.content = data;
              found = true;
            }
            else{
              this.error = true;
            }
          }
          else{
            startblock++;
            continue;        
          }
        }
        else{
          startblock++;
          continue;
        }
      }
      this.is_loading = false;
      
    }
  },
  watch: {
    file: {
      immediate: true,
      handler: function(newV, oldV) {
        if (newV && newV != oldV) {
          this.get_uploaded_content_from_block(newV);
        }
      }
    }
  }
};
</script>
