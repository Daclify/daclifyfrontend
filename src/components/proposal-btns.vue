<template>
  <div>
    <div
      v-if="getAccountName && proposal && getIsGuardian(getAccountName)"
      class="row justify-end "
    >

      <q-btn
        v-if="isProposer"
        label="cancel"
        class="q-mr-xs"
        flat
        color="negative"
        size="sm"
        @click="$emit('useraction', { type: 'cancel', id: proposal.id })"
        :disabled="getIsTransacting"
      />
      <q-btn
        v-if="!getUserHasApproved && !getIsExecutable"
        label="approve"
        color="positive"
        size="sm"
        @click="$emit('useraction', { type: 'approve', id: proposal.id })"
        :disabled="getIsTransacting"
      />
      <q-btn
        v-if="getUserHasApproved && !getIsExecutable"
        label="unapprove"
        color="negative"
        size="sm"
        @click="$emit('useraction', { type: 'unapprove', id: proposal.id })"
        :disabled="getIsTransacting"
      />
      <q-btn
        v-if="getIsExecutable"
        label="execute"
        color="primary"
        size="sm"
        @click="$emit('useraction', { type: 'exec', id: proposal.id })"
        :disabled="getIsTransacting"
      />

    </div>
    <div v-else class="row justify-end ">
      <q-btn
        label="login as guardian"
        size="sm"
        flat
        @click="$store.dispatch('ual/renderLoginModal')"
        color="primary"
        :disabled="getIsTransacting"

      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "proposalBtns",
  components: {},
  props: {
    proposal: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getIsGuardian: "group/getIsGuardian",
      getThresholdByName: "group/getThresholdByName",
      getThresholds: "group/getThresholds",
      getIsTransacting: "ual/getIsTransacting"
    }),

    getUserHasApproved() {
      if (this.proposal && this.proposal.approvals && this.getAccountName) {
        return this.proposal.approvals.includes(this.getAccountName);
      }
    },
    getIsExecutable() {
      if (this.proposal && this.proposal.approvals && this.getAccountName && this.getThresholds.length) {
        const required_threshold_value = this.getThresholdByName(
          this.proposal.required_threshold
        ).threshold;

        let approved_weight = 0;
        this.proposal.approvals.forEach(approver => {
          const cust = this.getIsGuardian(approver);
          if (cust) {
            approved_weight += cust.weight;
          }
        });
        return approved_weight >= required_threshold_value;
      }
    },
    isProposer() {
      if (this.proposal && this.proposal.proposer && this.getAccountName) {
        return this.getAccountName == this.proposal.proposer;
      }
    }
  },
  methods: {}
};
</script>
