<template>
  <div>
      <q-select
        ref="searchselect"
        autocapitalize="off"
        autocomplete="off"
        hide-dropdown-icon
        color="primary"
        outlined
        v-model="model_accountname"
        use-input
        emit-value
        :hide-selected="true"
        fill-input
        :input-debounce="200"
        :options="fetchedAccountNames"
        @filter="filterFn"
        placeholder="Find Contract"
        @input="$emit('input', $event)"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:append>
          <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" >
            <q-icon v-if="model_accountname" name="close" @click="deleteInput" class="cursor-pointer"/>
          </transition>
        </template>
        <template v-slot:prepend>
          <q-icon name="search"/>
        </template>
        <template v-slot:option="scope">
          <q-item
            v-bind="scope.itemProps"
            v-on="scope.itemEvents"
          >
            <q-item-section>
              <q-item-label v-html="scope.opt.label" />
              <q-item-label caption>{{ scope.opt.account }}</q-item-label>
            </q-item-section>
            <!-- <q-item-section side v-if="scope.opt.warning">
              <q-icon name="mdi-alert" color="warning" >
                <q-tooltip content-class="bg-secondary" :delay="500">
                  Threshold exceeds number of guardians {{getNumberGuardians}}
                </q-tooltip>
              </q-icon>
            </q-item-section> -->
          </q-item>
        </template>
      </q-select>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const append_accounts=[{label:"eosio.token", value:"eosio.token"}, {label:"eosio.msig", value:"eosio.msig"}];
export default {
  name: 'findAccount',
  props:{
    value:{
      default:'',
      type: String
    }
  },
  computed: {
    ...mapGetters({
      getModules: "group/getModules",
      getAppConfig: "app/getAppConfig"

    })
  },
  data () {
    return {
      model_accountname:"",
      fetchedAccountNames: []
    }
  },
  mounted(){
    this.model_accountname = this.value;
    
  },
  watch:{
    getModules:{
      immediate:true,
      handler:function(newV, oldV){
        this.setDefaultOptions();
      }
    }
  },

  methods:{
    setDefaultOptions(){

      this.fetchedAccountNames = [
        {label:"Hub contract", account:this.getAppConfig.groups_contract, value:this.getAppConfig.groups_contract},
        {label:"Core contract",account:this.$store.state.group.activeGroup, value:this.$store.state.group.activeGroup},
      ];
      if(this.getModules){
        this.fetchedAccountNames = this.fetchedAccountNames.concat(this.getModules.map(m=> {
          if(m.has_contract){
            return {label: 'Module '+m.module_name, account: m.slave_permission.actor, value: m.slave_permission.actor}
          }
        })
        )
      }
    },
    async fetchAccounts(acc){
      let res = await this.$eos.api.rpc.get_table_by_scope({
        json: true,
        code: "eosio",
        scope: "eosio",
        table: "userres",
        lower_bound: acc.toLowerCase(),
        limit: 6
      }).catch(e => false);
      if(res){
        res = res.rows.map(x => {return {label:x.scope, value: x.scope} } );
        res = res.concat(append_accounts);
        return res;
      }
      else{
        return [];
      }
      
    },
    deleteInput(){
      this.model_accountname='';
      this.$emit('input', '');
      this.setDefaultOptions();
    },

    async filterFn (val, update, abort) {
       
      update(async () => {
        val = val.toLowerCase();
        if (  val.charAt(val.length - 1) =='.' || val=='') {
          abort();
          return;
        };
        let accs = await this.fetchAccounts(val)
        this.fetchedAccountNames = accs.filter(v => v.value.startsWith(val));
        // update();
      })
    }


  }
}
</script>

<style>
</style>
