<template>
  <div >
    <div class="text-grey-7 text-h6 q-mb-md">
      <span>{{ fields.contract }}</span>
      <span class="text-primary q-mx-xs">></span>
      <span>{{ fields.name }}</span>
    </div>
    <div class="row q-col-gutter-md" style="min-height:50px">
      <div
        v-for="field in action_fields.fields"
        :key="field.name"
        class="col-xs-12 col-sm-6 col-md-4"
      >
        <div v-if="field.type == 'bool'">
          <q-select
            v-model="field.value"
            bottom-slots
            :label="field.name"
            outlined
            color="primary"
            emit-value
            :options="[
              { value: true, label: 'true' },
              { value: false, label: 'false' }
            ]"
          />
        </div>
        <div v-else-if="isNumberType(field.type)">
          <q-input
            type="number"
            outlined
            color="primary"
            :label="field.name"
            v-model="field.value"
            :placeholder="`${field.type}`"
            bottom-slots
            :rules="[...getValidationRulesForType(field.type)]"
          />
        </div>
        <div v-else>
          <q-input
            outlined
            color="primary"
            :label="field.name"
            v-model="field.value"
            :placeholder="`${field.type}`"
            bottom-slots
            :rules="[...getValidationRulesForType(field.type)]"
          />
        </div>
      </div>
    </div>
    <div class="row justify-between full-width items-center q-pb-xs">
      <threshold-badge  label :contract="fields.contract" :action_name="fields.name"/>
      <q-btn
        icon="mdi-plus"
        :disabled="addToBucketAllowed"
        label="add to bucket"
        color="primary"
        @click="addToBucket"
      />
    </div>
    <!-- {{action_fields}} -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import thresholdBadge from "components/thresholds/threshold-badge";
import {
  isValidAccountName
} from "../../imports/validators";

const numberTypes = [
  "uint8",
  "int8",
  "uint16",
  "int16",
  "uint32",
  "uint64",
  "int64",
  "int32",
  "varuint32",
  "varint32",
  "uint128",
  "int128",
  "float32",
  "float64",
  "float128"
];
export default {
  name: "actionFields",
  components: {
    thresholdBadge
  },
  props: {
    fields: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      action_fields: ""
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getLinkedThresholdForContractAction:"group/getLinkedThresholdForContractAction",
      getModules: "group/getModules"
    }),
    addToBucketAllowed() {
      let disabled = false;
      // if (!this.action_fields.fields) return disabled;
      // for (let i = 0; i < this.action_fields.fields.length; i++) {
      //   if (this.action_fields.fields[i].value !== "") {
      //     disabled = false;
      //   } else {
      //     disabled = true;
      //     break;
      //   }
      // }
      return disabled;
    }
  },
  methods: {
    async addToBucket() {
      let action = {
        account: this.fields.contract,
        name: this.fields.name,
        authorization: [{ actor: this.getActiveGroup, permission: "owner" }],
        data: {}
      };
      let is_action_from_module = false;
      if(this.getModules && this.getModules.length){
        is_action_from_module = this.getModules.find(m=> m.slave_permission.actor ==  this.fields.contract);
      }

      if(is_action_from_module){
        action.authorization = [is_action_from_module.slave_permission];
      }

      this.action_fields.fields.forEach(af => {
        let parsed_value = String(af.value).trim();

        if (
          (parsed_value.includes("[") && parsed_value.includes("]")) ||
          (parsed_value.includes("{") && parsed_value.includes("}"))
        ) {
          parsed_value = JSON.parse(parsed_value);
        } else if (af.type == "bool") {
          parsed_value = parsed_value === "true";
        } else if (this.isNumberType(af.type)) {
          parsed_value = Number(parsed_value);
        }
        action.data[af.name] = parsed_value;
      });

      this.$store.dispatch("bucket/addToBucket", action);
    },
    isNumberType(type) {
      return numberTypes.includes(type);
    },
    getValidationRulesForType(type) {
      let rules = [];
      switch (type) {
        case 'name':
          rules.push(isValidAccountName);
          break;
      
        default:
          break;
      }
      return rules
    }
  },

  mounted() {
    this.action_fields = JSON.parse(JSON.stringify(this.fields));
  }
};
</script>
