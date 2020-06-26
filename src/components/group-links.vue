<template>
  <div>
    <!-- :label="link.label || `link ${i+1}`" -->
    <transition-group
      v-if="links.length"
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
      class="row text-caption text-weight-light justify-center items-center"
    >
      <q-btn
        class="q-mr-sm q-my-xs"
        size="sm"
        dense
        v-for="(link, i) in links"
        :key="link.url"
        :disabled="!isValidUrl(link.url)"
        :label="!link.icon && !link.label ? `link ${i + 1}` : link.label"
        :icon="link.icon || 'link'"
        color="primary"
        @click="openURL(link.url)"
      >
        <q-tooltip content-class="bg-secondary" :delay="500">{{
          link.url
        }}</q-tooltip>
      </q-btn>
    </transition-group>

    <div v-else>
      Group has no links
    </div>
  </div>
</template>

<script>
import { isValidUrl } from "../imports/validators.js";
import { openURL } from "quasar";
export default {
  // name: 'ComponentName',
  props: {
    links: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {};
  },
  methods: {
    isValidUrl,
    openURL
  }
};
</script>
<style></style>
