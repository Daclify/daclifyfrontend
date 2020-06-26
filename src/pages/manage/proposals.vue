<template>
  <q-page padding class="text-black overflow-hidden constrain-page-width" >
    <page-header title="Proposals" />
    <div>
      <q-input placeholder="Search" outlined v-model="filter">
        <template v-slot:prepend>
          <q-icon name="search" class="cursor-pointer" />
        </template>
        <template v-slot:append>
          <span class="text-caption on-left">{{tabfilter}}</span>
          <q-icon :name="menu_visible ? 'menu_open' : 'menu'" class="cursor-pointer" >
          <q-menu fit @before-show="menu_visible=true" @hide="menu_visible=false">
            <q-list style="min-width: 100px" class="primary-hover-list">
              <q-item clickable :to="`/manage/${getActiveGroup}/new-proposal`" v-close-popup>
                <q-item-section avatar>
                  <q-icon name="add_circle" />
                </q-item-section>
                <q-item-section>New Proposal</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
          </q-icon>
        </template>
      </q-input>
      <div class="q-mb-md">
        <q-tabs v-model="tabfilter" dense class=" text-primary" align="left" no-caps>
          <q-tab label="Active" name="active" />
          <q-tab label="Executed" name="executed" />
          <q-tab label="Cancelled" name="cancelled" />
          <q-tab label="Expired" name="expired" />

        </q-tabs>
        <q-separator />
      </div>
    </div>

      <transition
        appear
        enter-active-class="animated fadeInDown"
        class="column q-gutter-md "
        tag="div"
      >
        <span
          class="row items-center text-grey-7"
          v-if="!getProposalsWithFilter.length"
        >
          <q-icon name="error_outline" size="24px" class="q-mr-sm" />
          No {{tabfilter}} proposals found.
        </span>
      </transition>


    <transition-group
      appear
      enter-active-class="animated zoomIn"

      class="column q-gutter-md "
      tag="div"
    >
      <proposal-card v-for="proposal in getProposalsWithFilter" :proposal="proposal" :key="tabfilter+proposal.id" :proposalstate="tabfilter" />
    </transition-group>

    <!-- <proposer /> -->
    <!-- <pre>{{getProposals}}</pre> -->
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import pageHeader from "components/page-header";
import proposalsTable from "components/tables/proposals-table";
import proposalCard from "components/proposal-card";
// import proposer from "components/proposer/proposer";
export default {
  // name: 'LayoutName',
  components:{
    pageHeader,
    proposalCard,
    // proposer
  },
  data () {
    return {
      menu_visible: false,
      tabfilter: "active",
      filter: '',
    }
  },
  methods:{


  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getProposals: "group/getProposals",
      getActiveGroup: "group/getActiveGroup",
      getCLOCK: "app/getCLOCK",
    }),
    getProposalsWithFilter(){
      //tabfilter
      if(this.tabfilter=="active"){
        return this.getProposals.active;
      }
      if(this.tabfilter=="executed"){
        return this.getProposals.executed;
      }
      if(this.tabfilter=="cancelled"){
        return this.getProposals.cancelled;
      }
      if(this.tabfilter=="expired"){
        return [];
      }
    }
  },
  mounted(){
    if(!this.CLOCK_TIMER || !this.getCLOCK){
      this.$store.commit("app/setCLOCK", Date.now() );
      this.CLOCK_TIMER = setInterval(() => {
          this.$store.commit("app/setCLOCK", Date.now());
      }, 1000);
    }
  },
  beforeDestroy(){
    clearInterval( this.CLOCK_TIMER );
    this.CLOCK_TIMER = null;
  },
}
</script>
