<template>

  <div class="row  q-col-gutter-md q-pb-xs q-mt-sm">
    <!-- {{payroll}} -->
    <div class="col-xs-12 col-sm-6">
      <q-input
        ref="modulename"
        v-model="action.data.module_name" 
        label="Module name" 
        placeholder="name for the module"
        outlined 
        bottom-slots
        maxlength="12"
        :rules="[
          val => !!val || '* Required',
          isValidAccountName,
          validateDuplicateModule
        ]"
      >
        <!-- <template v-slot:prepend>
            xxx
        </template> -->

      </q-input>
    </div>

    
    <div class="col-xs-12 col-sm-6">
      <div class="row items-center justify-between no-wrap">
      <q-input
        style="min-width:200px"
        class="q-mr-xs"
        ref="actor"
        v-model="action.data.slave_permission.actor"
        label="Actor"
        outlined
        maxlength="12"
        :debounce="500"
        bottom-slots
        placeholder="name of the account"
        no-error-icon
        :rules="[
          val => !!val || '* Required',
          isValidAccountName,
          isExistingAccountName
        ]"
      >

      </q-input>

      <q-input
        style="width:100%"
        ref="permission"
        v-model="action.data.slave_permission.permission"
        label="Permission"
        outlined
        bottom-slots
        placeholder="permission to use"
        no-error-icon
        :rules="[
          val => !!val || '* Required',
          isValidAccountName
        ]"
      >
        <template v-slot:prepend>
            @
        </template>
      </q-input>
      </div>
    </div>

    <div class="col-xs-12 col-sm-6">
      <q-toggle v-model="action.data.has_contract" label="has contract">
        <q-tooltip content-class="bg-primary" :delay="500">
          Uncheck if the account doesn't have a contract installed.
        </q-tooltip>
      </q-toggle>
    </div>


<!-- {{recurrence_delay}} -->
    <div class="row justify-between full-width items-center" >
      <threshold-badge  label :contract="action.account" :action_name="action.name"/>
      <propose-bucket-btn @click-propose="emitPropose" @click-bucket="emitBucket" label="Link Module" :disabled="false" />
    </div>
    <!-- <pre>{{action}}</pre> -->
  </div>

</template>

<script>
import { mapGetters } from "vuex";
import thresholdBadge from "components/thresholds/threshold-badge";
import proposeBucketBtn from "components/actions/propose-bucket-btn";

import {
  isValidAccountName,
  isExistingAccountName
} from "../../imports/validators";
import {time_options} from "../../imports/time_options";

export default {
  name: "link-module",
  components:{
    thresholdBadge,
    proposeBucketBtn

  },
  props:{
    slave_permission:{actor:"", permission:""}
  },
  data() {
    return {
      action:{
        account: "",
        name: "linkmodule",
        data: {
          module_name:"",
          slave_permission: {actor:"", permission:""},
          has_contract: true
        }
      },

    }
  },
  computed: {
    ...mapGetters({
      getActiveGroup: 'group/getActiveGroup',
      getModuleByName: "group/getModuleByName",
      getModules: "group/getModules",
    })
  },
  methods: {
    isValidAccountName,
    isExistingAccountName,
    validateDuplicateModule(module_name){
      // console.log(module_name)
      let r = this.getModuleByName(module_name);
      if(r){
        return "Module with this name already linked"

      }
      else{
        return true;
      }
    },

    emitPropose(){
      this.$refs.modulename.validate();
      this.$refs.actor.validate();
      this.$refs.permission.validate();
      if(this.$refs.modulename.hasError || this.$refs.actor.hasError || this.$refs.permission.hasError){
        return;
      }
      let action = JSON.parse(JSON.stringify(this.action))

      let title = `Link Module`;
      let description = `Link new module "${action.data.module_name}" to the core contract`;

      const payload = {
        actions: [action],
        description: description,
        title: title     
      }
      this.$emit('propose', payload);
    },
    emitBucket(){
      this.$refs.modulename.validate();
      this.$refs.actor.validate();
      this.$refs.permission.validate();
      if(this.$refs.modulename.hasError || this.$refs.actor.hasError || this.$refs.permission.hasError){
        return;
      }
      let action = JSON.parse(JSON.stringify(this.action))
      this.$emit('addtobucket', action);     
    }
  },
  mounted(){
    this.action.account = this.getActiveGroup;
    if(this.slave_permission.actor && this.slave_permission.permission){
      this.action.data.slave_permission = this.slave_permission;
    }


  },
  watch: {

  }
};
</script>
