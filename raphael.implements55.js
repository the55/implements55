//---------------------------------------------------------------- extensions
var Ext55 = {
  random: function(max) {
    return Math.floor(Math.random()*parseInt(max))+1
  }
};

// jQuery Random plugin (random element from array)
(function($) {
  jQuery.fn.random = function(num) {
    num = parseInt(num);
    if (num > this.length) return this.pushStack(this);
    if (! num || num < 1) num = 1;
    var to_take = new Array();
    this.each(function(i) { to_take.push(i); });
    var to_keep = new Array();
    var invert = num > (this.length / 2);
    if (invert) num = this.length - num;
    for (; num > 0; num--) {
      for (var i = parseInt(Math.random() * to_take.length); i > 0; i--)
        to_take.push(to_take.shift());
      to_keep.push(to_take.shift());
    }
    if (invert) to_keep = to_take;
    return this.filter(function(i) { return $.inArray(i, to_keep) != -1; })[0];
  };
}) (jQuery);

//---------------------------------------------------------------- 

Raphael.fullPaper = function(container) {
  return Raphael(container || 'container',$(window).width(),$(window).height());
}

// --------------------------------------------------------------- UTIL

Raphael.hypotenuse = function(x, y) {
  return Math.sqrt(x*x+y*y);
};

Raphael.randomCoordsOnACircle = function(cx, cy, radius) {
  var angle = Ext55.random(360);
  return {
    angle: angle,
    x: (cx+radius*Math.cos(angle * Math.PI/180)),
    y: (cy+radius*Math.sin(angle * Math.PI/180))
  };
};

Raphael.fn.diagonal = function() {
  return Raphael.implements55.hypotenuse(this.width, this.height);
};

// ---------------------------------------------------------------- LINES

Raphael.fn.line = function (x, y, x2, y2) {
  return this.path("M"+x+' '+y+'L'+x2+' '+y2);
};

// ---------------------------------------------------------------- ARCS

// http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
Raphael.fn.arc = function(startX, startY, endX, endY, radius1, radius2, angle, largeArcFlag) {
  var arc = this.arcString(startX, startY, endX, endY, radius1, radius2, angle, largeArcFlag);
  return this.path('M'+arc);
};

Raphael.fn.arcString = function(startX, startY, endX, endY, radius1, radius2, angle, largeArcFlag) {
  // opts 4 and 5 are:
  //    large-arc-flag: 0 for smaller arc
  //    sweep-flag:     1 for clockwise

  largeArcFlag = largeArcFlag || 0;
  var arcSVG = [radius1, radius2, angle, largeArcFlag, 1, endX, endY].join(' ');
  return startX+' '+startY + " a " + arcSVG;
};

Raphael.fn.circularArcString = function(centerX, centerY, radius, startAngle, endAngle) {
  startAngle  = startAngle%360;
  endAngle    = endAngle%360;
  if(startAngle < 0)  { startAngle+= 360; }
  if(endAngle < 0)    { endAngle+= 360; }
  if(endAngle < startAngle) endAngle+=360;

  var startX = centerX+radius*Math.cos(startAngle*Math.PI/180);
  var startY = centerY+radius*Math.sin(startAngle*Math.PI/180);
  var endX = centerX+radius*Math.cos(endAngle*Math.PI/180);
  var endY = centerY+radius*Math.sin(endAngle*Math.PI/180);

  var flag = ((startAngle - endAngle) > -180) ? 0 : 1;
  return this.arcString(startX, startY, endX-startX, endY-startY, radius, radius, 0, flag);
};

Raphael.fn.circularArc = function(centerX, centerY, radius, startAngle, endAngle) {
  var arc = this.circularArcString(centerX, centerY, radius, startAngle, endAngle);
  return this.path('M'+arc);
};


// ---------------------------------------------------------------- GEOMETRY


// archimedian
Raphael.fn.spiral = function(centerX, centerY, spacing, maxRadius) {
  var pathAttributes = ['M', centerX, centerY];
  var angle = 0;
  var startX = centerX;
  var startY = centerY;

  for(var radius = 0; radius < maxRadius; radius++) {
    angle += spacing;
    var endX = centerX+radius*Math.cos(angle*Math.PI/180);
    var endY = centerY+radius*Math.sin(angle*Math.PI/180);

    pathAttributes.push(this.arcString(startX, startY, endX-startX, endY-startY, radius, radius, 0));
    startX = endX; startY = endY;
  }
  return this.path(pathAttributes.join(' '));
};

// logarithmic spiral
// nope

// Regular Polygon
Raphael.fn.regularPolygon = function(cx, cy, r, sides) {
  var path = ['M'];
  for (var i = 0; i < sides; i++) {
    var angle = i * 2 * Math.PI / sides;
    if(i > 0) {path.push('L');}
    path.push(Math.round(cx + (r * Math.cos(angle))));
    path.push(Math.round(cy + (r * Math.sin(angle))));
  }
  path.push('Z');
  return this.path(path.join(' '));
};

//--------------------------------------------------------------- DRAWN

