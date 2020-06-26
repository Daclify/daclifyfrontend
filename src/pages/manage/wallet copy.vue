<template>
  <q-page padding>
    <page-header title="group wallet"/>


    <div v-if="getGroupWallet.length">
      <q-card style="max-width:500px" >

        <q-item clickable @click.native="toggleTokenSelector" id="tokendisplay" >
          <q-item-section avatar>
            <q-img
            contain
              :src="getGroupWallet[selected_token_index].logo"
              spinner-color="white"
              style="height: 60px; width: 60px"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-light text-h6">
              <span>{{ getGroupWallet[selected_token_index].amount }}</span>
              <span class="text-weight-bold">
                {{ getGroupWallet[selected_token_index].symbol }}</span
              >
            </q-item-label>
            <q-item-label caption>Group Balance</q-item-label>
          </q-item-section>
          <q-item-section> </q-item-section>
        </q-item>

        <div >
          <q-select
            hide-dropdown-icon
            ref="token_selector"
            v-model="selected_token_index"
            :options="tokenoptions"
            filter
            hide-selected
            emit-value
            use-input
            @filter="filterFn"
            placeholder="Find token"
            input-class="q-pa-md"
            for="tokendisplay"
            @popup-show="token_selector_popup=true"
            @popup-hide="token_selector_popup=false"
            autocomplete="off"
          >
          <template v-slot:prepend>
            <q-icon name="search" class="q-ml-md"/>
          </template>
          <template v-slot:selected>
            {{ getGroupWallet[selected_token_index].symbol }}
          </template>

            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section avatar>
                  <q-icon :name="scope.opt.icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label v-html="scope.opt.label" />
                  <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-italic text-grey">
                  No Tokens
                </q-item-section>
              </q-item>
            </template>
          </q-select>
      </div>


        <q-carousel
          v-model="view"
          transition-prev="scale"
          transition-next="scale"
          animated
          control-color="red"
          class="no-padding"
          style="height:365px"
        >
          <q-carousel-slide name="transfer" class="">
            <!-- <pre>{{ transfer_action }}</pre> -->
            
            <div class="column q-gutter-md">
              <q-input
                outlined
                v-model="transfer_action.data.to"
                placeholder="Receiver"
              />
              <q-input
                type="number"
                outlined
                v-model="transfer_action.data.quantity"
                placeholder="Amount"
              >
                <template v-slot:append>
                  <div>{{ getGroupWallet[selected_token_index].symbol }}</div>
                </template>
              </q-input>
              <q-input
                v-model="transfer_action.data.memo"
                outlined
                type="textarea"
                placeholder="Memo"
              />
              <div class="row justify-end">
              <propose-bucket-btn @click-propose="proposeTransfer" @click-bucket="" label="transfer" :disabled="false"/>
              </div>
            </div>
          </q-carousel-slide>

          <q-carousel-slide name="meta" class="">
            <div class="column q-gutter-md">
              <div>{{`Transfer ${transfer_action.data.quantity} from ${transfer_action.data.from} to ${transfer_action.data.to}`}}</div>
              <q-input
                v-model="title"
                outlined
                type="text"
                placeholder="Title"
              />
              <q-input
                v-model="description"
                outlined
                type="textarea"
                placeholder="Description"
              />
            </div>
          </q-carousel-slide>

          <q-carousel-slide name="error" class="column no-wrap justify-between">
          </q-carousel-slide>
        </q-carousel>
      </q-card>
    </div>
    <!-- {{ getGroupWallet }} -->
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import proposeBucketBtn from "components/actions/propose-bucket-btn";
import pageHeader from "components/page-header";
export default {
  name: "groupWallet",
  components: {
    proposeBucketBtn,
    pageHeader
  },
  data() {
    return {
      token_selector_popup: false,
      tokenoptions: [],
      needle: "",
      selected_token_index: 0,
      view: "transfer",
      transfer_action: {
        account: "",
        name: "transfer",
        data: {
          from: this.$store.state.group.activeGroup,
          to: "",
          quantity: "",
          memo: ""
        }
      },
      description: "",
      title: ""
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getGroupWallet: "group/getGroupWallet",
      getActiveGroup: "group/getActiveGroup",
      getThresholdLinks: "group/getThresholdLinks"
    }),
    getTokenSelectOptions() {
      if (this.getGroupWallet.length) {
        let options = this.getGroupWallet.map((t, i) => {
          // console.log(t, i);
          let option = {
            label: t.symbol,
            value: i,
            description: t.quantity,
            icon: `img:${t.logo}`
          };
          return option;
        });

        return options;
      }
    }
  },
  methods: {
    toggleTokenSelector(){
      if(!this.token_selector_popup){
        this.$refs.token_selector.showPopup();
      }
    },
    proposeTransfer() {
      let action = JSON.parse(JSON.stringify(this.transfer_action));
      let token = this.getGroupWallet[this.selected_token_index];
      action.account = token.contract;
      action.data.from = this.getActiveGroup;
      action.data.quantity =
        Number(action.data.quantity).toFixed(token.precision) +
        " " +
        token.symbol;

      const title = `Transfer ${action.data.quantity}`;
      const description = `this is a description`;

      this.$store.dispatch("group/propose", {
        actions: [action],
        description: description,
        title: title
      });
    },
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.tokenoptions = this.getTokenSelectOptions;
        });
        return;
      }
      // console.log(val);
      update(() => {
        this.tokenoptions = this.getTokenSelectOptions.filter(v =>
          v.label.includes(val.toUpperCase())
        );
      });
    }
  },

  watch: {}
};
</script>
