/*
 * SpotXTracker - Upload and track your Spot X coordinates
 * Copyright (c) 2020 John Nahlen
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/* eslint-disable */
const getDevices = function() {
	return new Promise(function(resolve, reject) {
		$.ajax({
			method: 'get',
			url: '/api/device',
			success: resolve,
			error: reject
		});
	});
};

const createDevice = function(device) {
	return new Promise(function(resolve, reject) {
		$.ajax({
			method: 'post',
			url: '/api/device',
			data: device,
			success: resolve,
			error: reject
		});
	});
};

const updateDevice = function(device) {
	return new Promise(function(resolve, reject) {
		$.ajax({
			method: 'put',
			url: '/api/device/'+device.uuid,
			data: device,
			success: resolve,
			error: reject
		});
	});
};

const deleteDevice = function(uuid) {
	return new Promise(function(resolve, reject) {
		$.ajax({
			method: 'delete',
			url: '/api/device/'+uuid,
			success: resolve,
			error: reject
		});
	});
};

function convertPhoneNumberToNational(phoneNumber) {
	'use strict';

	if (phoneNumber === null) {
		return null;
	}

	let phoneNumberObj = libphonenumber.parsePhoneNumber(phoneNumber,'US');
	return phoneNumberObj.format('NATIONAL');
}

function convertPhoneNumberToE164(phoneNumber) {
	'use strict';

	if (phoneNumber === null) {
		return null;
	}
	let phoneNumberObj = libphonenumber.parsePhoneNumber(phoneNumber,'US');
	return phoneNumberObj.format('E.164');
}

$(window).on('load',function() {
	const deviceListWidget = new DeviceListWidget($('#deviceListWidget'));

	getDevices().then(function(devices) {
		_.each(devices,function(device) {
			deviceListWidget.addDevice(device);
		});
	});

	$('#createDeviceBtn').on('click',function() {
		const createDeviceModal = new CreateEditDeviceModal({
			mode: 'Create',
			saveCallback: function(device) {
				createDevice(device).then(function(_device) {
					deviceListWidget.addDevice(_device);
				});
			}
		});
		createDeviceModal.load().then(function() {
			createDeviceModal.show();
		});
	});
});
