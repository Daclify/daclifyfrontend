<template>
  <div>
    <div class="">


          <div v-if="!!getChildByModuleName(this.module_name)">
            linked account {{getChildByModuleName(this.module_name).account_name}}
          </div>
          <!-- {{getChildByModuleName(this.module_name)}} -->
          <q-input
            v-else
            outlined
            placeholder="Account"
            bottom-slots
            v-model="action.data.account"
            maxlength="12"
            :debounce="500"
            :rules="[
              val => !!val || '* Required', 
              isValidAccountName,
              hasValidPermission
            ]"
            @input="is_child_account_validated = false"
          >
            <template v-slot:hint>
              <span class="text-grey-8 row" v-if="is_child_account_validated">
                <!-- <q-icon name="check"/> -->
                <span>This account can be linked!</span>
              </span>
              <span v-else>{{`Input account name to link ${action.data.module_name}.`}}</span>
            </template>
            <template v-slot:prepend>
              <q-icon name="mdi-square" />
            </template>
          </q-input>
    </div>
    <div class="row justify-end items-center q-mb-xs q-mt-md">
      <propose-bucket-btn @click-propose="emitPropose" @click-bucket="emitBucket" :label="`link ${action.data.module_name}`" :disabled="!is_child_account_validated"/>
    </div>
  
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { colors } from "quasar";
import proposeBucketBtn from "components/actions/propose-bucket-btn";
import { isValidAccountName, isExistingAccountName } from "../../imports/validators";
// destructuring to keep only what is needed
export default {
  name: 'updatecolor',
  components:{
    proposeBucketBtn
  },
  props:{
    parent:{
      default: '',
      type: String
    },
    module_name:{
      default: '',
      type: String
    },
    account:{
      default: '',
      type: String
    }
  },
  data() {
    return {
      is_child_account_validated: false,
      action:{
        account: this.$store.state.group.activeGroup,
        name: "addchildac",
        data: {
          account: '',
          parent: '',
          module_name: ''
        }
      }
    }

  },
  computed: {
    ...mapGetters({
      getActiveGroup: "group/getActiveGroup",
      getActiveGroupConfig: "group/getActiveGroupConfig",
      getAppConfig: "app/getAppConfig",
      getChildByModuleName: "group/getChildByModuleName",
      getChildAccounts: "group/getChildAccounts"
    }),

  },
  methods: {

    isValidAccountName,
    isExistingAccountName,

    emitPropose(){

      const payload = {
        actions: [this.action],
        description: `This proposal will link ${this.action.data.account} as a child to ${this.action.data.parent} with module name ${this.action.data.module_name}`,
        title: 'Link child account'     
      }
      this.$emit('propose', payload);
    },
    emitBucket(){
      this.$emit('addtobucket', this.action);     
    },
    async hasValidPermission(v){
      let res = await this.$eos.api.rpc.get_account(v).catch(e => false);
      if (res) {
        console.log(res.permissions)

        let owner = res.permissions.find(p => p.perm_name=="owner");
        console.log(owner)
        let permission = owner.required_auth.accounts.find(a => a.permission.actor == this.getActiveGroup);
        if(permission){
          this.is_child_account_validated = true;
          return true;
        }
        else{
          return `"${this.getActiveGroup}" is not in the owner permission of this account.`;
        }
        
      } else {
        return "Account does not exists.";
      }
    }

  },
  async mounted(){
    if(!this.getChildAccounts){
      await this.$store.dispatch("group/fetchChildAccounts", this.getActiveGroup);
    };
    if(this.account != ''){
      this.action.data.account = this.account;
    }
    if(this.parent != ''){
      this.action.data.parent = this.parent;
    }
    if(this.module_name != ''){
      this.action.data.module_name = this.module_name;
    }
  },
  watch: {
    getActiveGroupConfig: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          this.new_hexcolor = this.getActiveGroupConfig.ui.hexcolor.toUpperCase();
        }
      }
    }
  }
};
</script>
