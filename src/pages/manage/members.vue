<template>
  <q-page  padding class="constrain-page-width">
    <page-header title="Members" />
    <div v-if="getActiveGroup">
      <!-- <pre>{{members}}</pre> -->
      <q-list class="primary-hover-list" bordered separator>
        <q-expansion-item v-for="member in members" :key="member.account" group="members">
          <template v-slot:header>
            <q-item-section avatar>
              <profile-pic :size="42" :account="member.account"  :icon="getIsCustodian(member.account) ? 'mdi-star' : ''" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-capitalize">
                <profile-link :account="member.account" :inversestyle="true" />
              </q-item-label>
              <!-- <q-item-label caption>ID {{payment.pay_id}}</q-item-label> -->
              <!-- {{getIsCustodian(member.account)}} -->
            </q-item-section>
          </template>

          <q-card>
            nothing here yet
          </q-card>

        </q-expansion-item>
      </q-list>
      <div class="text-right q-mt-md">
        <q-btn label="more" @click="fetchMembers()" color="primary" :disabled="!more" />
      </div>
    </div>

  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import pageHeader from "components/page-header";
import profilePic from "components/profile-pic";
import profileLink from "components/profile-link";

export default {
  name: 'members',
  components:{
    pageHeader,
    profilePic,
    profileLink
  },
  data () {
    return {
      next_key: '',
      more: false,
      members: []
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getIsCustodian: "group/getIsCustodian"
    })
  },
  methods:{

    async fetchMembers(){
      let res = await this.$eos.rpc.get_table_rows({
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
        return [];
      }
    }

  },
  mounted(){
    this.fetchMembers()
  }

}
</script>



