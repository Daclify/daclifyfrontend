<template>
  <q-page padding>
    <group-notification-manager  />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import groupNotificationManager from "components/group-notification-manager";
export default defineComponent({

  components: {
    groupNotificationManager
  },
  // name: 'PageName',
})
</script>
