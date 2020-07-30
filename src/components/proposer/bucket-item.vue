<template>
  <q-expansion-item 
    group="bucketitem"
    clickable
    class="cursor-default"
    style="border-bottom:1px solid grey"
  >
    <template v-slot:header>
      <q-item-section side>
        <q-badge>
          <div class="q-pa-xs drag_handle">{{ i + 1 }}</div>
        </q-badge>
      </q-item-section>
      <q-item-section>
        <q-item-label> {{ action.account }} > {{ action.name }} </q-item-label>
      </q-item-section>
      <q-item-section side>
        <div class="row items-center">
          <!-- <authorization-display
            :action="action"
            class="text-caption text-grey-5"
          /> -->
          <threshold-badge
            :contract="action.account"
            :action_name="action.name"
            class="q-mr-sm"
          />
          <q-btn
            icon="remove"
            unelevated
            dense
            size="sm"
            color="negative"
            @click="$store.commit('bucket/removeFromActionBucketByIndex', i)"
          >
            <q-tooltip :delay="400" content-class="bg-secondary"
              >Delete</q-tooltip
            >
          </q-btn>
        </div>
      </q-item-section>
    </template>
    <q-separator />
    <q-card>
      <q-card-section>
        <q-item>
          <q-item-section>
            <q-item-label >Action data</q-item-label>
            <q-item-label caption>{{ action.data }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label >Autorization</q-item-label>
            <q-item-label caption>
              <authorization-display
                :action="action"
                :edit="true"
              />
            </q-item-label>
          </q-item-section>
        </q-item>
        
      </q-card-section>
    </q-card>
  </q-expansion-item>

</template>

<script>
import authorizationDisplay from "components/proposer/authorization-display";
import thresholdBadge from "components/thresholds/threshold-badge";
export default {
  name: "bucketItem",
  components: {
    authorizationDisplay,
    thresholdBadge
  },
  props: {
    action: {},
    i: 0
  },
  data() {
    return {};
  }
};
</script>
