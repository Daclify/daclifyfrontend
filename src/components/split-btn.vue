<template>
  <div>
    <q-btn
      v-if="!isSplit"
      @click="isSplit = !isSplit"
      label="start"
      color="secondary"
      size="lg"
      class="q-mt-xl"
    />
    <div v-if="isSplit" class="row justify-center q-mt-xl text-center">
      <div>
        <transition appear enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight"  mode="out-in" tag="div" >
        <q-btn
          to="browse"
          label="browse"
          color="secondary"
          size="lg"
          class="q-mr-md "
        />
        </transition>
        <transition appear enter-active-class="animated zoomIn" mode="out-in" tag="div" >
        <q-btn icon="close"  round color="secondary" text-color="primary" @click="isSplit = false">
          <q-tooltip content-class="bg-secondary" :delay="500">
            close
          </q-tooltip>
        </q-btn>
        </transition>
        <transition appear enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutLeft"  mode="out-in" tag="div" >
        <q-btn
          to="create"
          label="create"
          color="secondary"
          size="lg"
          class="q-ml-md"
        />
        </transition>
      </div>
      
    </div>
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  data() {
    return {
      isSplit: false
    };
  }
};
</script>
