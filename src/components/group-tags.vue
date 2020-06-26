<template>
  <div
    v-if="tags.length"
    class="row text-caption text-weight-light q-px-xs  items-center"
  >
    <q-icon name="mdi-tag" /> Tags:
    <div
      v-for="tag in tags"
      :key="tag"
      class="rounded-borders q-ml-xs q-px-xs"
      :class="contentClass" style="background: rgba(0,0,0,0.1);"
    >
      {{ tag }}
    </div>
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  props:{
    tags:{
      default: () =>[],
      type: Array
    },
    contentClass:{
      type: String,
      default: "bg-transparent-black"
    }
  },
  data() {
    return {};
  }
};
</script>
<style>
  .bg-transparent-black{
    background: rgba(0,0,0,0.1);
  }
</style>
