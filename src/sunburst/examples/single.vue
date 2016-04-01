<template>
  <div style="position: relative">
    <div style="text-align: center">
      <span class="sunburst" data-btn-name="module" data-sunburst='{\"size\":500,\"json-url\":\"{{jsonUrl}}\"}'></span>
    </div>
    <form style="position:absolute; right:10px; top:20px;">
      <label><input type="radio" name="module" value="size">size</label>
      <label><input type="radio" name="module" value="count" checked>count</label>
    </form>
  </div>

</template>
<script>
  module.exports = {
    data: function () {
      return {
        jsonUrl: require('file!./json/flare.json')
      }
    },
    ready: function () {
      var $sunburst = $('.sunburst[data-sunburst]').Sunburst();
    }
  }
</script>
