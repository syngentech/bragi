require('./style.scss')

var d3 = require('d3');

(function ($) {
  // Extend jQuery object
  $.fn.Sunburst = function (opts) {
    opts = $.extend({}, $.Sunburst.defaults, opts)
    this.each(function () {
      $(this).addClass('sunburst').html('')
      render.bind(this)(opts)
    })
  }

  // Default options
  $.Sunburst = {
    defaults: {
      size: 600
    }
  }

  // Render sunburst
  function render (opts) {
    var color = d3.scale.category20c()
    var radius = opts.size / 2
    var x = d3.scale.linear().range([0, Math.PI * 2])
    var y = d3.scale.linear().range([0, radius])
    var svg = d3.select(this).append('svg')
      .attr('width', opts.size)
      .attr('height', opts.size)
      .append('g')
        .attr('transform', 'translate(' + opts.size / 2 + ',' + opts.size / 2 + ')')

    // Define partition
    var partition = d3.layout.partition()
      .sort(null)
      .value(function (d) { return 1 })

    // Define arc
    var arc = d3.svg.arc()
      .startAngle(function (d) { return Math.max(0, Math.min(Math.PI * 2, x(d.x))) })
      .endAngle(function (d) { return Math.max(0, Math.min(Math.PI * 2, x(d.x + d.dx))) })
      .innerRadius(function (d) { return Math.min(radius, y(d.y)) })
      .outerRadius(function (d) { return Math.min(radius, y(d.y + d.dy)) })

    // Draw tooltip
    var tooltip = d3.select(this).append('div').attr('class', 'tooltip')

    // Init nodes
    var node, g, path
    if (opts.dataJson) {
      initNode(opts.dataJson)
    } else if (opts.dataUrl) {
      d3.json(opts.dataUrl, function (error, json) {
        error
        initNode(json)
      })
    }

    function initNode (json) {
      node = json
      g = svg.datum(json).selectAll('g')
        .data(partition.nodes)
        .enter().append('g')
      path = g.append('path')
        .attr('d', arc)
        .style('fill', function (d) {
          return color((d.children ? d : d.parent).name)
        })
        .each(function (d) {
          d.x0 = d.x
          d.dx0 = d.dx
        })
        .on('mousemove', function (d) {
          tooltip.html(d.name).style('opacity', 1.0)
            .style('left', d3.event.pageX + 'px')
            .style('top', d3.event.pageY + 20 + 'px')
          d3.select(this).style('fill', 'yellow')
        })
        .on('mouseout', function (d) {
          d3.select(this).style('fill', function (d) {
            tooltip.style('opacity', 0)
            return color((d.children ? d : d.parent).name)
          })
        })
        .on('click', click)

      function click (d, i) {
        if (opts.preClick) { opts.preClick.call(this, d, i) }
        node = d
        path.transition()
          .duration(1000)
          .attrTween('d', arcTweenZ(d))
      }
    }

    function arcTweenZ (d) {
      var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx])
      var yd = d3.interpolate(y.domain(), [d.y, 1])
      var yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius])
      return function (d, i) {
        return i ? function () { return arc(d) } : function (t) { x.domain(xd(t)); y.domain(yd(t)); y.range(yr(t)); return arc(d) }
      }
    }

    function arcTweenData (a, i) {
      var oi = d3.interpolate({ x: a.x0, dx: a.dx0 }, a)

      function tween (t) {
        var b = oi(t)
        b.x0 = a.x
        b.dx0 = a.dx
        return arc(b)
      }

      if (i === 0) {
        var xd = d3.interpolate(x.domain(), [node.x, node.dx + node.x])
        return function (t) { x.domain(xd(t)); return tween(t) }
      } else {
        return tween
      }
    }
    typeof arcTweenData
  }
})(require('jquery'))
