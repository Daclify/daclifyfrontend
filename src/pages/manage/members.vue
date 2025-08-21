<template>
  <q-page padding class="constrain-page-width">
    <div v-if="getCoreConfig" class="text-right q-mb-md">
      <q-badge v-if="getCoreConfig.conf.member_registration" key="enabled"
        >Member Registration Enabled</q-badge
      >
      <q-badge color="negative" v-else key="disabled"
        >Member Registration disabled</q-badge
      >
    </div>

    <q-input
      placeholder="Find Member"
      outlined
      v-model.trim="searchfilter"
      class="q-mb-md"
    >
      <template v-slot:prepend>
        <q-icon name="search" class="cursor-pointer" />
      </template>
      <template v-slot:append>
        <transition-group
          appear
          enter-active-class="animated fadeInRight"
          leave-active-class="animated fadeOutRight"
          tag="div"
        >
          <q-icon
            v-if="searchfilter.length"
            name="close"
            key="has_filter"
            @click="searchfilter = ''"
            class="cursor-pointer"
          />
        </transition-group>
      </template>
      <!-- <template v-slot:after>
        <div>
          <span>#{{candidates.length}}</span>
          <q-tooltip :delay="250" class="bg-primary">{{candidates.length}} Active Candidates</q-tooltip>
        </div>
      </template> -->
    </q-input>

    <q-card v-if="getActiveGroup">
      <q-toolbar class="bg-secondary text-white shadow-2">
        <q-toolbar-title :shrink="true">
          <span>Members</span>
        </q-toolbar-title>
        <q-space />
        <div v-if="getCoreState">#{{ getCoreState.state.member_count }}</div>
      </q-toolbar>
      <q-list class="primary-hover-list" bordered separator>
        <q-expansion-item v-for="member in members" :key="member.account" group="members">
          <template v-slot:header>
            <q-item-section avatar>
              <profile-pic
                :size="42"
                :account="member.account"
                :icon="getIsGuardian(member.account) ? 'mdi-star' : ''"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <profile-link :account="member.account" :inversestyle="true" />
              </q-item-label>
              <!-- <q-item-label caption>ID {{payment.pay_id}}</q-item-label> -->
              <!-- {{getIsGuardian(member.account)}} -->
            </q-item-section>
          </template>
          <q-separator />
          <q-card>
            <q-card-section>
              <q-item-label caption>nothing here yet</q-item-label>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-item v-if="is_loading">
          <div class="row items-center justify-center full-width">
            <q-spinner color="primary" size="24px" />
          </div>
        </q-item>
        <no-items v-if="!is_loading && !members.length" text="No members" />
      </q-list>
    </q-card>
    <div class="text-right q-mt-md">
      <q-btn label="more" @click="fetchMembers()" color="primary" :disabled="!more" />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import profilePic from "components/profile-pic";
import profileLink from "components/profile-link";
import noItems from "components/no-items";

export default defineComponent({
  name: "members",
  components: {
    profilePic,
    profileLink,
    noItems,
  },
  data() {
    return {
      next_key: "",
      more: false,
      members: [],
      is_loading: false,
      searchfilter: "",
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getIsGuardian: "group/getIsGuardian",
      getCoreConfig: "group/getCoreConfig",
      getCoreState: "group/getCoreState",
    }),
  },
  methods: {
    async fetchMembers() {
      this.is_loading = true;

      // Mock data for UI testing
      const mockMembers = [
        {
          account: "member1",
          weight: 1000,
          joined: "2024-01-01T00:00:00.000Z",
          is_active: true,
          last_active: "2024-01-15T10:30:00.000Z"
        },
        {
          account: "member2",
          weight: 1500,
          joined: "2024-01-02T00:00:00.000Z",
          is_active: true,
          last_active: "2024-01-14T15:45:00.000Z"
        },
        {
          account: "member3",
          weight: 800,
          joined: "2024-01-03T00:00:00.000Z",
          is_active: true,
          last_active: "2024-01-13T09:20:00.000Z"
        },
        {
          account: "member4",
          weight: 1200,
          joined: "2024-01-04T00:00:00.000Z",
          is_active: false,
          last_active: "2024-01-10T14:15:00.000Z"
        },
        {
          account: "member5",
          weight: 900,
          joined: "2024-01-05T00:00:00.000Z",
          is_active: true,
          last_active: "2024-01-15T11:00:00.000Z"
        }
      ];

      // Simulate pagination
      if (this.next_key === "") {
        this.members = mockMembers.slice(0, 3); // First 3 members
        this.more = true;
        this.next_key = "3";
      } else {
        this.members = this.members.concat(mockMembers.slice(3, 5)); // Last 2 members
        this.more = false;
        this.next_key = "";
      }

      this.is_loading = false;
    },
  },
  mounted() {
    this.fetchMembers();
  },
});
</script>
