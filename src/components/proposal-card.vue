<template>
  <div class="q-pb-xs">
    <q-card  class="proposal" :class="{'proposal-voted': hasVoted}">
      <q-expansion-item
        
        class="primary-hover-list"
        group="somegroup"
        :expand-icon-toggle="false"
      >
        <template v-slot:header>
          <q-item-section avatar>
            <q-spinner v-if="is_signing" size="60px" color="primary"/>
            <q-circular-progress
              v-if="!is_signing && getCLOCK > 0"
              show-value
              class=""
              :value="getExpirationStats.rel_perc"
              size="60px"
              :thickness="0.2"
              color="primary"
              center-color="grey-4"
              track-color="grey-3"
            >

              <div class="text-secondary">
                <proposal-icon :actions="proposal.actions" />
              </div>
              <q-tooltip
                content-class="bg-secondary"
                :delay="200"
                anchor="center right"
                self="center left"
                :offset="[10, 10]"
              >
                <span>{{ getExpirationStats.rel_human }}</span>
                <!-- <span>Proposal executed</span>
              <span>Proposal cancelled</span> -->
              </q-tooltip>
            </q-circular-progress>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-light text-h6 text-capitalize">{{
              proposal.title
            }}</q-item-label>
            <q-item-label caption
              >Proposed by {{ proposal.proposer }}</q-item-label
            >
          </q-item-section>
          <q-item-section side >
            
            <q-item-label caption >
              Threshold <span v-if="proposalstate == 'active'">{{ getThresholdScore.approved_weight }}/{{getThresholdScore.threshold}}</span>
            </q-item-label>
            <q-badge>{{ getThresholdScore.threshold_name }}</q-badge>
            
            <!-- {{getExpirationStats}} -->
          </q-item-section>
        </template>

        <q-tabs v-model="tabfilter" class=" text-primary" align="left">
          <q-tab label="About" name="about" />
          <q-tab label="Actions" name="actions">
            <q-badge
              v-if="proposal.actions.length"
              floating
              color="primary"
              class="round"
            >
              {{ proposal.actions.length }}
            </q-badge>
          </q-tab>
          <q-tab label="Votes" name="votes">
            <q-badge
              v-if="proposal.approvals.length"
              floating
              color="positive"
              class="round"
            >
              {{ proposal.approvals.length }}
            </q-badge>
          </q-tab>

        </q-tabs>
        <q-separator />

        <q-tab-panels v-model="tabfilter" animated transition-prev="fade" transition-next="fade">
          <q-tab-panel name="votes" class="overflow-hidden">
            <approvals-list :approvals="proposal.approvals" />
          </q-tab-panel>

          <q-tab-panel name="about" class="overflow-hidden no-padding">
            
            <q-scroll-area
              :visible="true"
              :thumb-style="thumbStyle"
              style="height: 200px; width:100%"
            >
              <div class="q-px-md q-pt-xs text-grey-7">
                <div class="text-weight-bold">Description</div>

                  <q-markdown
                    class="text-weight-light"
                    :src="proposal.description"
                    :no-abbreviation="false"
                  >
                  </q-markdown>

                <!-- <span v-for="i in 1000" :key="i">Lorem Ipsum is simply dummy text of the printing and typesetting industry. </span> -->
              </div>
            </q-scroll-area>
                <div class="row justify-between text-caption q-px-md text-grey-5">
                  <div><date-string prepend="Submitted:" :date="proposal.submitted" /></div>
                  <div><b>Expiration</b>: {{proposal.expiration}}</div>
                  <div><b>ID</b>: {{proposal.id}}</div>
                </div>
          </q-tab-panel>
          <q-tab-panel name="actions" class="overflow-hidden">
            <transition-group
              appear
              enter-active-class="animated zoomIn"
              leave-active-class="animated zoomOut"
              mode="out-in"
              class="row q-gutter-sm"
              tag="div"
            >
              <action-display
                v-for="(action, i) in proposal.actions"
                :key="`${i}${action.name}`"
                :action="action"
              />
            </transition-group>
          </q-tab-panel>
        </q-tab-panels>

        <q-separator />
        <div class="q-pa-md row justify-between">
          <trx-id :trxid="proposal.trx_id" />
          <proposal-btns
            v-if="proposalstate == 'active'"
            :proposal="proposal"
            @useraction="handleUserAction"
          />
          <q-btn
            v-if="proposalstate == 'executed'"
            unelevated
            :label="`executed by ${proposal.last_actor}`"
            color="primary"
            size="sm"
          />
          <q-btn
            v-if="proposalstate == 'cancelled'"
            unelevated
            :label="`cancelled by ${proposal.last_actor}`"
            color="negative"
            size="sm"
          />
        </div>
      </q-expansion-item>
    </q-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import dateString from "components/date-string";
