<template>
  <div>
    <q-card class="q-mb-md" 
    v-intersection="vote_intersection" 
    >
      <q-card-section class="column justify-between" style="min-height:150px">
        
        <transition-group
          appear
          enter-active-class="animated zoomIn"
          leave-active-class="animated zoomOut"
          class="row q-gutter-sm"
          tag="div"
          mode="in-out"
        >
          <q-card
            v-for="vote in getNewVotes"
            :key="vote"
            :class="$q.dark.isActive ? `bg-secondary` : ``"
          >
            <q-item>
              <q-item-section side>
                <profile-pic :size="30" :account="vote" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ vote }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="close" color="negative" class="cursor-pointer" @click="removeNewVote(vote)" />
              </q-item-section>
            </q-item>
          </q-card>
          <div v-if="getNewVotes && getNewVotes.length ==0"  class="text-caption" key="no_votes">You don't have active votes</div>
        </transition-group>
        

        <div class="row justify-between items-center q-mt-sm">
          <div v-if="getElectionsConfig" class="rounded-borders bg-secondary text-white q-px-sm">{{`${getNewVotes.length}/${getElectionsConfig.max_votes}`}}</div>
          <q-btn label="vote" icon="mdi-vote" color="primary" :class="didVotesChange ? 'pulse' :''" :loading="getIsTransacting" @click="castNewVotes" :disabled="!didVotesChange"/>
        </div>
      </q-card-section>
    </q-card>

  <transition tag="div" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div v-if="show_fixed_votes && timedelay" class="my-votes-fixed rounded-borders-bottom row items-center bg-primary q-pl-xs q-pr-md q-py-sm">
      <q-btn label="vote" icon="mdi-vote" class="q-mr-lg" color="secondary" :class="didVotesChange ? 'pulse' :''" :loading="getIsTransacting" @click="castNewVotes" :disabled="!didVotesChange"/>
      
        <transition-group
          appear
          enter-active-class="animated zoomIn"
          leave-active-class="animated zoomOut"
          class="row"
        >
          <div v-for="vote in getNewVotes" :key="`f${vote}`">
            <profile-pic :account="vote" tooltip :size="30" style="margin-left:-13px" class="shadow-2"/>
          </div>
          <div v-if="getNewVotes && getNewVotes.length ==0"  class="text-caption q-pr-sm" key="no_votes">No votes</div>
        </transition-group>
    </div>
  </transition>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import profilePic from "components/profile-pic";

export default {
  name: "listUserVotes",
  components: {
    profilePic
  },
  data() {
    return {
      show_fixed_votes: false,
      timedelay:false,
      vote_intersection:{
        handler: this.onIntersection,
        cfg: {
          root: null,
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      getElectionsContract: "elections/getElectionsContract",
      getAccountName: "ual/getAccountName",
      getElectionsConfig: "elections/getElectionsConfig",
      getElectionsState: "elections/getElectionsState",
      getUserVotes: "elections/getUserVotes",
      getCandidates: "elections/getCandidates",
      getIsTransacting: "ual/getIsTransacting",
    }),
    getNewVotes() {
      if (this.getCandidates) {
        return this.getCandidates.filter(c => c.vote).map(nv => nv.cand);
      }
      else{
        return [];
      }
    },
    didVotesChange() {
      if (this.getNewVotes) {
        let newVotes = this.getNewVotes;
        let oldVotes = this.getUserVotes ? this.getUserVotes.votes : [];
        if (newVotes.length != oldVotes.length) {
          return true;
        } else {
          let difference = this.getNewVotes.filter(x => !oldVotes.includes(x));
          return !!difference.length;
        }
      }
    }
  },
  methods: {
    async fetchUserVotes() {
      if (
        !this.getUserVotes &&
        this.getAccountName &&
        this.getElectionsContract
      ) {
        await this.$store.dispatch("elections/fetchUserVotes", {
          voter: this.getAccountName
        });
      }
    },
    async castNewVotes(){
      let action = {
        account: this.getElectionsContract,
        name: "vote",
        data: {
          voter: this.getAccountName,
          new_votes:this.getNewVotes
        }
      };
      let res = await this.$store.dispatch("ual/transact", { actions: [action], disable_signing_overlay: true });
      if(res && res.trxid){
        setTimeout(()=>{
          this.$store.dispatch("elections/fetchUserVotes",{voter:this.getAccountName});
        },1000);
      }
    },
    onIntersection(el) {
      console.log(el);
      if (!el.isIntersecting) {
        this.show_fixed_votes = true;
      } else {
        this.show_fixed_votes = false;
      }
    },
    removeNewVote(vote){
      this.getCandidates.find(c => c.cand == vote && c.vote===true).vote= false;
      this.$store.commit("elections/updateCandidateTotalVotes",{cand: vote, delta:-1});
    }
  },
  mounted(){
    setTimeout(()=>{
      this.timedelay=true;
    },500)
  },

  watch: {
    getAccountName: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          if (newVal != oldVal) {
            this.fetchUserVotes();
          }
        } else {
          this.$store.commit("elections/setUserVotes", false);
        }
      }
    }
  }
};
</script>
<style>
.my-votes-fixed {
  /* position: fixed;
  z-index: 99;
  width: 100%;
  top:60px;
   */
  z-index: 99;
  position: fixed;
  top: 60px;
}
</style>
