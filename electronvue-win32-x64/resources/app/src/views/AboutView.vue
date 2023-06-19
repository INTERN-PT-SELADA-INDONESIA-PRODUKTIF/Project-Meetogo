<template>
  <div class="about">
    <img alt="Syeikh" src="../assets/aldi.jpg">
    <h1>Syeikh Aldi</h1>
    <AboutLink msg="  "/>
  </div>
</template>

<script>
// @ is an alias to /src
import AboutLink from '@/components/AboutLink.vue'

export default {
  name: 'AboutView',
  components: {
    AboutLink
  }
}
</script>
