<template>
  <q-page  padding class="constrain-page-width">
 
    <div v-if="getCoreConfig" class="text-right q-mb-md">
      <q-badge  v-if="getCoreConfig.conf.member_registration" key="enabled" >Member Registration Enabled</q-badge>
      <q-badge  color="negative" v-else key="disabled">Member Registration disabled</q-badge>
    </div>


    <q-input placeholder="Find Member" outlined v-model.trim="searchfilter" class="q-mb-md">
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
          <q-tooltip :delay="250" content-class="bg-primary">{{candidates.length}} Active Candidates</q-tooltip>
        </div>
      </template> -->
    </q-input>



    <q-card v-if="getActiveGroup">
      <q-toolbar class="bg-secondary text-white shadow-2">
        <q-toolbar-title :shrink="true">
          <span>Members</span>
        </q-toolbar-title>
        <q-space />
        <div v-if="getCoreState">#{{getCoreState.state.member_count}}</div>
      </q-toolbar>
      <q-list class="primary-hover-list" bordered separator>
        <q-expansion-item v-for="member in members" :key="member.account" group="members">
          <template v-slot:header>
            <q-item-section avatar>
              <profile-pic :size="42" :account="member.account"  :icon="getIsGuardian(member.account) ? 'mdi-star' : ''" />
            </q-item-section>
            <q-item-section>
              <q-item-label >
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
        <q-item v-if="is_loading" >
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
import { mapGetters } from "vuex";

import profilePic from "components/profile-pic";
import profileLink from "components/profile-link";
import noItems from "components/no-items";

export default {
  name: 'members',
  components:{

    profilePic,
    profileLink,
    noItems
  },
  data () {
    return {
      next_key: '',
      more: false,
      members: [],
      is_loading: false,
      searchfilter: ""
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getIsGuardian: "group/getIsGuardian",
      getCoreConfig: "group/getCoreConfig",
      getCoreState: "group/getCoreState",
    })
  },
  methods:{

    async fetchMembers(){
      this.is_loading =true;
      let res = await this.$eos.api.rpc.get_table_rows({
        json: true,
        code: this.getActiveGroup,
        scope: this.getActiveGroup,
        table: "members",
        lower_bound: this.next_key,
        limit: 10
      }).catch(e => false);

      if(res){
        console.log(res)
        this.members = this.members.concat(res.rows);
        if(res.more){
          this.next_key = res.next_key;
        }
        this.more = res.more;
      }
      else{
        //return [];
      }
      this.is_loading =false;
    }

  },
  mounted(){
    this.fetchMembers()
  }

}
</script>



