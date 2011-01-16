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
    var behavior = $[ namespace ][ name ] = function(options, element) {
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

    var proto = $[ namespace ][ name ].prototype = object.prototype;

    // add _super method if we're overriding any methods on base class
    if(base.prototype){
      for(var method in proto){
        proto[method] = ($.isFunction(proto[method]) && $.isFunction(base.prototype[method])) ? (function(name, fn){
          return function() {
            var tmp = this._super;
            
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = base.prototype[name];
            
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })(method, proto[ method ]) : proto[ method ];
      }
    }

    $.widget.bridge(name, $[ namespace ][ name ]);

    var plugin = $.fn[ name ];

    $.fn[ name ] = function( options ) {
      $.each(this.selector.split(/,\s?/), function(i, selector) {
        var behavior = $[ namespace ][ name ].prototype,
            parts = selector.split(' '),
            context = parts.length > 1 ? parts[0] : document;
        selector = (parts.length > 1 ? parts.slice(1) : parts).join(' ');
        $.each(behavior._bindings(), $.proxy(function(i, binding) {
          var handler = function(event) {
            if(!$(this).data(name)) {
              var instance = $(this)[name].call($(this)).data(name);
              instance[event.type].call(instance, event, this);
            }
          };
          if(!binding.target){
            $(context).delegate(selector, binding.event, handler);
          }
        }, this));
      });
      var returnVal = plugin.call(this, options);
      return returnVal;
    };
    
    return behavior;
  };

})(jQuery);


