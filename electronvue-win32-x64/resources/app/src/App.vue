<template>
  <div>
    <!-- <nav v-if="!isLoginPage && !isRegisterPage">
      <router-link to="/home">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/">Logout</router-link>
    </nav> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  computed: {
    isLoginPage () {
      return this.$route.path === '/'
    },
    isRegisterPage () {
      return this.$route.path === '/register'
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;
  }
}
</style>
