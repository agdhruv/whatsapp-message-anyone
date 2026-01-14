(function () {
	// Initialize intl-tel-input
	const input = document.querySelector("#phone");
	const iti = window.intlTelInput(input, {
		initialCountry: "in",
		nationalMode: true,
		formatOnDisplay: true,
		placeholderNumberType: "MOBILE",
		validationNumberType: "MOBILE",
		showSelectedDialCode: true
	});

	// Form submission
	$('#main_form').on('submit', function (e) {
		e.preventDefault();

		const $errorMsg = $('.error-message');
		$errorMsg.text('');
		$('#phone').removeClass('invalid');

		// Check if input is empty
		if (!input.value.trim()) {
			$('#phone').addClass('invalid');
			$errorMsg.text('Please enter a phone number');
			input.focus();
			return;
		}

		// Validate the number
		if (!iti.isValidNumber()) {
			$('#phone').addClass('invalid');
			const errorCode = iti.getValidationError();
			const errorMap = {
				0: "Invalid number",
				1: "Invalid country code",
				2: "Number is too short",
				3: "Number is too long",
				4: "Invalid number",
				5: "Invalid number length"
			};
			$errorMsg.text(errorMap[errorCode] || "Invalid phone number");
			input.focus();
			return;
		}

		// Get the number in E.164 format (e.g., +919876543210)
		const fullNumber = iti.getNumber();
		// Remove the '+' for WhatsApp API
		const numberForWhatsApp = fullNumber.replace('+', '');

		window.open(`https://api.whatsapp.com/send?phone=${numberForWhatsApp}`);
	});
})();
