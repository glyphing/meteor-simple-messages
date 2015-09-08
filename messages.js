/**
 * { place: String,
 *   message: String,
 *   style: String,
 *   seen: Boolean }
 */
simpleMessages = new Mongo.Collection(null);

SimpleMessages = {
  sendWarning: function(place, message, options) {
    sendMessage(place, message, 'alert-warning', options);
  },
  sendError: function(place, message, options) {
    sendMessage(place, message, 'alert-error alert-danger', options);
  },
  sendSuccess: function(place, message, options) {
    sendMessage(place, message, 'alert-success', options);
  },
  sendInfo: function(place, message, options) {
    sendMessage(place, message, 'alert-info', options);
  },
  clear: function(place) {
    simpleMessages.remove({place: place , seen: true});
  },
  configure: function(options) {
    this.options = this.options || {};
    _.extend(this.options, options);
  },
  options: {
    autoHide: true,
    hideDelay: 5000,
    autoScroll: true
  }
}

sendMessage = function(place, message, style, options) {
  options = options || {};
  options.autoHide = options.autoHide === undefined ? SimpleMessages.options.autoHide : options.autoHide;
  options.hideDelay = options.hideDelay || SimpleMessages.options.hideDelay;
  simpleMessages.insert({ place: place, message: message, style: style, seen: false, options: options});
}


Template.flashMessages.helpers({
  messages: function () {
    if (flashMessages.find().count() && FlashMessages.options.autoScroll)
      $('html, body').animate({
        scrollTop: 0
      }, 200);
    var messages = flashMessages.find().fetch();
    $.each(messages, function(index, value) {
      value.group = value.message instanceof Array;
    });
    return messages;
  }
});

Template.flashMessageItem.rendered = function () {
  var message = this.data;
  Meteor.defer(function() {
    flashMessages.update(message._id, {$set: {seen: true}});
  });
  if (message.options && message.options.autoHide) {
    var $alert = $(this.find('.alert'));
    Meteor.setTimeout(function() {
        $alert.fadeOut(400, function() {
          flashMessages.remove({_id: message._id});
        });
      },
      message.options.hideDelay);
  }
};

Template.flashMessageItem.events({
  "click .close": function (e, tmpl) {
    e.preventDefault();
    flashMessages.remove(tmpl.data._id);
  }
});
