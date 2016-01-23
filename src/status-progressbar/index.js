require('./style.scss');

(function($) {
  // Run automatically
  $(document).on('ready', function() {
    $('[data-am-status-progressbar]').each(function() {
      $(this).StatusProgressbar(JSON.parse($(this).attr('data-am-status-progressbar')));
    });
  });

  // Render when resize
  $(window).on('resize', function() {
    $('[data-am-status-progressbar]').each(function() {
      $(this).StatusProgressbar(JSON.parse($(this).attr('data-am-status-progressbar')));
    });
  });

  // Extend jQuery object
  $.fn.StatusProgressbar = function(opts) {
    var ul = $(this).addClass('am-status-progressbar').html('');

    if (opts.dataJson) {
       render(opts.dataJson);
    } else if (opts.dataUrl) {
      $.getJSON(opts.dataUrl, function(json) { render(json); });
    }

    function render(data) {
      // Insert progresses
      for (var name in data) {
        var value = data[name];
        ul.append(
          '<li class="progress' + (value.status === '' ? '' : ' active') + '"><ul>' +
          '<li class="status">' + name + '</li>' +
          '<li class="' + (value.status === 'danger' ? 'cross am-icon am-icon-times' : 'circle') + '"></li>' +
          '<li class="date">' + (value.date === '' ? '&nbsp;<br/>&nbsp;' : value.date.replace(/ /, '<br/>')) + '</li>' +
          '</ul></li>'
        );
      }

      // Insert bars
      ul.children('li + li').before(
        '<li class="bar"><ul><li class="status">&nbsp;</li><li class="rectangle"></li><li class="date">&nbsp;<br/>&nbsp;</li></ul></li>'
      );

      // Activate bars
      ul.children('li.bar').filter(function() {
        var li = $(this);
        if ($(this).prev().hasClass('active') && ($(this).next().hasClass('active'))) {
          li.addClass('active');
        }
      });

      // Adjust bar width
      var barWidth = (ul.width() - ul.children('li.progress').length * 120) / ul.children('li.bar').length + 90 - 5;
      ul.children('li.bar').width(barWidth);
      ul.find('li.rectangle').width(barWidth);
    }
  };
})(require('jquery'));
