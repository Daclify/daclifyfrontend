<template lang="pug">
  q-card(style="min-width:200px;" v-if="profile")
    .row(v-if="closeBtn")
      .absolute-top-right
        q-btn(icon="close" color="red" round flat size="xl" style="z-index:100;" @click="$emit('close')")
    .row
      q-img(:src="`https://picsum.photos/seed/${profile.cand}/600/200`" style="min-height:250px;")
    .row.justify-center.relative-position
      q-avatar(size="200px").absolute-center
        img(:src="'https://i.pravatar.cc/100/?u=' + profile.cand")
    .row.justify-center(style="padding-top:100px;")
      .col-auto
        h4.q-ma-md {{profile.cand}}
    .row
      q-tabs(v-model="currentTab" size="xl" active-bg-color="primary" active-color="white" align="justify" indicator-color="transparent").full-width
        q-tab(name="profile")
          h5.no-margin profile
        q-tab( name="reputation")
          h5.no-margin reputation: {{profile.rep}}
      q-separator
      q-tab-panels(v-model="currentTab" animated)
        q-tab-panel(name="profile" v-if="fakeProfile")
          .row
            .col
              h6.no-margin.text-center Information
              .small Full Name
              h5.no-margin {{fakeProfile.name.first}} {{fakeProfile.name.last}} 
              .small Location
              h5.no-margin {{fakeProfile.location.country}}
            .col
              h6.no-margin.text-center Contact
              .row
                .small Email
                h5.no-margin {{fakeProfile.email}}
              .small Telegram
              h5.no-margin @{{fakeProfile.login.username}}
          .row.justify-center
            .col-auto
              h5.q-mb-sm Introduction
            .q-ma-md
              h6.no-margin {{lorem}}
          //- div {{fakeProfile}}
    div( v-if="currentTab === 'reputation'")
      .row.justify-center.full-width.q-pa-md
        .col-auto
          h3.no-margin.text-center {{profile.rep}}
          q-circular-progress.q-ma-xs(:value="profile.rep" size="235px" :thickness=".5" :color="profile.repColor" track-color="grey" center-color="white")
      .row.q-pa-md
        h6.no-margin {{lorem}}


    

</template>

<script>
export default {
  data(){
    return {
      currentTab:'profile',
      fakeProfile:null,
      lorem:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
  },
  props:['profile','closeBtn'],
  watch:{
    profile:{
      immediate:true,
      async handler(val){
        if (!val) return
        this.fakeProfile = (await this.$axios.get('https://randomuser.me/api/?seed=' + this.profile.cand)).data.results[0]
      }
    }
  }
}
</script>