Raphael.about = function(range, factor) {
  return range+Raphael.randomize(range, factor);
};


Raphael.randomize = function(range, factor) {
  factor = factor || 3;
  return Ext55.random(range/factor)-range/2/factor;
};

Raphael.drawnMidpoints = function(x, y, x2, y2, wobble, segmentLength) {
  var length = Math.pow((y2-y)*(y2-y)+(x2-x)*(x2-x), 0.5);
  var segments = parseInt(length/segmentLength);
  var points = [];
  for(var i = 1; i < segments; i++) {
    segmentStartX = x+(x2-x)*(i-1)/segments;
    segmentStartY = y+(y2-y)*(i-1)/segments;
    segmentEndX = x+(x2-x)*i/segments;
    segmentEndY = y+(y2-y)*i/segments;

    midX1 = Math.round(segmentStartX+(segmentStartX-segmentEndX)*-0.3 +Raphael.randomize(wobble));
    midX2 = Math.round(segmentStartX+(segmentStartX-segmentEndX)*-0.7 +Raphael.randomize(wobble));
    midY1 = Math.round(segmentStartY+(segmentStartY-segmentEndY)*-0.3 +Raphael.randomize(wobble));
    midY2 = Math.round(segmentStartY+(segmentStartY-segmentEndY)*-0.7 +Raphael.randomize(wobble));

    points.push('C '+midX1 + ' '+ midY1+ ' '+midX2 + ' '+ midY2+
      ' '+segmentEndX + ' '+ segmentEndY);
  }
  return points.join(' ');
};

Raphael.fn.drawnLine = function (x, y, x2, y2, wobble) {
  var path = ["M",(x+Raphael.randomize(wobble/2)),(y+Raphael.randomize(wobble/2))];
  var segmentLength = 20;
  path.push(Raphael.drawnMidpoints(x, y, x2, y2, wobble, segmentLength));
  path.push('L'+(x2+Raphael.randomize(wobble/2))+' '+(y2+Raphael.randomize(wobble/2)));
  return this.path(path.join(' '));
};

Raphael.fn.drawnRect = function (x, y, width, height, wobble) {
  var path = ["M",(x+Raphael.randomize(wobble/2)),(y+Raphael.randomize(wobble/2))];
  var segmentLength = 20;
  path.push(Raphael.drawnMidpoints(x,y,x, y+height, wobble, segmentLength));
  path.push('L', x+Raphael.randomize(wobble/2), y+height+Raphael.randomize(wobble/2));

  path.push(Raphael.drawnMidpoints(x, y+height, x+width, y+height, wobble, segmentLength));
  path.push('L', x+width+Raphael.randomize(wobble/2), y+height+Raphael.randomize(wobble/2));

  path.push(Raphael.drawnMidpoints(x+width, y+height, x+width, y, wobble, segmentLength));
  path.push('L', x+width+Raphael.randomize(wobble/2), y+Raphael.randomize(wobble/2));

  path.push(Raphael.drawnMidpoints(x+width, y, x,y, wobble, segmentLength));
  path.push('Z');
  return this.path(path.join(' '));
};

Raphael.fn.drawnRegularPolygon = function(cx, cy, r, sides, wobble) {
  var segmentLength = 10;
  var lastX, lastY;
  var path = ['M'];
  for (var i = 0; i <= sides; i++) {
    var angle = i * 2 * Math.PI / sides;

    thisX = Math.round(cx + (r * Math.cos(angle)));
    thisY = Math.round(cy + (r * Math.sin(angle)));
    if(i > 0) {
      path.push(Raphael.drawnMidpoints(lastX, lastY, thisX, thisY, wobble, segmentLength));
      path.push('L');
    }
    path.push((thisX+Raphael.randomize(wobble/2)),(thisY+Raphael.randomize(wobble/2)));
    lastX=thisX;
    lastY=thisY;
  }

  path.push('Z');
  return this.path(path.join(' '));
};

