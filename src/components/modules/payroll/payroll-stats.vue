<template>
  <div v-if="payroll">
    <div class="row q-gutter-md">
      <div class="col-xs-12 col-sm-4 col-md-2">

          <q-item class="no-padding">
            <q-item-section avatar>
              <q-avatar size="36px">
                <q-img
                  :src="
                    getLogoForToken(
                      payroll.total_paid.contract,
                      payroll.total_paid.quantity.split(' ')[1]
                    )
                  "
                />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{
                payroll.total_paid.quantity.split(" ")[1]
              }}</q-item-label>
              <q-item-label caption>{{
                payroll.total_paid.contract
              }}</q-item-label>
            </q-item-section>
          </q-item>

      </div>

      <div class="col-xs-12 col-sm-4 col-md-2">

          <q-item class="no-padding">
            <q-item-section avatar>
              <q-avatar size="36px">
                <q-img
                  :src="
                    getLogoForToken(
                      payroll.total_paid.contract,
                      payroll.total_paid.quantity.split(' ')[1]
                    )
                  "
                />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{
                payroll.total_paid.quantity.split(" ")[1]
              }}</q-item-label>
              <q-item-label caption>{{
                payroll.total_paid.contract
              }}</q-item-label>
            </q-item-section>
          </q-item>

      </div>

      <!-- <div class="col-xs-12">
            <q-card>
              <q-card-section>
              {{ payroll.description || "No description" }}
              </q-card-section>
            </q-card>
          </div> -->
      <!-- <q-item class="no-padding" >
            <q-item-section avatar>
              <q-avatar size="36px">
                <q-img :src="getLogoForToken(payroll.total_paid.contract, payroll.total_paid.quantity.split(' ')[1])" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{payroll.total_paid.quantity.split(' ')[1]}}</q-item-label>
              <q-item-label caption>{{payroll.total_paid.contract}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="no-padding">

            <q-item-section>
              <q-item-label>Pay Account</q-item-label>
              <q-item-label caption>{{`${payroll.pay_permission.actor}@${payroll.pay_permission.permission}`}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item class="no-padding">

            <q-item-section>
              <q-item-label>Total Paid</q-item-label>
              <q-item-label caption>{{payroll.total_paid.quantity}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item class="no-padding">

            <q-item-section>
              <q-item-label>Total Allocated</q-item-label>
              <q-item-label caption>{{payroll.total_allocated}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item class="no-padding">

            <q-item-section>
              <q-item-label>Balance</q-item-label>
              <q-item-label caption>todo</q-item-label>
            </q-item-section>
          </q-item> -->
    </div>
  </div>
</template>

<script>
import { getLogoForToken } from "../../../imports/tokens.js";
export default {
  name: "payrollStats",
  props: {
    payroll: false
  },
  data() {
    return {};
  },
  methods:{
    getLogoForToken
  }
};
</script>
