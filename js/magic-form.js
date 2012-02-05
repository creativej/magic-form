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
		self.url = ko.observable("https://api.github.com/user/repos");
		self.params = ko.observableArray();
		self.response = ko.observable("");
		self.json = ko.observable(false);

		self.addParam = function() {
			self.params.push(new Item("", ""));
		}

		self.removeParam = function(item) {
			self.params.remove(item);
		}

		self.submit = function() {
			var setting = {
				url: self.url(),
				type: self.type(),
				crossDomain: true,
				xhrFields: {
					withCredentials: true
				},
				success: function(data){
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
				}
			}

			if (self.params().length > 0) {
				setting.data = toSubmitData(self.params(), self.json());
			}

			var request = $.ajax(setting);
		};

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
	});
}(jQuery, ko));
