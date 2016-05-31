<template lang="jade">
h1 Sunburst

h2 使用案例
.am-text-center
  #single-sunburst
</template>

<script>
require('./');

module.exports = {
  attached: function () {
    $('#single-sunburst').Sunburst({
      dataUrl: require('./json/flare.json')
    });
  }
}
</script>

<style lang="scss">
@import "./style.scss";
</style>
