(function($, ko){
	"use strict";

	var Item = function(name, value) {
		var self = this;

		self.name = ko.observable(name);
		self.value = ko.observable(value);
	};

	var MagicFormViewModel = function() {
		var self = this;

		self.type = ko.observable("GET");
		self.url = ko.observable();
		self.params = ko.observableArray();
		self.response = ko.observable("");
		self.json = ko.observable(false);
		self.loading = ko.observable(false);

		self.addParam = function() {
			self.params.push(new Item("", ""));
		}

		self.removeParam = function(item) {
			self.params.remove(item);
		}

		self.submit = function() {
			self.loading(true);

			var setting = {
				url: formatUrl(self.url()),
				type: self.type(),
				crossDomain: true,
				xhrFields: {
					withCredentials: true
				},
				success: function(data){
					self.loading(false);
					self.response(data);
				},
				error: function(jqXHR){
					var msg = "Oh no something went wrong! \n";

					$.each(jqXHR, function(index, value){
						if (!$.isFunction(value)) {
							msg += index + ": " + value + "\n";
						}
					});

					self.response(msg);
					self.loading(false);
				}
			}

			if (self.params().length > 0) {
				setting.data = toSubmitData(self.params(), self.json());
			}

			$.ajax(setting);
		};

		function formatUrl(url) {
			if (url && url.match("^http:\/\/|^https:\/\/") === null) {
				return "http://" + url;
			} else {
				return url;
			}
		}

		function toSubmitData(array, isJSON) {
			var data = {};

			isJSON = isJSON || false;

			$.each(array, function(index, value){
				data[value.name()] = value.value();
			})

			if (isJSON) {
				return JSON.stringify(data);
			} else {
				return data;
			}
		}

	};

	$(function(){
		ko.applyBindings(new MagicFormViewModel());

		ko.bindingHandlers.showPreloader = {
			update: function(element, loading) {
				if (loading()) {
					$(element).fadeIn("slow");
				} else {
					$(element).fadeOut("slow");
				}
			}
		}

		ko.bindingHandlers.showResponse = {
			update: function(element, loading) {
				if (!loading()) {
					$(element).delay(1000).fadeIn("slow");
				} else {
					$(element).hide();
				}
			}
		}
	});
}(jQuery, ko));
