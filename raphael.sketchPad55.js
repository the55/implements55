;(function ( $, window, document, undefined ) {
  var pluginName = 'sketchPad55', defaults = {
    rightControlClass: "right-control",
    rightControlStyle: "font-size: 2em; padding: 12px 40px 20px 20px; position: fixed; right: -10px; bottom: 100px; z-index: 10; background: #999; color: #333; opacity: 0.6",
    rightControlPauseText: "pause",
    rightControlMoreText: "more &raquo;",
    noControl: false};

  // The actual plugin constructor
  function SketchPad55( element, drawFunction, interval, options ) {
    this.paper = Raphael.fullPaper(element);
    this.element = $(element);
    this.options = $.extend( {}, defaults, options) ; // merge options with defaults
    this.drawFunction = drawFunction;
    a = drawFunction;
    this.interval = interval;
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  SketchPad55.prototype.init = function() {
    this.pause = false;
    this.element.addClass('sketch-pad-55');
    if(!this.options.noControl) this.createControl();
    this.iterate();
    setInterval(jQuery.iterateSketchPad55, this.interval);
  };

  SketchPad55.prototype.createControl = function() {
    var control = $("<div class='"+this.options.rightControlClass+"'></div>").
      text(this.options.rightControlPauseText).attr('style', this.options.rightControlStyle).
      data('moreText', this.options.rightControlMoreText).
      data('pauseText', this.options.rightControlPauseText).appendTo(this.element);

    var _self = this;
    control.click(function(){
      _self.pause = !_self.pause;
      if(_self.pause) {$(this).html($(this).data('moreText')); }
      else {$(this).text($(this).data('pauseText')); _self.iterate();}
    });
  },

  SketchPad55.prototype.iterate = function() {
    if(this.pause) return true;
    this.paper.clear();
    this.drawFunction(this.paper);
  }

  $.extend({
    iterateSketchPad55: function() {
      $('.sketch-pad-55').data('plugin_sketchPad55').iterate();
    }
  });

  $.fn[pluginName] = function ( drawFunction, interval, options ) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName,
        new SketchPad55( this, drawFunction, interval, options ));
      }
    });
  }
})( jQuery, window, document );
