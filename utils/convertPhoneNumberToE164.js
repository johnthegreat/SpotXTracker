/*
 * Copyright (c) 2019-2020 John Nahlen
 */

const parsePhoneNumber = require('libphonenumber-js').parsePhoneNumber;

const convertPhoneNumberToE164 = function(phoneNumber) {
	if (phoneNumber === null) {
		return null;
	}
	const phoneNumberObj = parsePhoneNumber(phoneNumber,'US');
	// https://github.com/catamphetamine/libphonenumber-js
	// Per docs, already in E.164: number: string — The phone number in E.164 format.
	return phoneNumberObj.number;
};
module.exports = convertPhoneNumberToE164;
