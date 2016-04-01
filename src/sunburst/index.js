require('./style.scss');
var d3 = require('d3');

(function ($) {
  // Run automatically
  var store = [];
  $(document).on('ready', function () {
    $('.sunburst[data-sunburst]').Sunburst();
  });

  // Extend jQuery object
  $.fn.Sunburst = function (options) {
    return this.each(function () {
      var opts = $.extend({}, $.fn.Sunburst.defaults, JSON.parse($(this).attr('data-sunburst') || '{}'), options);
      $(this).data('opts', opts);
      $(this).html('');
      store.push(render.bind(this)());
      var btnName = $(this).attr('data-btn-name');
      if (btnName && $('[name=' + btnName + ']').length > 0) {
        $('[name=' + btnName + ']').on('change', function () {
          pub.change(this.value);
        });
      }
    });
    var pub = {
      change: function (changeVal) {
        store.forEach(function (n, i) {
          n.change(changeVal);
        })
      }
    };

    return pub;
  };

  // Default options
  $.fn.Sunburst.defaults = {
    size: 600
  };

  // Render sunburst
  function render() {
    var $this = this;
    var x, y, radius, svg, g, path, partition, arc, node, tooltip;
    var opts = $(this).data('opts');
    $(this).css({'position':'relative'});
    var color = d3.scale.category20c();  //Construct an ordinal scale of the other 20 colors
    tooltip = d3.select(this).append('div').attr("class", "tooltip");
    radius = opts.size / 2;
    x = d3.scale.linear().range([0, Math.PI * 2]);
    y = d3.scale.linear().range([0, radius]);
    svg = d3.select(this).append('svg')
      .attr('width', opts.size)
      .attr('height', opts.size)
      .append('g')
      .attr('transform', 'translate(' + opts.size / 2 + ',' + opts.size / 2 + ')');


    // Define partition
    partition = d3.layout.partition()
      //Recursively partition node of the tree to the sun or icicle
      .sort(null)
      .value(function (d) {
        return 1;
      });

    // Define arc
    arc = d3.svg.arc()
      .startAngle(function (d) {
        return Math.max(0, Math.min(Math.PI * 2, x(d.x)));
      })//Gets or sets the overall start angle of the cake layout
      .endAngle(function (d) {
        return Math.max(0, Math.min(Math.PI * 2, x(d.x + d.dx)));
      })
      .innerRadius(function (d) {
        return Math.min(radius, y(d.y));
      })//Gets or sets the inner radius access device
      .outerRadius(function (d) {
        return Math.min(radius, y(d.y + d.dy));
      });//Gets or sets the outer radius of the access device

    // Init nodes
    if (opts.json) {
      initNode(opts.json);
    } else if (opts['json-url']) {
      d3.json(opts['json-url'], function (error, json) {
        initNode(json);
      });
    }

    function initNode(json) {
      node = json;
      g = svg.datum(json).selectAll('g')
        .data(partition.nodes)//Calculates partition layout and returns an array of nodes
        .enter().append('g');
      path = g.append('path')
        .attr('d', arc)
        .style('fill', function (d) {
          return color((d.children ? d : d.parent).name);
        })
        .each(stash)
        .on("mouseover", function (d) {
          // TODO: should condition on whether d.name exists
          var mouseXY = d3.mouse($this);
          tooltip.html(d.name).style("opacity", 1.0)
            .style("left", (mouseXY[0]) + "px")
            .style("top", (mouseXY[1] ) + 20 + "px");
          d3.select(this).style('fill', 'yellow');
        })
        .on("mouseout", function (d) {
          tooltip.style("opacity", 0);
          d3.select(this).style('fill', function (d) {
            return color((d.children ? d : d.parent).name);
          });
        })
        .on('click', click);

      // Change model
      // TODO: abstract this feature
      d3.selectAll('input').on('change', function () {
        var value = this.value === 'count' ?
          function () {
            return 1;
          } :
          function (d) {
            return d.size;
          };
        path.data(partition.value(value).nodes)//Gets or sets the value of the value that is used to specify the size of the circle.
          .transition()
          .duration(1000)
          .attrTween('d', arcTweenData);//Smooth transition between two attribute values
      });

      function click(d, i) {
        if (opts.preClick !== undefined) {
          opts.preClick.call(this, d, i);
        }
        node = d;
        path.transition()
          .duration(1000)
          .attrTween('d', arcTweenZ(d));
      }
    }

    function stash(d) {
      d.x0 = d.x;
      d.dx0 = d.dx;
    }

    function arcTweenZ(d) {
      var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]);//Gets or sets the output interpolation device, which is the two number of the middle of the interpolation
      var yd = d3.interpolate(y.domain(), [d.y, 1]);
      var yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
      return function (d, i) {
        return i ?
          function () {
            return arc(d);
          } :
          function (t) {
            x.domain(xd(t));
            y.domain(yd(t));
            y.range(yr(t));
            return arc(d);
          };
      };
    }

    function arcTweenData(a, i) {
      var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);

      function tween(t) {
        var b = oi(t);
        b.x0 = a.x;
        b.dx0 = a.dx;
        return arc(b);
        l
      }

      if (i === 0) {
        var xd = d3.interpolate(x.domain(), [node.x, node.dx + node.x]);
        return function (t) {
          x.domain(xd(t));
          return tween(t);
        };
      } else {
        return tween;
      }
    }
  }
})(require('jquery'));
