$.behavior('ujs.remote', {
  _init: function(options) {
    if(this.element.attr('nodeName').toLowerCase() === 'form'){
      this.element.remoteForm(options);
    }
    else
      this.element.remoteLink(options);
  }
});

$.behavior('ujs.remoteBase', {
  _init: function(options) {
    var self = this;
    this.options = $.extend({
      beforeSend: function(xhr) {
        if(self.element.trigger('beforeSend') === false) {
          return false;
        }
      },
      success: function(data, status, xhr) {
        self.element.trigger('success', [data, status, xhr]);
      },
      complete: function(xhr) {
        self.element.trigger('complete', xhr);
      },
      error: function(xhr, status, error) {
        self.element.trigger('error', [xhr, status, error]);
      }
    }, options);
  },

  _makeRequest : function(options) {
    $.ajax(options);
    return false;
  }
});

$.behavior('ujs.remoteLink', $.ujs.remoteBase, {
  onclick: function() {
    var options = $.extend({
      url: this.element.attr('href'),
      type: 'GET'
    }, this.options);
    return this._makeRequest(options);
  }
});

$.behavior('ujs.remoteForm', $.ujs.remoteBase, {
  onclick: function(e) {
    this._submitButton = e.target;
  },

  onsubmit: function() {
    var data = this.element.serializeArray();
    if(this._submitButton && $(this._submitButton).attr('value'))
      data.push({
        name: this._submitButton.name,
        value: this._submitButton.value
      });

    var options = $.extend({
      url: this.element.attr('action'),
      type: this.element.attr('method') || 'GET',
      data: data
    }, this.options);

    this._makeRequest(options);
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

  onclick: function(e) {
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
  onclick: function(e) {
    if(!confirm(this.element.data('confirm')))
      return false;
  }
});