import proposalBtns from "components/proposal-btns";
import approvalsList from "components/approvals-list";
import actionDisplay from "components/action-display";
import proposalIcon from "components/proposal-icon";
import trxId from "components/trx-id";
import { getLogoForToken } from "../imports/tokens.js";
import { secondsToDhms } from "../imports/helpers.js";

export default {
  name: "proposalCard",
  components: {
    proposalBtns,
    approvalsList,
    actionDisplay,
    trxId,
    proposalIcon,
    dateString
  },
  props: {
    proposal: {
      type: Object,
      default: () => {
        return {};
      }
    },
    proposalstate: {
      type: String,
      default: ""
    }

  },

  data() {
    return {
      is_signing: false,
      tabfilter: "about",
      thumbStyle: {
        right: "0px",
        borderRadius: "5px",
        backgroundColor: "#7DC6EC",
        width: "5px",
        opacity: 0.75
      }
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getIsTransacting: "ual/getIsTransacting",
      getActiveGroup: "group/getActiveGroup",
      getGroupWallet: "group/getGroupWallet",
      getThresholdByName: "group/getThresholdByName",
      getIsGuardian: "group/getIsGuardian",
      getCLOCK: "app/getCLOCK"
    }),
    hasVoted(){
      let res = false;
      if(this.getAccountName){
        res = this.proposal.approvals.includes(this.getAccountName);
      }
      return res;
    },
    getThresholdScore() {
      let res = {
        approved_weight: 0,
        threshold: "",
        threshold_name: ""
      };
      let t = this.getThresholdByName(this.proposal.required_threshold);
      if (this.proposal && this.proposal.approvals && t) {
        res.threshold = t.threshold;
        res.threshold_name = t.threshold_name;
        this.proposal.approvals.forEach(approver => {
          const cust = this.getIsGuardian(approver);
          if (cust) {
            res.approved_weight += cust.weight;
          }
        });
      }
      return res;
    },
    getExpirationStats() {
      let submitted = new Date(
        this.proposal.submitted + ".000+00:00"
      ).getTime();
      let expiration = new Date(
        this.proposal.expiration + ".000+00:00"
      ).getTime();
      let active_period = expiration - submitted;
      let now = this.getCLOCK;
      let ms_left = expiration - now;
      ms_left = ms_left <= 0 ? 0 : ms_left;
      return {
        rel_human: ms_left
          ? "Proposal will expire in " + secondsToDhms(ms_left / 1000)
          : "Proposal expired",
        rel_perc: (ms_left / active_period) * 100
      };
      return;
    }
  },
  methods: {
    async handleUserAction(e) {
      
      console.log(e);
      const id = e.id;
      const type = e.type;
      let action = {
        account: this.getActiveGroup,
        name: type,
        data: {
          id: id
        }
      };
      let r;
      switch (type) {
        case "approve":
          action.data.approver = this.getAccountName;
          r = (await this.push(action)) ? this.proposal.approvals.push(this.getAccountName) : null;
          break;
        case "unapprove":
          action.data.unapprover = this.getAccountName;
          r = await this.push(action);
          if (r) {
            this.proposal.approvals = this.proposal.approvals.filter( pa => pa != this.getAccountName);
          }
          break;
        case "cancel":
          action.data.canceler = this.getAccountName;
          (await this.push(action))
            ? this.$store.commit("group/deleteProposalById", this.proposal.id)
            : null;
          break;
        case "exec":
          action.data.executer = this.getAccountName;
          let res = await this.push(action);
          if(res){
            this.$store.commit("group/deleteProposalById", this.proposal.id);
            setTimeout(()=>{
              this.$store.dispatch("group/loadGroupRoutine", {groupname: this.getActiveGroup})
            }, 2000);
          }

          break;
        default:
          break;
      }
    },
    async push(action) {
      this.is_signing = true;
      let res = await this.$store.dispatch("ual/transact", {
        actions: [action],
        disable_signing_overlay: true
      });
      if (res && res.trxid) {
        this.is_signing = false;
        return true;
      } else {
        this.is_signing = false;
        return false;
      }
      this.is_signing = false;
    }
  }
};
</script>

<style>
.proposal-voted{
  border: 2px solid var(--q-color-primary) !important;
}
.proposal{
  border: 2px solid transparent;
  transition : border 500ms ease-out;
}
</style>
