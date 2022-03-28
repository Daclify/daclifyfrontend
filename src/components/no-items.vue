<template>
  <q-item>
    <q-item-section>
      <q-item-label caption>
        {{ text }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "noItems",
  props: {
    text: {
      type: String,
      default: "No items",
    },
  },
  data() {
    return {};
  },
});
</script>
