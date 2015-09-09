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


Template.simpleMessages.helpers({
  messages: function () {
    place = Template.instance().data.place
    if (simpleMessages.find({place:place}).count() && SimpleMessages.options.autoScroll)
      $('html, body').animate({
        scrollTop: 0
      }, 200);
    var messages = simpleMessages.find({place:place}).fetch();
    $.each(messages, function(index, value) {
      value.group = value.message instanceof Array;
    });
    return messages;
  }
});

Template.simpleMessageItem.rendered = function () {
  var message = this.data;
  Meteor.defer(function() {
    simpleMessages.update(message._id, {$set: {seen: true}});
  });
  if (message.options && message.options.autoHide) {
    var $alert = $(this.find('.alert'));
    Meteor.setTimeout(function() {
        $alert.fadeOut(400, function() {
          simpleMessages.remove({_id: message._id});
        });
      },
      message.options.hideDelay);
  }
};

Template.simpleMessageItem.events({
  "click .close": function (e, tmpl) {
    e.preventDefault();
    simpleMessages.remove(tmpl.data._id);
  }
});
