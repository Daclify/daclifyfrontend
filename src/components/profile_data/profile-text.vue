<template>
  <div>
    
    <q-markdown
      
      :src="profile_data.text"

            :noHtml="false"
            :noLinkify="false"
            :noLink="false"
            :noTypographer="false"
            :noBreaks="false"
            :noHighlight="false"
            :noEmoji="false"
            :noSubscript="false"
            :noSuperscript="false"
            :noFootnote="false"
            :noDeflist="false"
            :noAbbreviation="false"
            :noInsert="false"
            :noMark="false"
            :noImage="false"
            :noTasklist="false"
            :noContainer="false"
            :noBlockquote="false"
            :toc="false"
            :tocStart="1"
            :tocEnd="2"
            :taskListsEnable="false"
            :taskListsLabel="false"
            :taskListsLabelAfter="false"
      
    >
    </q-markdown>


    
  </div>
</template>

<script>
export default {
  name: 'profileText',
  props:{
    account:{
      type: String,
      default:""
    },
    profile_data: {
      type: Object,
      default:()=>{return {} }
    }
  },
  data () {
    return {
    };
  },

}
</script>
<style>
.q-markdown--link{
  color: var(--q-color-primary);
}
</style>