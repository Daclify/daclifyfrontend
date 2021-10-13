<template>
  <div>
    <transition-group
      appear
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
      mode="out-in"
      class="row q-gutter-sm"
      tag="div"
    >
      <div v-if="!approvals.length" key="no_approvals">
        <q-item >
          <q-item-section>
            <q-item-label class="text-capitalize">No approvals</q-item-label>
            <q-item-label caption>Threshold not met</q-item-label>
          </q-item-section>
        </q-item>
      </div>
      <q-card
        class="guardian-card shadow-1"
        v-for="approver in approvals"
        :key="`a${approver}`"
        :class="$q.dark.isActive ? `bg-secondary` : ``"
      >
        <q-item >
          <q-item-section avatar>
            <profile-pic :size="42" icon="check" iconColor="positive" :account="approver"  />
          </q-item-section>

          <q-item-section style="margin-left:-7px">
            <q-item-label class="text-capitalize">{{ approver }}</q-item-label>
            <q-item-label caption v-if="getIsGuardian(approver)">
              Weight {{ getIsGuardian(approver).weight }}
            </q-item-label>
            <q-item-label caption v-else>
              Ex Guardian
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
    </transition-group>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import profilePic from "components/profile-pic"
export default {
  name: "approvalsList",
  components:{
    profilePic
  },
  props: {
    approvals: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getIsGuardian: "group/getIsGuardian"
    })
  },
  methods: {}
};
</script>
