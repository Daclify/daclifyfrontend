<template>
<div>
      <q-card>
        <q-item>
          <q-item-section avatar>
          <q-img
            contain
            :src="token.logo"
            spinner-color="white"
            style="height: 60px; width: 60px"
          />
          </q-item-section>
          <q-item-section>
            {{token.quantity}}
          </q-item-section>
          <q-item-section side>
            <q-btn label="withdraw" @click="withdraw_dialog=true" color="primary" :disabled="!getCoreConfig.conf.withdrawals" />
          </q-item-section>
        </q-item>
        <!-- {{token}} -->
      </q-card>


    <q-dialog v-model="withdraw_dialog">
      <q-card class="overflow-hidden" style="min-width:350px">
        <q-card-section v-if="!getIsTransacting">
            <page-header :title="`Withdraw ${token.symbol}`"/>
            <q-btn icon="close" flat round dense v-close-popup class="q-ma-md absolute-top-right"/>
            <div class="q-mt-md">
              <q-input
                type="number"
                v-model="withdraw_quantity"
                label="quantity"
                outlined
                bottom-slots
                :placeholder="`${token.symbol} amount`"
                no-error-icon
                :rules="[
                  val => !!val || '* Required',
                  val => val > 0 || 'Must be greater then zero',
                  validateWithdrawAmount
                  ]"
              >
                <template v-slot:append>
                  {{token.symbol}}
                </template>
              </q-input>
              <q-btn color="primary" class="q-mt-md full-width" label="withdraw" :disabled="!withdraw_quantity_validated" @click="withdraw"/>
            </div>
        </q-card-section>
        <q-card-section v-else class="column justify-center items-center q-pb-md">
          <q-spinner color="primary" size="60px"/>
          <div>Waiting for signature</div>
        </q-card-section>
      </q-card>
    </q-dialog>


</div>
</template>

<script>
import { mapGetters } from "vuex";
import pageHeader from "components/page-header";
export default {
  name: 'userBalanceCard',
  components:{
    pageHeader
  },
  props:{
    token:{
      default: ()=>{return {};},
      type: Object
    }
  },
  data () {
    return {
      withdraw_dialog: false,
      withdraw_quantity: '',
      withdraw_quantity_validated: false
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getIsMember: "user/getIsMember",
      getCoreConfig: "group/getCoreConfig",
      getIsTransacting: "ual/getIsTransacting"
    })
  },
  methods:{
    async withdraw(){
      let action = {
        account: this.getActiveGroup,
        name: "widthdraw", //spelling
        data:{
          account: this.getAccountName,
          amount: {contract: this.token.contract, quantity: Number(this.withdraw_quantity).toFixed(this.token.precision)+" "+this.token.symbol}
        }
      }

      let res = await this.$store.dispatch("ual/transact", { actions: [action], disable_signing_overlay: true });
      if(res && res.trxid){
        this.withdraw_dialog =false;
        setTimeout(()=>{
          this.$emit("updatebalance");
        }, 1000)
        
      }
      else{
        return false;
      }

    },
    validateWithdrawAmount(v){
        if(Number(v) > Number(this.token.amount) ){
          this.withdraw_quantity_validated = false;
          return `You only have ${this.token.quantity}`;
        }
        else{
          this.withdraw_quantity_validated = true;
          return true;
        }
    }
  }
}
</script>
