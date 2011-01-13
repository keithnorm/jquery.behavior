$.behavior('ujs.remote', {
  _init: function() {
    if(this.element.attr('nodeName').toLowerCase() === 'form'){
      this.element.remoteForm(this.options);
    }
    else
      this.element.remoteLink(this.options);
  }
});

$.behavior('ujs.remoteBase', {
  _init: function() {
    var self = this;
    this.ajaxOptions = {
      beforeSend: function(xhr) {
        if(self._trigger('beforeSend') === false) {
          return false;
        }
      },
      success: function(response) {
        self._trigger('success', null, response);
      },
      complete: function(xhr) {
        self._trigger('complete', null, xhr);
      },
      error: function(xhr, status, error) {
        self._trigger('error', null, [xhr, status, error]);
      }
    };
  },

  _makeRequest : function(options) {
    $.ajax(options);
    return false;
  }
});

$.behavior('ujs.remoteLink', $.ujs.remoteBase, {
  click: function() {
    var ajaxOptions = $.extend({
      url: this.element.attr('href'),
      type: 'GET'
    }, this.ajaxOptions);
    return this._makeRequest(ajaxOptions);
  }
});

$.behavior('ujs.remoteForm', $.ujs.remoteBase, {
  click: function(e) {
    this._submitButton = e.target;
  },

  submit: function() {
    var data = this.element.serializeArray();
    if(this._submitButton && $(this._submitButton).attr('value'))
      data.push({
        name: this._submitButton.name,
        value: this._submitButton.value
      });

    var ajaxOptions = $.extend({
      url: this.element.attr('action'),
      type: this.element.attr('method') || 'GET',
      data: data
    }, this.ajaxOptions);

    this._makeRequest(ajaxOptions);
    return false;
  }

});

$.behavior('ujs.railsBase', {
  options: {
    csrfToken: $('meta[name=csrf-token]').attr('content'),
    csrfParam: $('meta[name=csrf-param]').attr('content')
  }
});

$.behavior('ujs.formLink', $.ujs.railsBase, {
  _init: function() {
    this.options= $.extend(this.options, {
      form: {
        method: 'post',
        href: this.element.attr('href')
      },
      meta: {
        name: '_method',
        value: this.element.data('method'),
        type: 'hidden'
      }
    });
  },

  click: function(e) {
    e.preventDefault();
    var form = $('<form/>').attr(this.options.form).append($('<input/>').attr(this.options.meta));

    if (this.options.csrfParam && this.options.csrfToken) {
      form.append($('<input/>').attr({
        name: 'csrf_param',
        value: this.options.csrfToken,
        type: 'hidden'
      }));
    }
    form.hide().appendTo('body').submit();
  }
});

$.behavior('ujs.confirm', {
  click: function(e) {
    if(!confirm(this.element.data('confirm')))
      return false;
  }
});

$(function() {
  $('[data-confirm]').confirm();
  $('[data-remote]').remote();
  $('a[data-method]:not([data-remote])').formLink();
});
