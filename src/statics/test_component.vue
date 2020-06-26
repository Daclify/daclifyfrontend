<template>
  <div id="app">
    {{ message }}
    {{test}}
  </div>
</template>

<script>

module.exports = {
props:{
    test: {
        type: String,
        default: 'hello'
    }
},
  data() {
    return {
      message: 'ddd',
    };
  },
  computed:{

  }
};
</script>

<style>
#app {
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  color: blue;
}
</style>