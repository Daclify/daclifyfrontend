<template>
  <q-page padding class="constrain-page-width">
    <files-index @loadfile="currentFile = $event" />
    <file-viewer :file="currentFile" class="q-mt-md" />
    <!-- <action-proposer>
      <template v-slot="scope">
          <file-publisher :content="`test`" @propose="scope.propose" @addtobucket="scope.addtobucket" />
      </template>
    </action-proposer> -->
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
// import actionProposer from "components/actions/action-proposer";
// import filePublisher from "components/dacfiles/file-publisher";
import fileViewer from "components/dacfiles/file-viewer";
import filesIndex from "components/dacfiles/files-index";

export default defineComponent({
  name: "files",
  components: {
    fileViewer,
    filesIndex,
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getCoreConfig: "group/getCoreConfig",
    }),
  },
  data() {
    return {
      currentFile: "",
    };
  },
});
</script>
