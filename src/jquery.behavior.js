(function($) {

  $.extend($.Widget.prototype, {
    _eventMethods: function() {
      var methods = [], prop;
      for(prop in this) {
        if(prop.match(/^on(.+)/) && $.type(this[prop]) == 'function')
          methods.push(prop);
      }
      return methods;
    }
  });

  $.behavior = function(name, base, prototype) {
    $.widget(name, base, prototype);

    var namespace = name.split( "." )[ 0 ];
    name = name.split( "." )[ 1 ];
    
    var object = $[ namespace ][ name ];
    $[ namespace ][ name ] = function(options, element) {
      if ( arguments.length ) {
        object.call(this, options, element);
        $.each(this._eventMethods(), $.proxy(function(i, method){
          this.element.bind(method.replace('on', ''), $.proxy(this[method], this));
        }, this));
      }
    };

    $.extend($[ namespace ][ name ], { instances: [] });

    $[ namespace ][ name ].prototype = object.prototype;

    $.widget.bridge(name, $[ namespace ][ name ]);

    var plugin = $.fn[ name ];

    $.fn[ name ] = function( options ) {
      var behavior = $[ namespace ][ name ].prototype;
      $.each(behavior._eventMethods(), $.proxy(function(i, method) {
        $(this.selector).live(method.replace('on', ''), function(event) {
          if(!$(this).data(name)) {
            var instance = $(this)[name].call($(this)).data(name);
            instance['on' + event.type].call(instance, event, this);
          }
        });
      }, this));
      return plugin.call(this, options);
    };
  };

})(jQuery);
