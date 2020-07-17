<template>
  <div>
    <transition
      appear
      enter-active-class="animated zoomIn"
    >
    <q-card v-if="votes.votes">
      <q-card-section>
        <div class="row" v-if="votes.votes.length">
          <div v-for="vote in votes.votes" :key="vote" class="q-mr-sm cursor-pointer" @click="goToProfile(vote)">
            <profile-pic :account="vote" :size="40"  class="shadow-5" />
            <q-tooltip content-class="bg-primary" :delay="500">
              {{vote}}
            </q-tooltip>
          </div>
        </div>
        <div v-else>
          withdrew all votes
        </div>
        <div class="row justify-end">
          <date-string :date="votes.last_voted" prepend="Last voted: " />
          <q-btn icon="mdi-vote" size="xs" flat dense round color="primary" :to="`/members/${this.$route.params.groupname}/elections`" />
        </div>
      </q-card-section>
    </q-card>
    </transition>
  </div>
</template>

<script>
import profilePic from "components/profile-pic";
import dateString from "components/date-string";
export default {
  name: "displayVotes",
  components: {
    profilePic,
    dateString
  },
  props: {
    votes: {}
  },
  data() {
    return {};
  },
  methods:{
    goToProfile(v){
      console.log(`go to profile ${v}`);
      this.$router.push(`/members/${this.$route.params.groupname}/profile/${v}`).catch(e=>{});
    }
  }
};
</script>
