<template>
    <div class="RegisterLink">
      <h1>{{ msg }}</h1>
      <!-- <h3>Follow Me</h3>
      <ul>
        <li><a href="https://www.instagram.com/jokowi/" target="_blank" rel="noopener">Instagram</a></li>
        <li><a href="https://twitter.com/buitengebieden/status/1666546598007001096" target="_blank" rel="noopener">Twitter</a></li>
        <li><a href="https://www.youtube.com/@VINDES" target="_blank" rel="noopener">Youtube</a></li>
      </ul> -->
    </div>
</template>

<script>
export default {
  name: 'RegisterLink',
  props: {
    msg: String
  }
}
</script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped lang="scss">
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>
