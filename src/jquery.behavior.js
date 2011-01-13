(function($) {

  $.extend($.Widget.prototype, {
    _bindings: function() {
      var bindings = [], prop;
      for(prop in this) {
        if(prop.match($.Widget.revent) && $.type(this[prop]) == 'function'){
          var target = RegExp.$1, event = RegExp.$2;
          bindings.push({
            method: this[prop],
            target: target,
            event: event
          });
        }
      }
      return bindings;
    }
  });

  $.extend($.Widget, {
    revent: /([\w\s]+)?(change|click|contextmenu|dblclick|keydown|keyup|keypress|mousedown|mousemove|mouseout|mouseover|mouseup|reset|windowresize|resize|windowscroll|scroll|select|submit|dblclick|focusin|focusout|load|unload|ready|hashchange|mouseenter|mouseleave)/
  }); 

  $.behavior = function(name, base, prototype) {
    $.widget(name, base, prototype);

    var namespace = name.split( "." )[ 0 ];
    name = name.split( "." )[ 1 ];
    
    var object = $[ namespace ][ name ];
    $[ namespace ][ name ] = function(options, element) {
      if ( arguments.length ) {
        object.call(this, options, element);
        $.each(this._bindings(), $.proxy(function(i, binding){
          var handler = $.proxy(binding.method, this);
          if(binding.target)
            this.element.delegate(binding.target, binding.event, handler);
          else
            this.element.bind(binding.event, handler);
        }, this));
      }
    };

    $.extend($[ namespace ][ name ], { instances: [] });

    $[ namespace ][ name ].prototype = object.prototype;

    $.widget.bridge(name, $[ namespace ][ name ]);

    var plugin = $.fn[ name ];

    $.fn[ name ] = function( options ) {
      var behavior = $[ namespace ][ name ].prototype;
      $.each(behavior._bindings(), $.proxy(function(i, binding) {
        var handler = function(event) {
          if(!$(this).data(name)) {
            var instance = $(this)[name].call($(this)).data(name);
            instance[event.type].call(instance, event, this);
          }
        };
        if(!binding.target)
          $(this.selector).live(binding.event, handler);
      }, this));
      return plugin.call(this, options);
    };
  };

})(jQuery);
