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
      if(res && res.trxid){
        let block_time = res.block_time.split('.')[0];
        this.$store.commit('group/setGuardianLastActive', {guardian: this.getAccountName, block_time: block_time});
        setTimeout(()=>{
          this.$store.dispatch("group/loadGroupRoutine", {
            groupname: this.getActiveGroup
          });
        }, 1000)

      }
      else{
       
      }
      this.isloading = false;
    }
  }
}
</script>
