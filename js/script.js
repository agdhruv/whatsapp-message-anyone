(function () {

	var generateAutocompleteOptions = function (countries, codes) {
		var obj = {};

		for (var country in countries) {
			var code = codes[countries[country]];
			obj[`${country} (${code})`] = null;
		}

		return obj;
	};

	var countryOptions;

	$.getJSON('js/country_names.json', function (data) {
		var country_names = data;
		$.getJSON('js/country_codes.json', function (data) {
			var country_codes = data;

			countryOptions = generateAutocompleteOptions(country_names, country_codes)

			$('input.autocomplete').autocomplete({
				data: countryOptions
			});
		});
	});

	$('#main_form').on('submit', function (e) {
		e.preventDefault();

		var $this = $(this),
			country = $this.find('#autocomplete-input').val().trim(),
			country_code = country.substring(country.indexOf('(') + 1, country.length - 1),
			mobile_number = $this.find('#mobile_number').val().trim();

		var countryOptionsKeys = Object.keys(countryOptions);

		if ($.inArray(country, countryOptionsKeys) === -1) {
			$('#autocomplete-input').addClass('invalid').focus().select();
			$('#autocomplete-input ~ .helper-text').attr('data-error', 'Please choose a country from the options');
			return;
		}

		if (mobile_number.length === 0) {
			$('#mobile_number').addClass('invalid').focus().select();
			$('#mobile_number ~ .helper-text').attr('data-error', 'This is a required field');
			return;
		}

		// test if the mobile number has all digits or not
		var isDigits = /^[0-9]+$/.test(mobile_number);
		if (!isDigits) {
			$('#mobile_number').addClass('invalid').focus().select();
			$('#mobile_number ~ .helper-text').attr('data-error', 'Please enter only numbers');
			return;
		}

		window.open(`https://api.whatsapp.com/send?phone=${country_code}${mobile_number}`);
	});
})();