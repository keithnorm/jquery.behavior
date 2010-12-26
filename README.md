## jQuery Behavior
A Lowpro style behavior implementation built on top of jQuery UI's widget factory.

### Why?
I like encapsulating behavior into classes. I've gotten used to Lowpro's Behavior class and I've been using it in jQuery, then I realized that jQuery UI's $.widget method was doing the same thing as Prototype's Class.create, sort of, so I extended it into $.behavior. This lets you have stateful objects just like jQuery UI but sprinkles in automatic event methods and delegation like Lowpro's Behaviors. It's basically $.widget with some automatic event binding.

## How?
    $.behavior('demo.colorChangeBehavior', {
      _init: function() {
        this.initialColor = 'red';
        this.element.css({color: this.initialColor});
      },

      onclick: function(e) {
        e.preventDefault();
        this.element.css({color: '#' + this._randomHex()});
      },

      //private
      _randomHex: function() {
        return Math.floor(Math.random()*16777215).toString(16);
      }
    });      

    $('a').colorChangeBehavior(); 

## "Delegation"
Behaviors get bound to elements in two ways, One is by calling the behavior method on a jQuery object after the element is loaded into the DOM. But, behaviors are also bound to elements loaded in later (like, via Ajax). This all happens automatically so you never have to think about reattaching your events after an Ajax request. Check out the demo for an example of that. 

## Inheritance
Since this sits on top of $.widget, you get everything that it can do, so inheritance works like this:

    $.behavior('demo.animal', {
      onclick: function() {
        this.speak();
      }
    });

    $.behavior('demo.dog', $.demo.animal, {
      speak: function() {
        console.log('woof');
      }
    });

    $('a').dog();

