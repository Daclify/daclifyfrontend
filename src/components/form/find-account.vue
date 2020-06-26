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
      </q-select>
  </div>
</template>

<script>
const append_accounts=['eosio.token', 'eosio.msig'];
export default {
  name: 'findAccount',
  props:{
    value:{
      default:'',
      type: String
    }
  },
  data () {
    return {
      model_accountname:this.value,
      fetchedAccountNames: [this.$store.state.group.activeGroup, ...this.$store.state.group.modules.map(m=> m.slave_permission.actor)]
    }
  },

  methods:{
    async fetchAccounts(acc){
      let res = await this.$eos.rpc.get_table_by_scope({
        json: true,
        code: "eosio",
        scope: "eosio",
        table: "userres",
        lower_bound: acc.toLowerCase(),
        limit: 6
      }).catch(e => false);
      if(res){
        res = res.rows.map(x => x.scope);
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
      this.fetchedAccountNames = [this.$store.state.group.activeGroup, ...this.$store.state.group.modules.map(m=> m.slave_permission.actor)];
    },

    async filterFn (val, update, abort) {
       
      update(async () => {
        val = val.toLowerCase();
        if (  val.charAt(val.length - 1) =='.' || val=='') {
          abort();
          return;
        };
        let accs = await this.fetchAccounts(val)
        this.fetchedAccountNames = accs.filter(v => v.startsWith(val));
        // update();
      })
    }


  }
}
</script>

<style>
</style>
