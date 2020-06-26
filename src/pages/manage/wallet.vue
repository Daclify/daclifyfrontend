<template>
  <q-page padding class="constrain-page-width">
    <page-header title="Group Wallet"/>

  <q-card>
    <q-card-section>
      <action-proposer>
        <template slot-scope="scope">
          <transfer  @propose="scope.propose" @addtobucket="scope.addtobucket"/>
        </template>
      </action-proposer>
    </q-card-section>
  </q-card>

  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import actionProposer from "components/actions/action-proposer";
import transfer from "components/actions/transfer";
import pageHeader from "components/page-header";
export default {
  name: "groupWallet",
  components: {
    actionProposer,
    transfer,
    pageHeader
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName"

    }),
  
    
  },
  methods: {
    
  },

  watch: {}
};
</script>
