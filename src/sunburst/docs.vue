<template>
  <div class="am-g">
    <ul class="am-avg-sm-2 am-avg-md-3">
      <li><a v-link="{ path: '/sunburst/cascaded'}">cascaded</a></li>
      <li><a v-link="{ path: '/sunburst/single'}">single</a></li>
      <li><a v-link="{ path: '/sunburst/sunburst'}">sunburst</a></li>
    </ul>
  </div>
  <router-view></router-view>
</template>
<script>
  require('./');
  export default {

  }
</script>
