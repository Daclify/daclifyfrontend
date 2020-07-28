<template>
  <q-page padding class="constrain-page-width">
    <files-index @loadfile="currentFile=$event" />
    <file-viewer :file="currentFile" class="q-mt-md"/>
    <!-- <action-proposer>
      <template slot-scope="scope">
          <file-publisher :content="`test`" @propose="scope.propose" @addtobucket="scope.addtobucket" />
      </template>
    </action-proposer> -->
    
 
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
// import actionProposer from "components/actions/action-proposer";
// import filePublisher from "components/dacfiles/file-publisher";
import fileViewer from "components/dacfiles/file-viewer";
import filesIndex from "components/dacfiles/files-index";
export default {
  name: 'files',
  components:{
    fileViewer,
    filesIndex
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getCoreConfig: "group/getCoreConfig"
    }),
  },
  data () {
    return {
      currentFile:""
    }
  },
}
</script>
