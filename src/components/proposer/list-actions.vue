<template>
  <div>
    <div v-if="!is_loading">
      <q-input
        v-if="abi_actions.length"
        placeholder="Search"
        outlined
        v-model.trim="filter"
        class="q-mb-md"
      >
        <template v-slot:prepend>
          <q-icon name="search" class="cursor-pointer" />
        </template>
        <template v-slot:append>
          <transition
            appear
            enter-active-class="animated zoomIn"
            leave-active-class="animated zoomOut"
            tag="div"
          >
            <q-icon
              v-if="filter.length"
              name="close"
              key="has_filter"
              @click="filter = ''"
              class="cursor-pointer"
            />
          </transition>
        </template>
      </q-input>

      <transition-group
        appear
        enter-active-class="animated zoomIn"
        leave-active-class="animated zoomOut"
        mode="in-out"
        class="row q-col-gutter-xs"
        tag="div"
      >
        <div
          v-for="action in getActionListWithFilter"
          :key="action.name"
          style="width:157px"
        >
          <q-item
            clickable
            @click="handleActionClick(action)"
            dense
            class="bg-primary cursor-pointer rounded-borders"
          >
            <q-item-section avatar>
              <!-- <q-img :src="action.icon" style="width:16px" /> -->
              <q-icon name="check" color="white" />
            </q-item-section>
            <q-item-section style="margin-left:-22px" class=" text-center">
              <q-item-label
                class="text-white text-uppercase"
                style="font-size:12px"
                >{{ action.name }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </div>
      </transition-group>
    </div>
    <div v-else class="row justify-center items-center" style="height:100px">
      <q-spinner color="primary" size="48px" />
    </div>
  </div>
</template>

<script>
export default {
  name: "listActions",
  props: {
    contract: {
      type: String,
      default: ""
    },
    action_name: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      abi: "",
      abi_actions: [],
      selected_action: "",
      filter: "",
      is_loading: false
    };
  },
  computed: {
    getActionListWithFilter() {
      if (this.filter) {
        this.filter = this.filter.toLowerCase();
        return this.abi_actions.filter(aa => aa.name.includes(this.filter));
      } else {
        return this.abi_actions;
      }
    }
  },
  methods: {
    async getActionsFromAbi(contract) {
      if (!contract) return;
      this.is_loading = true;
      (this.abi = ""), (this.abi_actions = []);
      let abi = await this.$eos.api.rpc.get_abi(contract);
      console.log(abi);
      if (abi && abi.account_name == contract && abi.abi) {
        this.abi = abi;
        this.abi_actions = abi.abi.actions.map(aa => {
          let r = {};
          r.name = aa.name;
          r.type = aa.type;
          r.icon =
            "http://raw.githubusercontent.com/EOS-Jungle-Testnet/icons/master/admin.png#9bf1cec664863bd6aaac0f814b235f8799fb02c850e9aa5da34e8a004bd6518e";
          return r;
        });
      } else {
        return [];
      }
      this.is_loading = false;
    },

    getStructForAction(action) {
      let struct = this.abi.abi.structs.find(
        st => st.name == action.name || st.name == action.type
      );
      if (struct) {
        return struct;
      } else {
        alert(`struct not found for ${action.name}`);
      }
    },
    handleActionClick(action) {
      this.$emit("action-select", this.getStructForAction(action));
    }
  },

  watch: {
    contract: {
      handler: function(newVal) {
        if (newVal) {
          this.getActionsFromAbi(newVal);
        }
      },
      immediate: true
    },
    action_name: {
      handler: async function(newVal, oldVal) {
        if (newVal && newVal != oldVal) {
          this.filter = newVal;
        }
      },
      immediate: true
    },
    abi_actions:{
      immediate:false,
      handler: function(newV,oldV){
        if(newV!=oldV && newV.length){
          let uri = window.location.search.substring(1); 
          let params = new URLSearchParams(uri);
          let a = params.get("action");
          if(a){
            let action = this.abi_actions.find(aa => aa.name == a);
            if(action){
              this.handleActionClick(action);
            }
          }
        }
      }
    }
  }
};
</script>
