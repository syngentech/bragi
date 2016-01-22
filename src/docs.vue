<template lang="jade">
.am-container.am-padding
  h1.am-margin-top-lg.am-text-center Bragi
  div.am-text-right v{{ package.version }}
  hr
  .am-avg-sm-2.am-avg-md-3
    a(v-link="{ path: '/amazeui' }") amazeui
  hr
  router-view
</template>

<script>
export default {
  data: function() {
    return {
      package: require('json!../package.json')
    }
  }
}
</script>

<style lang="scss">
h1 {
  font-size: 96px;
}
</style>
