/*
 * Copyright (c) 2020 John Nahlen
 */

const parsePhoneNumberFromString = require('libphonenumber-js').parsePhoneNumberFromString;

const convertPhoneNumberToNational = function(phoneNumber) {
	if (phoneNumber === null) {
		return null;
	}
	const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber,'US');
	return parsedPhoneNumber.format('NATIONAL');
};
module.exports = convertPhoneNumberToNational;
