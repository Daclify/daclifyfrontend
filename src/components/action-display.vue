<template>
  <div>
    <q-card class="shadow-1 overflow-hidden">
      <q-list class="primary-hover-list overflow-hidden">
        <q-item clickable>
          <q-item-section avatar>
            <q-icon
              :name="getIconForAction(deserialized_action.name).name"
              
              :class="getIconForAction(deserialized_action.name).class ? getIconForAction(deserialized_action.name).class: ''"
            />
          </q-item-section>

          <q-item-section style="margin-left:-15px" >
            <q-item-label>
              {{deserialized_action.account}}<span class="text-primary q-mx-xs"><b>></b> </span>{{deserialized_action.name}}
              <q-badge v-for="(auth) in action.authorization" :key="auth.actor+auth.permission" class="q-ml-xs">
                {{`${auth.actor}@${auth.permission}`}}
              </q-badge>
            </q-item-label>
            <q-item-label v-if="!is_deserializing" caption>
              <div >{{deserialized_action.data}}</div>
            </q-item-label>
            <q-item-label v-else caption>
              <q-spinner color="primary" />
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="search" color="primary" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { action_icon_map } from "../imports/action_icon_map";
export default {
  name: "actionDisplay",
  props: {
    action: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      deserialized_action: false,
      authorization:"",
      is_deserializing: false
    };
  },
  computed: {
    ...mapGetters({
      getIsGuardian: "group/getIsGuardian"
    })
  },
  methods: {
    getIconForAction(action_name) {
      return action_icon_map.get(action_name);
    },
    async deserializeAction() {
      if (typeof this.action.data == "string") {
        this.is_deserializing = true;
        const contract = await this.$eos.api.getContract(this.action.account);
        let r = await this.$eos.Serialize.deserializeAction(
          contract,
          this.action.account,
          this.action.name,
          this.action.authorization,
          this.action.data
        );
        this.is_deserializing = false;
        return r;
      } else {
        return this.action.data;
      }
    }

  },
  watch: {
    action: {
      handler: async function(newVal, oldVal) {
        if (newVal && newVal != oldVal) {
          if (typeof this.action.data == "string") {
            this.deserialized_action = await this.deserializeAction();
          }
        }
      },
      immediate: true
    }
  }
};
</script>
