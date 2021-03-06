describe('$.widget', function() {

  beforeEach(function() {

    clicked = false;
    superClicked = false;

    $.behavior('ui.baseClicker', {
      click: function() {
        superClicked = true;
      }
    });

    $.behavior('ui.clicker', $.ui.baseClicker, {
      _init: function() {
      },

      click: function() {
        clicked = true;
        this._super();
      }
    });

    html = $('<div></div>');
  });

  it('binds event methods', function() {
    html.clicker();
    html.click();

    expect(clicked).toBeTruthy();
  });

  it('provides access to this._super method', function() {
    html.clicker();
    html.click();

    expect(superClicked).toBeTruthy();
  });

  it('binds to elements added after initial dom load', function() {
    $('#fixtures').append($('<div class="clicker"></div>'));
    $('.clicker').clicker();

    $('#fixtures').append($('<p class="clicker"></p>'));
    expect(clicked).toBeFalsy();
    $('p.clicker').click();
    expect(clicked).toBeTruthy();
    expect($('p.clicker').data('clicker') instanceof $.ui.clicker).toBeTruthy();
  });

  describe('delegation', function() {
    beforeEach(function() {
      clicked = clickedP = false;
      $.behavior('test.clickerWithDelegation', {
        click: function() {
          clicked = true;
        },

        'p click': function() {
          clickedP = true;
        }
      });
    });

    it('delegates events', function() {
      html = $('<div id="clicker"><h1>header</h1><p>paragraph</p></div>');
      $('#fixtures').html(html);
      $('#clicker').clickerWithDelegation();
      expect(clicked).toBeFalsy();
      $('#clicker').click();
      expect(clicked).toBeTruthy();
      expect(clickedP).toBeFalsy(); //still
      $('#clicker p').click();
      expect(clickedP).toBeTruthy();
    });

  });

  //seemed to be causing a memory leak in IE
  xit('stores instances on the constructors instances array', function() {
   html.clicker();
   expect($.ui.clicker.instances.length).toEqual(1);
  });
});