// takes attrs like circularArc
Raphael.fn.drawnCircularArc = function(centerX, centerY, radius, startAngle, endAngle) {
  var outerRadius, wobble, degreeIncrement,drawnPath = [];

  degreeIncrement = parseInt(15 - Math.pow(radius, .33))+1;

  if(radius > 300) {
    wobble = degreeIncrement + Math.sqrt(radius);
  } else {
    wobble = 5 + Math.sqrt(radius);
  }

  outerRadius = radius*(1.0+degreeIncrement/1000);

  if(radius > 1500) {
    outerRadius = radius*(1.0+degreeIncrement/radius);
  } else if(radius > 500) {
    outerRadius = outerRadius * 0.995;
  }

  startAngle  = startAngle%360;
  endAngle    = endAngle%360;
  if(startAngle < 0)  { startAngle+= 360; }
  if(endAngle < 0)    { endAngle+= 360; }
  if(endAngle < startAngle) endAngle+=360;

  for(var angle = startAngle; angle < endAngle; angle += degreeIncrement) {
    var angle1 = angle*Math.PI/180;
    var angle2 = (angle+degreeIncrement)*Math.PI/180;

    var segmentStartX = parseInt(centerX+radius*Math.cos(angle1));
    var segmentStartY = parseInt(centerY+radius*Math.sin(angle1));
    var segmentEndX   = parseInt(centerX+radius*Math.cos(angle2));
    var segmentEndY   = parseInt(centerY+radius*Math.sin(angle2));
    if(angle == startAngle) drawnPath.push('M '+segmentStartX+' '+segmentStartY);

    var widerSegmentStartX = parseInt(centerX+outerRadius*Math.cos(angle1));
    var widerSegmentStartY = parseInt(centerY+outerRadius*Math.sin(angle1));
    var widerSegmentEndX   = parseInt(centerX+outerRadius*Math.cos(angle2));
    var widerSegmentEndY   = parseInt(centerY+outerRadius*Math.sin(angle2));
    midX1 = Math.round(widerSegmentStartX+(widerSegmentStartX-widerSegmentEndX)*-0.3 + Raphael.randomize(wobble));
    midX2 = Math.round(widerSegmentStartX+(widerSegmentStartX-widerSegmentEndX)*-0.7 + Raphael.randomize(wobble));
    midY1 = Math.round(widerSegmentStartY+(widerSegmentStartY-widerSegmentEndY)*-0.3 + Raphael.randomize(wobble));
    midY2 = Math.round(widerSegmentStartY+(widerSegmentStartY-widerSegmentEndY)*-0.7 + Raphael.randomize(wobble));
    drawnPath.push(['C',midX1,midY1,midX2,midY2,segmentEndX,segmentEndY].join(' '));
  }
  return this.path(drawnPath.join(' '));
};


//--------------------------------------------------------------- REPEATER


Raphael.fn.radialRepeater = function(centerX, centerY, radius, repetitions, object, options) {
  var degrees = 360/repetitions;
  object.hide();
  var repeaterSet = this.set();

  for(var angle = 0; angle <= 360; angle+=degrees) {
    var newOne = object.clone();

    var i = {
      x: (centerX+radius*Math.cos(angle*Math.PI/180)),
      y: (centerY+radius*Math.sin(angle*Math.PI/180)),
      rotation: angle
    };
    newOne.attr({
      x: (centerX+radius*Math.cos(angle*Math.PI/180)),
      y: (centerY+radius*Math.sin(angle*Math.PI/180)),
      rotation: angle
    }).show();
    repeaterSet.push(newOne);
  }
  return repeaterSet;
};

//--------------------------------------------------------------- GRID WORK


// set padding to negative for full-bleed/overflow.
Raphael.fn.doToGrid = function(method, spacingX, spacingY, padding) {
  var height = $(window).height();
  var width  = $(window).width();
  var padding = padding || 0;

  for(var y = padding; y <= height-(padding*2); y += spacingY) {
    for(var x = padding; x <= width-(padding*2); x += spacingX) {
      var element = method.call();
      element.translate(x,y);
    }
  }

};


Raphael.fn.grid = function(color, spacingX, spacingY) {
  var height = $(window).height();
  var width  = $(window).width();

  for(var y = 0; y <= height; y += spacingY) {
    for(var x = 0; x <= width; x += spacingX) {
      this.rect(x,y,spacingX, spacingY).attr('stroke', color);
    }
  }
};

Raphael.fn.randomColoredGrid = function(colors, object, spacing) {
  object.hide();
  for(var y = 0; y <= $(window).height(); y += spacing) {
    for(var x = 0; x <= $(window).width(); x += spacing) {
      var newOne = object.clone();
      var color = colors[Ext55.random(colors.length)];
      newOne.attr({x: x, y: y, fill: color});
    }
  }
};

Raphael.fn.randomColoredObjectGrid = function(colors, objects, spacing) {
  for(var y = 0; y <= $(window).height(); y += spacing) {
    for(var x = 0; x <= $(window).width(); x += spacing) {
      var color = colors[Ext55.random(colors.length)-1];
      var newOne = objects[Ext55.random(objects.length)-1].clone();
      newOne.attr({fill: color}).translate(x,y).show();
    }
  }
}

//--------------------------------------------------------------- animate

Raphael.el.rotateForever = function (rate) {
  this.attrs.currentRotation = (this.attrs.currentRotation || 0) + 3600;
  return this.animate({rotation: this.attrs.currentRotation}, rate, function(){this.rotateForever(rate)});
};

//--------------------------------------------------------------- colors

Raphael.randomGrey = function() {
  var greys = ['#EEEEEE','#DDDDDD','#CCCCCC','#BBBBBB','#AAAAAA','#999999','#888888','#777777','#666666','#555555','#444444','#333333','#222222','#111111','#000000'];
  return greys[Ext55.random(greys.length-1)];
};

//--------------------------------------------------------------- debug

Raphael.el.outline = function () {
  return this.attr({stroke: 'red', 'stroke-width': 1});
};

Raphael.el.rotateAroundCenter = function (degrees) {
  return this.rotate(degrees, this.paper.width/2, this.paper.height/2);
};
