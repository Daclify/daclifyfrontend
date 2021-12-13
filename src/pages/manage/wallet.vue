<template>
  <q-page padding class="constrain-page-width">
    <pageHeader title="Group Wallet" />

    <q-card>
      <q-card-section>
        <actionProposer>
          <template v-slot="props">
            <transfer @propose="props.propose" @addtobucket="props.addtobucket" />
          </template>
        </actionProposer>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import actionProposer from "components/actions/action-proposer";
import transfer from "components/actions/transfer";
import pageHeader from "components/page-header";

export default defineComponent({
  name: "groupWallet",
  components: {
    actionProposer,
    transfer,
    pageHeader,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
    }),
  },
  methods: {},

  watch: {},
});
</script>
