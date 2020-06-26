<template>
<div class="scrolling-bg-container">
  <div class="sliding-background-image"></div>
</div>
</template>

<script>
export default {
  // name: 'ComponentName',
  data () {
    return {}
  }
}
</script>

<style>
.scrolling-bg-container {
  overflow: hidden;
}

.sliding-background-image {
  background: url("../statics/images/scroll-bg.png") repeat-x;
  height: 428px;
  width: 5886px;
  animation: slide 75s linear infinite;
}

@keyframes slide{
  0%{
    transform: translate3d(0, 0, 0);
  }
  100%{
    transform: translate3d(-2943px, 0, 0);
  }
}
</style>
