<template lang="jade">
h1 Amaze UI

h2#utility 辅助类
h3 .am-text-4xl
section {{{ am_text_4xl }}}
  pre {{ am_text_4xl }}

h2#am-alert 警告框
section {{{ am_alert }}}
  pre {{ am_alert }}
</template>

<script>
require('./');

export default {
  data: function() {
    return {
      am_text_4xl:
`<p class="am-text-4xl am-text-truncate">千万不要因为走得太久，而忘记了我们为什么出发。</p>`,
      am_alert:
`<div class="am-alert">没什么可给你，但求凭这阙歌。谢谢你风雨里，都不退愿陪着我。</div>`
    };
  },
  attached: function() {
    $(document).ready(function() {
      $('pre').each(function(i, block) {
        hljs.highlightBlock(block);
      });
    });
  }
}
</script>
