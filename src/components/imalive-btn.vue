<template>
  <div>
    <q-btn dense flat :loading="isloading" color="primary" size="sm" label="I'm alive" @click="imalive" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  // name: 'ComponentName',
  data () {
    return {
      isloading: false
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup"
    })
  },
  methods:{
    async imalive() {
      this.isloading = true;
      let action = {
        account: this.getActiveGroup,
        name: "imalive",
        data:{
          account: this.getAccountName
        }
      }
      let res = await this.$store.dispatch("ual/transact", {
        actions: [action],
        disable_signing_overlay: true
      });
      if(res && res.transactionId && res.status == "executed"){
        let block_time = res.transaction.processed.block_time.split('.')[0];
        this.$store.commit('group/setCustodianLastActive', {custodian: this.getAccountName, block_time: block_time});
      }
      else{
       
      }
      this.isloading = false;
    }
  }
}
</script>
