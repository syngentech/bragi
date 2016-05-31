<template lang="jade">
h1 Amaze UI

h2#am-alert Alert
section {{{ am_alert }}}
  pre {{ am_alert }}

h2#am-footer Footer
section {{{ am_footer }}}
  pre {{ am_footer }}

h2#am-icon Icon
p 使用自托管资源，当前 CDN 状态：
  i.am-margin-right-xs(:class="am_icon.class")
  span {{ am_icon.text }}

h2#utility Utility
h3#am-text-4xl .am-text-4xl
section {{{ am_text_4xl }}}
  pre {{ am_text_4xl }}
</template>

<script>
require('./')

export default {
  data: function () {
    return {
      am_alert:
'<div class="am-alert">没什么可给你，但求凭这阙歌。谢谢你风雨里，都不退愿陪着我。</div>',
      am_footer:
'<footer class="am-footer">' +
  '<div class="am-footer-text am-footer-text-left">北京合生基因科技有限公司是国内第一家专注于合成生物学在科研和医药健康领域应用的生物技术公司。公司将秉持“科教兴国、产业报国、健康强国”理念，以“在过程中寻找机会、在发展中解决问题、在创新中获得效益”为思路，以发展民族生物产业为己任，努力成为集合成生物学技术研发、科研服务和产品销售于一体的新型生物医药技术型企业。</div>' +
  '<div class="am-footer-text">服务条款<span class="am-footer-divider"> | </span>帮助中心<span class="am-footer-divider"> | </span>联系我们</div>' +
  '<div class="am-footer-miscs">' +
    '<p>&copy; Beijing SyngenTech Co., Ltd.</p>' +
  '</div>' +
'</footer>',
      am_icon: {
        class: 'am-icon-spinner am-icon-spin',
        text: '查询中'
      },
      am_text_4xl:
'<p class="am-text-4xl am-text-truncate">千万不要因为走得太久，而忘记了我们为什么出发。</p>'
    }
  },
  attached: function () {
    var self = this

    window.$(document).ready(function () {
      window.$('pre').each(function (i, block) {
        window.hljs.highlightBlock(block)
      })

      window.$.ajax({
        url: window.$('#am-icon').css('background-image').slice(5, -2),
        complete: function (res) {
          if (res.status === 200) {
            self.am_icon.class = 'am-icon-check am-text-success'
            self.am_icon.text = '正常'
          } else {
            self.am_icon.class = 'am-icon-times am-text-danger'
            self.am_icon.text = '异常'
          }
        }
      })
    })
  }
}
</script>

<style lang="scss">
@import "../variables.scss";

#am-icon {
  background-image: url($fa-font-path);
}
</style>
