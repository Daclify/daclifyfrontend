<template>
  <div>
    <transition-group
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
      mode="in-out"
      class="row q-gutter-xs items-center"
      tag="div"
    >

      <!--  -->
      <q-badge v-for="(auth, i) in action.authorization" :key="auth.actor+auth.permission">
        {{`${auth.actor}@${auth.permission}`}}
        <q-btn v-if="edit" @click="remove(i)" icon="mdi-close" size="xs" round dense color="secondary"  class="no-shadow q-ml-xs"/>
      </q-badge>
      <q-badge v-if="action.authorization.length==0" color="warning" key="warning">
        <q-icon name="mdi-alert" />warning, no authorization set
      </q-badge>

    </transition-group>
    <div v-if="edit">
      <div class="q-mt-md row items-center justify-between no-wrap">
        <q-input
          dense
          style="min-width:200px"
          class="q-mr-xs"
          ref="actor"
          v-model="new_actor"
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
          dense
          style="width:100%"
          ref="permission"
          v-model="new_permission"
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
          <template v-slot:after>
            <q-btn icon="mdi-plus" @click="add" dense round color="primary"/>
          </template>
        </q-input>
        </div>
    </div>
  </div>
</template>

<script>
import {
  isValidAccountName,
  isExistingAccountName
} from "../../imports/validators";
export default {
  name: 'authorizationDisplay',
  props:{
    action:{
      type: Object,
      default: ()=>{return {}}
    },
    edit:{
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      new_actor: "",
      new_permission: ""
    }
  },
  methods:{
    isValidAccountName,
    isExistingAccountName,
    add(){
      this.$refs.actor.validate();
      this.$refs.permission.validate();
      if(this.$refs.actor.hasError || this.$refs.permission.hasError){
        return;
      }

      this.action.authorization.push({actor:this.new_actor, permission: this.new_permission});
      this.new_actor ="";
      this.new_permission ="";

    },
    remove(i){
      this.action.authorization.splice(i,1);
    }
  }
}
</script>
