<template>
<div>

  <q-card v-if="getLatestUserterms">

  {{getIsMember}}
  {{getLatestUserterms}}

    <q-card-section v-if="!is_loading">
      <q-markdown
        v-if="getLatestUserterms.data!==false"
        :no-abbreviation="false"
        :src="getLatestUserterms.data"
      >
      </q-markdown>
    </q-card-section>
    <q-card-section v-else class="row justify-center">
      <q-spinner color="primary" size="40px" />
    </q-card-section>
  </q-card>
</div>
</template>

<script>
import { mapGetters } from "vuex";
import {notifyError} from '../imports/notifications.js';
import {get_content_from_trace} from '../imports/helpers.js';
export default {
  name: 'latestUserterms',
  data () {
    return {
      is_loading: false
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getIsMember: "user/getIsMember",
      getLatestUserterms: "group/getLatestUserterms"
    })
  },
  methods:{
    async loadUserterms(){
        let userterms =this.getLatestUserterms;
        if(userterms.data ===false){
          this.is_loading = true;
          let termsobj = await get_content_from_trace(userterms.trx_id, userterms.block_num, "fileupload", "content" );
          //get_content_from_trace(trxid, block_num, actionname, datakey )
          if(termsobj.error || !termsobj.found){
            notifyError({message : `Error getting the latest userterms` });
          }
          else{
            userterms.data = termsobj.content
          }
          this.is_loading = false;

        }

    }
  },
  watch:{
    getLatestUserterms:{
      immediate: true,
      handler: function(newV, oldV){
        if(newV)
        this.loadUserterms()
      }
    }
  }
}
</script>
