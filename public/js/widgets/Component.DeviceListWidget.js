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
const DeviceListWidget = function(element) {
	'use strict';

	this.element = element;

	let devicesByUuid = {};

	let deviceRowTemplate = Handlebars.compile("<tr data-id=\"\{{uuid}}\"><td>\{{name}}</td><td>\{{description}}</td><td>\{{phoneNumber}}</td><td><a data-role=\"editBtn\">Edit</a> <a data-role=\"deleteBtn\">Delete</a></td></tr>");
	this.addDevice = function(device) {
		devicesByUuid[device['uuid']] = _.clone(device);
		if (device['phoneNumber']) {
			device['phoneNumber'] = convertPhoneNumberToNational(device['phoneNumber']);
		}
		this.element.find('table > tbody').append($(deviceRowTemplate(device)));
	}.bind(this);

	this.updateDeviceByUuid = function(device) {
		devicesByUuid[device['uuid']] = _.clone(device);
		if (device['phoneNumber']) {
			device['phoneNumber'] = convertPhoneNumberToNational(device['phoneNumber']);
		}
		this.element.find('table > tbody > tr[data-id="' + device['uuid'] + '"]').html($(deviceRowTemplate(device)).html());
	}.bind(this);

	this.removeDeviceByUuid = function(uuid) {
		delete devicesByUuid[uuid];
		this.element.find('table > tbody > tr[data-id="' + uuid + '"]').remove();
	}.bind(this);

	this.element.on('click','tr a[data-role="editBtn"]',function(e) {
		let uuid = $(e.target).closest('tr').attr('data-id');

		let createEditDeviceModal = new CreateEditDeviceModal({
			mode: 'Edit',
			object: devicesByUuid[uuid],
			title: 'Update Device',
			saveBtnText: 'Update',
			saveCallback: function(device) {
				updateDevice(device).then(function(_device) {
					this.updateDeviceByUuid(device);
				}.bind(this));
			}.bind(this)
		});
		createEditDeviceModal.load().then(function() {
			createEditDeviceModal.show();
		});
	}.bind(this));

	this.element.on('click','tr a[data-role="deleteBtn"]',function(e) {
		let uuid = $(e.target).closest('tr').attr('data-id');

		let confirmActionModal = new ConfirmActionModal({
			title: 'Delete Device',
			message: 'Are you sure you want to delete this device?',
			saveCallback: function() {
				deleteDevice(uuid).then(function() {
					this.removeDeviceByUuid(uuid);
				}.bind(this));
			}.bind(this)
		});
		confirmActionModal.load().then(function() {
			confirmActionModal.show();
		});
	}.bind(this));
};
