<template>
    <div>
        <AppHeaderAbout/>
        <router-view/>
    </div>
</template>

<script>
import AppHeaderAbout from '../components/Layout/AppHeaderAbout.vue'
export default {
  components: { AppHeaderAbout }
}
</script>
