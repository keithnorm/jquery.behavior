# jQuery Behavior
A Lowpro style behavior implementation built on top of jQuery UI's widget factory.

### Why?
I like encapsulating behavior into classes. I've gotten used to Lowpro's Behavior class and I've been using it in jQuery, then I realized that jQuery UI's $.widget method was doing the same thing as Prototype's Class.create, sort of, so I extended it into $.behavior. This lets you have stateful objects just like jQuery UI but sprinkles in automatic event methods and delegation like Lowpro's Behaviors. It's basically $.widget with some automatic event binding.

## How?
    $.behavior('demo.colorChangeBehavior', {
      _init: function() {
        this.initialColor = 'red';
        this.element.css({color: this.initialColor});
      },

      click: function(e) {
        e.preventDefault();
        this.element.css({color: '#' + this._randomHex()});
      },

      //private
      _randomHex: function() {
        return Math.floor(Math.random()*16777215).toString(16);
      }
    });      

    $('a').colorChangeBehavior(); 

## Delegation
Delegation is now done in the way that JavascriptMVC does it.
    
    //Given this HTML
    //<ul class="tabs">
    //  <li>tab 1</li>
    //  <li>tab 2</li>
    //</ul>
    $.behavior('demo.tabs', {
      'li click': function() {
        this._showPanel(e.target);
      },

      _showPanel: function(tab) {
        //etc...
      }
    });

    $('.tabs').tabs();

## Inheritance
Since this sits on top of $.widget, you get everything that it can do, so inheritance works like this:

    $.behavior('demo.animal', {
      click: function() {
        this.speak();
      },

      speak: function() {
        console.log('grrrrr');
      }
    });

    $.behavior('demo.dog', $.demo.animal, {
      speak: function() {
        console.log('woof');
        this._super();
      }
    });

    $('a').dog();

Notice you have access to the overridden method by calling this._super(). This implementation was inspired by John Resig's article on [Simple Javascript Inheritance](http://ejohn.org/blog/simple-javascript-inheritance/)

## TODO
When I added delegation I altered the regex that determines if a behavior method is an event handler, favoring names like 'click' instead of 'onclick'. Unfortunately this means that custom events that you could bind before by just defining oncustomevent no longer work. I will be adding a way to register custom events similar to JavascriptMVC.

