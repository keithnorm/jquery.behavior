describe('$.widget', function() {

  beforeEach(function() {
    clicked = false;

    $.behavior('ui.clicker', {
      _init: function() {
      },

      onclick: function() {
        clicked = true;
      }
    });

    html = $('<div></div>');
  });

  it('binds event methods', function() {
    html.clicker();
    html.click();

    expect(clicked).toBeTruthy();
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

});
