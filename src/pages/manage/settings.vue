<template>
  <q-page padding class="text-black constrain-page-width">
    <transition
      appear
      enter-active-class="animated fadeInDown"
      class="column q-gutter-md "
      tag="div"
    >
      <div class="row justify-between items-center text-h5 text-grey-5 text-weight-light q-mb-md">
        <div>Settings</div>
        <!-- <q-btn icon="add" round color="primary" @click="inviteGuardian" /> -->
      </div>
    </transition>

<div class="q-col-gutter-md row">

  <!-- <div class="col-xs-12 col-sm-6">
    <q-card class="full-height">
      <q-card-section>
        <div class="text-h6 text-weight-light text-grey-7">Color</div>
      </q-card-section>
      <q-card-section>
        <update-color />
      </q-card-section>
    </q-card>
  </div> -->

  <div class="col-xs-12 col-sm-6">
    <q-card class="full-height">
      <q-card-section>
        <div class="text-h6 text-weight-light text-grey-7">Logo</div>
      </q-card-section>
      <q-card-section>
        <update-logo />
      </q-card-section>
    </q-card>
  </div>



</div>

  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import updateLogo from 'components/actions/update-logo';

export default {
  name: 'groupSettings',
  components:{
    updateLogo


  },
  data () {
    return {
      linkscope: '',
 
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName",
      getActiveGroup: "group/getActiveGroup",
      getActiveGroupConfig: "group/getActiveGroupConfig",

    })
  },
}
</script>
