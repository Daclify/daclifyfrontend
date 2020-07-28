<template>
  <q-page padding class="constrain-page-width">
  <div>

    <q-input class="q-pb-md" placeholder="Find hook" outlined v-model.trim="searchfilter"  @input="add_hook_view= false">
      <template v-slot:prepend>
        <q-icon name="search" class="cursor-pointer" />
      </template>
      <template v-slot:append>
        <transition
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
        </transition>
      </template>
    </q-input>


    <q-card>
      <q-toolbar class="bg-secondary text-white shadow-2">
        <q-toolbar-title :shrink="true">
          <span>Hooks</span>
        </q-toolbar-title>
        <q-space />
        <q-btn round dense :icon="add_hook_view?'mdi-minus':'mdi-plus'" color="primary" @click="add_hook_view=!add_hook_view">
          <q-tooltip content-class="bg-secondary" :delay="500">
            <span v-if="!add_hook_view">Add new hook</span>
            <span v-else>Go back to hooks</span>
          </q-tooltip>  
        </q-btn>
      </q-toolbar>

      <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut" mode="out-in" tag="div" >
      
      <q-list
        v-if="!add_hook_view"
        key="listhooks"
        class="primary-hover-list"
        separator
      >
        <!-- <transition-group appear enter-active-class="animated zoomIn" leave-active-class="animated zoomOut"> -->
          <q-expansion-item clickable v-for="hook in getFilteredHooks" :key="hook.hook_id" group="hooks">
            <template v-slot:header>
              <q-item-section>
                <q-item-label>{{hook.hook_action_name}}</q-item-label>
                <q-item-label caption>
                  <div v-if="hook.enabled" >enabled</div>
                  <div v-else >disabled</div>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label>
                  <q-icon name="mdi-anchor" />
                  {{hook.hooked_contract}}::{{hook.hooked_action}}
                </q-item-label>
              </q-item-section>
            </template>
            <q-separator />
            <div class="q-pa-md text-caption">
              <div>{{hook.description}}</div>
            </div>
          </q-expansion-item>
          <q-item v-if="!getFilteredHooks.length">
            <q-item-section>
              <q-item-label>No hooks</q-item-label>
            </q-item-section>
          </q-item>
        <!-- </transition-group> -->
      </q-list>

      <action-proposer v-else key="addhook">
        <template slot-scope="scope">
            <add-hook @propose="scope.propose" @addtobucket="scope.addtobucket"/>
        </template>
      </action-proposer>
      </transition>
    </q-card>
  </div>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import addHook from "components/modules/hooks/add-hook";
import actionProposer from "components/actions/action-proposer";

export default {
  name: "hooks",
  components:{
    addHook,
    actionProposer
  },
  data() {
    return {
      add_hook_view:false,
      searchfilter:""
    };
  },
  computed: {
    ...mapGetters({
      getHooksContract: "hooks/getHooksContract",
      getHooks: "hooks/getHooks"
    }),
    getFilteredHooks(){
      if(this.getHooks && this.getHooks.length){
        let res = this.getHooks;
        if(this.searchfilter){
          res = res.filter(h =>{
            return h.hook_action_name.includes(this.searchfilter) ||
            h.hooked_action.includes(this.searchfilter) ||
            h.hooked_contract.includes(this.searchfilter)
          })
        }
        return res;
      }
      else{
        return [];
      }
      
    }
  },
  methods: {

  },
  watch: {
    getHooksContract: {
      handler: async function(newVal, oldVal) {
        if (newVal && newVal != oldVal && !this.getHooks) {
          this.$store.dispatch("hooks/fetchHooks", this.getHooksContract);
        }
      },
      immediate: true
    }
  }
};
</script>
