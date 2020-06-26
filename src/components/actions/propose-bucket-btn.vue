<template>
<div>
    <q-btn-dropdown
      color="primary"
      :label="label"
      split
      v-model="dropdown_open"
      :disable="disabled"
      @click="dropdown_open=true"
    >
      <q-list class="primary-hover-list">
        <q-item clickable v-close-popup @click="$emit('click-propose')">
          <q-item-section avatar>
            <q-icon name="mdi-file-key" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Propose</q-item-label>
            <!-- <q-item-label caption>February 22, 2016</q-item-label> -->
          </q-item-section>
          <!-- <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section> -->
        </q-item>

        <q-item clickable v-close-popup @click="$emit('click-bucket')">
          <q-item-section avatar>
            <q-icon name="mdi-plus" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Add To Bucket</q-item-label>
            <!-- <q-item-label caption>February 22, 2016</q-item-label> -->
          </q-item-section>
          <!-- <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section> -->
        </q-item>
      </q-list>
    </q-btn-dropdown>
</div>

</template>

<script>
export default {
  name: 'proposeBucketBtn',
  props:{
    label:{
      type: String,
      default: 'propose'
    },
    disabled:{
      type: Boolean,
      default:true
    }
  },
  data () {
    return {
      dropdown_open: false
    }
  }
}
</script>
