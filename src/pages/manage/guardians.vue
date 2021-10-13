<template>
  <q-page padding class="text-black constrain-page-width">
    <!-- content -->
    <page-header title="Guardians"/>


    <div>
      <q-input placeholder="Search" outlined v-model.trim="filter" >
        <!-- <template v-slot:hint>
          <span class="text-grey-8 row" v-if="!getFilteredGuardians.length" >No Result</span>
        </template> -->
        <template v-slot:prepend>
          <q-icon name="search" class="cursor-pointer" />
        </template>
        <template v-slot:append>
          <transition-group
            appear
            enter-active-class="animated fadeInRight"
            leave-active-class="animated fadeOutRight"
            tag="div"
          >
            <q-icon
              v-if="filter.length"
              name="close"
              key="has_filter"
              @click="filter = ''"
              class="cursor-pointer"
            />
            <q-icon
              v-else
              :name="menu_visible ? 'menu_open' : 'menu'"
              class="cursor-pointer"
              key="no_filter"
            >
              <q-menu
                fit
                @before-show="menu_visible = true"
                @hide="menu_visible = false"
              >
                <q-list style="min-width: 100px" class="primary-hover-list">
                  <q-item
                    clickable
                    @click="new_cust_dialog = true"
                    v-close-popup
                  >
                    <q-item-section avatar>
                      <q-icon name="mdi-account-plus" />
                    </q-item-section>
                    <q-item-section>Invite Guardian</q-item-section>
                  </q-item>
                  <q-item clickable @click="rem_cust_dialog = true" v-close-popup>
                    <q-item-section avatar>
                      <q-icon name="mdi-account-minus" />
                    </q-item-section>
                    <q-item-section>Remove Guardian</q-item-section>
                  </q-item>
                  <q-item  clickable @click="$store.commit('user/setMinifyGuardians', !getMinifyGuardians )" v-close-popup>
                    <q-item-section avatar>
                      <q-icon v-if="getMinifyGuardians" name="mdi-arrow-expand-all" />
                      <q-icon v-else name="mdi-arrow-collapse-all" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>
                        <span v-if="getMinifyGuardians">Expand</span>
                        <span v-else>Minify</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </transition-group>
        </template>
      </q-input>
      <div class="q-mb-md">
        <q-tabs
          v-model="tabfilter"
          dense
          class=" text-primary"
          align="left"
          no-caps
          inline-label
        >
          <q-tab label="All" name="all" />
        </q-tabs>
        <q-separator />
      </div>

      <transition
        appear
        enter-active-class="animated fadeInDown"
        class="column q-gutter-md "
        tag="div"
      >
        <span
          class="row items-center text-grey-7"
          v-if="!getFilteredGuardians.length"
        >
          <q-icon name="error_outline" size="24px" class="q-mr-sm" />
          No Guardians found...
        </span>
      </transition>
    </div>

    <transition-group
      appear
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
      class="row q-col-gutter-md"
      tag="div"
    >
      <guardian-card
        v-for="guardian in getFilteredGuardians"
        :guardian="guardian"
        :key="guardian.account"
        class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4 "
        :minify="getMinifyGuardians"
      />
    </transition-group>

    <!-- <pre>{{getGuardians}}</pre> -->


    <q-dialog v-model="new_cust_dialog">
      <q-card style="width:100%;max-width:350px">
        <q-card-section class="row justify-between items-center">
          <div class="text-grey-5 text-weight-light text-h5">Invite Guardian</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-input
            outlined
            placeholder="Account"
            bottom-slots
            v-model="new_cust_name"
            maxlength="12"
            :debounce="700"
            :rules="[
              val => !!val || '* Required', 
              isValidAccountName,
              isExistingAccountNameWrapper
            ]"
            @input="account_name_validated = false"
          >
            <template v-slot:hint>
              <span class="text-grey-8 row" v-if="account_name_validated">
                <!-- <q-icon name="check"/> -->
                <span>Account name found!</span>
              </span>
              <span v-else>Input account name</span>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="row justify-end">
          <q-btn
            :disabled="!account_name_validated"
            label="propose"
            color="primary"
            @click="inviteGuardian"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="rem_cust_dialog">
      <q-card style="width:100%;max-width:350px">
        <q-card-section class="row justify-between items-center">
          <div class="text-grey-5 text-weight-light text-h5">Remove Guardian</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-input
            outlined
            placeholder="Account"
            bottom-slots
            v-model="rem_cust_name"
            maxlength="12"
            :debounce="700"
            :rules="[
              val => !!val || '* Required', 
              isValidAccountName,
              isGuardian
            ]"
            @input="rem_cust_validated = false"
          >
            <template v-slot:hint>
              <span class="text-grey-8 row" v-if="rem_cust_validated">
                <!-- <q-icon name="check"/> -->
                <span>Account is guardian!</span>
              </span>
              <span v-else>Input account name</span>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="row justify-end">
          <q-btn
            :disabled="!rem_cust_validated"
            label="propose"
            color="primary"
            @click="removeGuardian"
          />
        </q-card-section>
      </q-card>
    </q-dialog>



  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import pageHeader from "components/page-header";
import guardianCard from "components/guardian-card";

import { isValidAccountName, isExistingAccountName } from "../../imports/validators";

export default {
  // name: 'LayoutName',
  components: {
    pageHeader,
    guardianCard
  },
  data() {
    return {
      filter: "",
      tabfilter: "all",
      menu_visible: false,

      new_cust_dialog: false,
      new_cust_name: "",
      account_name_validated: false,

      rem_cust_dialog: false,
      rem_cust_name: "",
      rem_cust_validated: false
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getGuardians: "group/getGuardians",
      getIsGuardian: "group/getIsGuardian",
      getActiveGroup: "group/getActiveGroup",
      getMinifyGuardians: "user/getMinifyGuardians"
    }),
    getFilteredGuardians() {
      if (this.filter != "") {
        this.filter = this.filter.toLowerCase();
        return this.getGuardians.filter(c => c.account.includes(this.filter));
      } else {
        return this.getGuardians;
      }
    }
  },
  methods: {
    isValidAccountName,
    isExistingAccountName,
    async inviteGuardian() {
      let action = {
        account: this.getActiveGroup,
        name: "invitecust",
        data: {
          account: this.new_cust_name
        }
      };

      const title = `Invite new guardian`;
      const description = `This proposal is to invite a new guardian ${action.data.account}`;

      let res = await this.$store.dispatch("group/propose", {
        actions: [action],
        description: description,
        title: title
      });
      this.new_cust_name ='';
      this.new_cust_dialog= false;
    },
    async removeGuardian(){
      let action = {
        account: this.getActiveGroup,
        name: "removecust",
        data: {
          account: this.rem_cust_name
        }
      };

      const title = `Remove guardian`;
      const description = `This proposal is to remove guardian ${action.data.account}`;

      await this.$store.dispatch("group/propose", {
        actions: [action],
        description: description,
        title: title
      });
      this.rem_cust_name ='';
      this.rem_cust_dialog= false;
    },
    async isExistingAccountNameWrapper(v){
      if(this.getIsGuardian(v)){
        return 'Already guardian.';
      }
      else{
        let t = await isExistingAccountName(v);
        if(t === true){
          this.account_name_validated = true;
        }
        return t;
      }

    },
    isGuardian(v){
      if(this.getIsGuardian(v)){
        this.rem_cust_validated = true;
        return true;
      }
      else{
        return "Account is not a guardian.";
      }
    }
  }
};
</script>
