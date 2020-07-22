<template>

    <action-proposer>
      <template slot-scope="scope">
        <!-- <buy-ram @propose="scope.propose" @addtobucket="scope.addtobucket" /> -->

        <div class="">
         
            <q-markup-table flat>
    
                <thead>
                  <tr>
                    <th class="text-left">key</th>
                    <th class="text-left">old value</th>
                    <th class="text-left">new value</th>
                    <th class="text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="change in getCoreConfigDeltas" :key="`${change.path.join('')}`">
                    <td>{{change.path.join('.')}}</td>
                    <td>{{change.lhs}}</td>
                    <td>{{change.rhs}}</td>
                    <td class="text-right">
                      <q-btn
                        icon="mdi-undo"
                        size="sm"
                        round
                        unelevated
                        @click="
                          $store.commit('group/setNewCoreConfigPath', {
                            value: change.lhs,
                            path: change.path.join('.')
                          })
                        "
                      >
                        <q-tooltip :delay="450" content-class="bg-secondary">
                          undo change
                        </q-tooltip>
                      </q-btn>
                    </td>
                  </tr>
                </tbody>
          
            </q-markup-table>


            <!--  <q-list class="primary-hover-list">
              <transition-group
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
              mode="out-in"
            >
              <q-item
                clickable
                v-for="change in getCoreConfigDeltas"
                :key="`${change.path.join('')}`"
              >
                <q-item-section>
                  <q-item-label>{{ JSON.stringify(change) }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    icon="mdi-undo"
                    size="sm"
                    round
                    unelevated
                    @click="
                      $store.commit('group/setNewCoreConfigPath', {
                        value: change.lhs,
                        path: change.path.join('.')
                      })
                    "
                  >
                    <q-tooltip :delay="450" content-class="bg-secondary">
                      undo change
                    </q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
            </transition-group> -->
          </q-list>

          <div class="row justify-end q-pa-md">
            <propose-bucket-btn
              @click-propose="scope.propose(getProposeAction)"
              @click-bucket="scope.addtobucket(getBucketAction)"
              label="Update config"
              :disabled="!!!getCoreConfigDeltas"
            />
          </div>
        </div>
      </template>
    </action-proposer>

</template>

<script>
import proposeBucketBtn from "components/actions/propose-bucket-btn";
import actionProposer from "components/actions/action-proposer";
import { mapGetters } from "vuex";
export default {
  // name: 'ComponentName',
  components: {
    actionProposer,
    proposeBucketBtn
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getCoreConfigDeltas: "group/getCoreConfigDeltas",
      getNewCoreConfig: "group/getNewCoreConfig"
    }),
    getProposeAction() {
      // this.$refs.bytes.validate();
      // if(this.$refs.bytes.hasError){
      //   return;
      // }
      let action = this.getAction();
      const payload = {
        actions: [action],
        description: `Changed values: \n${this.getCoreConfigDeltas
          .map(e => e.path.join(".") + ": " + e.rhs)
          .join("\n")}`,
        title: "Update group configuration"
      };
      console.log(payload)
      return payload;
    },
    getBucketAction() {
      return this.getAction();
    }
  },
  methods: {
    getAction() {
      //parse the data for chain
      let new_conf = JSON.parse(JSON.stringify(this.getNewCoreConfig.conf));
      new_conf.exec_on_threshold_zero = !!new_conf.exec_on_threshold_zero;
      new_conf.member_registration = !!new_conf.member_registration;
      new_conf.withdrawals = !!new_conf.withdrawals;
      new_conf.internal_transfers = !!new_conf.internal_transfers;
      new_conf.deposits = !!new_conf.deposits;
      new_conf.userterms = !!new_conf.userterms;
      new_conf.r1 = !!new_conf.r1;
      new_conf.r2 = !!new_conf.r2;
      // new_conf.r3 = !!new_conf.r3;

      let action = {
        account: this.$store.state.group.activeGroup,
        name: "updateconf",
        data: {
          new_conf: new_conf,
          remove: false
        }
      };
      return action;
    }
  }
};
</script>
