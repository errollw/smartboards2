/*

jQuery plugin to display a message on the screen

Example Usage

Set options:
	$.simpleMessage({
		container: {
			css:{ 
				background:"rgba(255,0,0,0.4)"
			}
		}
	});

Show the default message:
	$.simpleMessage("show");

Show a custom message:
	$.simpleMessage("show", "Hi there!");

Hide the message:
	$.simpleMessage("hide");

Briefly flash a message on the screen:
	$.simpleMessage("flashMessage", "Banana!");

Remove the container from the DOM:
	$.simpleMessage("destroy");

*/
;
(function ($, window, document, undefined) {
	var console = this.console || {
			log: $.noop,
			warn: $.noop
		}, // http://api.jquery.com/jQuery.noop/
		defaults = {
			// Callbacks:
			onInit: $.noop, // After plugin data initialized.
			onAfterInit: $.noop, // After plugin initialization.
			onShow: $.noop,
			onHide: $.noop,
			// Settings
			container: {
				attr: {},
				css: {
					"display": "none",
					"position": "fixed",
					"top": 0,
					"left": 0,
					"right": 0,
					"bottom": 0,
					"background": "rgba(0,0,0,0.4)",
					"z-index": 9999
				},
				onClick: function() {
					variables.container.stop(true,true);
					methods.hide();
				}
			},
			inner: {
				attr: {},
				css: {
					"position": "fixed",
					"top": "50%",
					"left": "50%",
					"margin-top": "-25px",
					"margin-left": "-150px",
					"width": "300px",
					"height":"50px",
					"background": "white",
					"border": "1px solid #DDD",
					"text-align": "center",
					"line-height": "50px",
					"border-radius": "2px"
				},
				onClick: function(e) {
					e.stopPropagation();
				}
			},
			defaultMessage: "",
			showAnimation: function(el) {
				el.fadeIn();
			},
			hideAnimation: function(el) {
				el.fadeOut();
			},
			messageDuration: 1500
		},
		settings = {},
		variables = {
			initialised: false
		},
		methods = {
			init: function (options) {
				settings = $.extend(true, {}, defaults, options);
				settings.onInit.call(this);
				
				variables.container = variables.container || $("<div/>");
				variables.container.attr(settings.container.attr).css(settings.container.css).on("click", settings.container.onClick);
				
				variables.inner = variables.inner || $("<div/>");
				variables.inner.attr(settings.inner.attr).css(settings.inner.css).on("click", settings.inner.onClick);
				
				variables.container.prepend(variables.inner);
				$("body").prepend(variables.container);
				
				variables.initialised = true;
				settings.onAfterInit.call(this);
				return this; // Is this needed for chaining?
			},
			show: function(aMessage, callback) {
				var message = aMessage ? aMessage : settings.defaultMessage;
				variables.inner.html(message);
				settings.showAnimation.call(this, variables.container);
				if (callback) callback.call(this, variables.container);
				settings.onShow.call(this, variables.container);
				return this;
			},
			hide: function(aMessage, callback) {
				settings.hideAnimation.call(this, variables.container);
				if (callback) callback.call(this, variables.container);
				settings.onHide.call(this, variables.container);
				return this;
			},
			flashMessage: function(aMessage, callback) {
				methods.show(aMessage, function(e) {
					e.delay(settings.messageDuration);
					methods.hide();
				});
				if (callback) callback.call(this, variables.container);
				return this;
			},
			// Might need to give users the option to destroy what this plugin created:
			destroy: function () {
				// Undo things here.
				variables.inner.remove();
				variables.container.remove();
				variables = {
					initialised: false
				};
			}
		};
	
	// Method calling logic/boilerplate:
	$.simpleMessage = function (method) {
		if (methods[method]) {
			// Initialise if not already
			if (variables.initialised == false) methods.init.apply(this);
			// Call the desired method
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if ((typeof method === 'object') || (!method)) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.simpleMessage.');
		}
	};
}(jQuery, window, document));