<template>
  <div>
    <q-input placeholder="Find Candidate" outlined v-model.trim="searchfilter">
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
    <transition-group appear enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
      <candidate v-for="cand in candidates" :candidate="cand" :key="cand.cand" />
    </transition-group>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import profilePic from "components/profile-pic";
import candidate from "components/modules/elections/candidate";
import candidateProfile from "components/modules/elections/candidate-profile";
export default {
  name: "listCandidates",
  components: {
    profilePic,
    candidate,
    candidateProfile
  },
  data() {
    return {
      searchfilter: ""
    };
  },
  computed: {
    ...mapGetters({
      getElectionsContract: "elections/getElectionsContract",
      getAccountName: "ual/getAccountName",
      getUserVotes: "elections/getUserVotes",
      getElectionsConfig: "elections/getElectionsConfig",
      getElectionsState: "elections/getElectionsState",
      getCandidates: "elections/getCandidates"
    }),

    candidates() {
      if (!this.getCandidates) return [];
      let res = this.getCandidates.filter(c=> c.state==1);
      if(this.searchfilter.length){
        res = res.filter(c => c.cand.includes(this.searchfilter) );
      }
      return res.map(cand => {
        this.$set(cand, "vote", false);
        if (this.getUserVotes) {
          const voting = this.getUserVotes.votes.find(uv => cand.cand === uv);
          if (voting) {
            cand.vote = true;
          }
        }
        return cand;
      });
    }
  },
  methods: {
    async fetchcandidates() {
      if (!this.getCandidates) {
        this.$store.dispatch(
          "elections/fetchCandidates",
          this.getElectionsContract
        );
      }
    }
  },
  watch: {
    getElectionsContract: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          if (newVal != oldVal) {
            this.fetchcandidates();
          }
        }
      }
    }
  }
};
</script>

<style lang="sass"></style>
