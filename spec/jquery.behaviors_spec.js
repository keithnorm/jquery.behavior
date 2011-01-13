describe('jquery-rails style behaviors', function() {
  beforeEach(function() {
    $('#fixtures').empty();
    form = $('<form action="/"></form>').appendTo($('#fixtures'));
    formBaseBehavior = form.remote().data('remote');
    formBehavior = formBaseBehavior.element.data('remoteForm');
    link = $('<a></a>').attr({
      href: 'something.html'
    });
    linkBaseBehavior = link.remote().data('remote');
    linkBehavior = linkBaseBehavior.element.data('remoteLink');
  });
  
  describe('$.ujs.remote', function() {
    it('attaches remoteForm if element is form', function() {
      spyOn(formBaseBehavior.element, 'remoteForm');
      form.remote();
      expect(formBaseBehavior.element.remoteForm).wasCalled();
    });

    it('attaches remoteLink if element is a link', function() {
      spyOn(linkBaseBehavior.element, 'remoteLink');
      link.remote();
      expect(linkBaseBehavior.element.remoteLink).wasCalled();
    });
  });

  describe('$.ujs.remoteLink', function() {

    it('calls ajax with url of the href of the link', function() {
      spyOn(jQuery, 'ajax');
      link.click();
      var expectedOptions = $.extend(link.data('remoteLink').ajaxOptions, {
        url: link.attr('href'),
        type: 'GET'
      });
      expect(jQuery.ajax).wasCalledWith(expectedOptions);
    });
  });

  describe('$.ujs.remoteForm', function() {
    it('calls ajax with action, method and data of the form', function() {
      spyOn(jQuery, 'ajax');
      form.attr('method', 'POST');
      form.submit();
      var expectedOptions = $.extend(form.data('remoteForm').ajaxOptions, {
        url: form.attr('action'),
        type: form.attr('method'),
        data: form.serializeArray()
      });
      expect(jQuery.ajax).wasCalledWith(expectedOptions);
    });

    it('stores the submit target as this._submitButton', function() {
      form.click();
      expect(formBehavior._submitButton).toEqual(form[0]);
    });

    it('adds the name and value of submit button', function() {
      spyOn(jQuery, 'ajax');
      var button = $('<input/>').attr({
        type: 'submit',
        name: 'submit',
        value: 'submit'
      });

      formBehavior._submitButton = button[0];
      var expectedOptions = $.extend(form.data('remoteForm').ajaxOptions, {
        url: form.attr('action'),
        type: form.attr('method'),
        data: form.serializeArray(),
        name: button.attr('name'),
        value: button.attr('value')
      });

      form.submit();
      expect(jQuery.ajax).wasCalledWith(expectedOptions);
    });
  });

});
