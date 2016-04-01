<template>
  <div style="position: relative">
    <div style="text-align: center">
      <span id="sunburst1" class="sunburst" style="position: relative"></span>
      <span id="sunburst2" class="sunburst"></span>
    </div>
    <form style="position:absolute; right:10px; top:20px;">
      <label><input type="radio" name="module" value="size">size</label>
      <label><input type="radio" name="module" value="count" checked>count</label>
    </form>
  </div>
</template>
<script>
  module.exports = {
    ready: function () {
      $('#sunburst1').Sunburst({
        size: 350,
        'json-url': require('file!./json/flare.json'),
        preClick: function (d, i) {
          $('#sunburst2').Sunburst({
            size: 350,
            'json-url': i % 2 === 0 ? require('file!./json/flare2.json') : require('file!./json/flare1.json')
          });
        }
      });
    }
  }
</script>
