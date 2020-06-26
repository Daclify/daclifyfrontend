<template>
  <q-page padding class="overflow-hidden">
    <h5>Deposits</h5>

    <deposits />
    <q-separator class="q-my-md" />
    <p>Your deposits are used to pay gas. You can pay upfront or pay as you go (via an inline action). When one of your cronjobs is cancelled and/or expired the associated gas will be refunded in to your deposits.</p>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import deposits from "components/deposit/deposits";
export default {
  // name: 'PageName',
  components: {
    deposits
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getAppConfig: "app/getAppConfig"
    })
  },
  methods: {
    async processAction() {}
  },
  watch: {

  }
};
</script>

<style>
</style>
