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
const CheckInsListWidget = function(element,opts) {
	'use strict';

	let widget = this;
	let checkInsByUuid = {};
	opts = _.extend({
		onViewOnMapClick: _.noop
	},opts);

	this.element = element;
	let checkInTemplate = Handlebars.compile("<tr data-id=\"{{uuid}}\"><td>\{{source}}</td><td>\{{message}}</td><td>(<a href=\"https://www.google.com/maps/search/?api=1&query=\{{lat}},%20\{{lng}}\" target=\"_blank\">\{{lat}}, \{{lng}}</a>)\{{#if altFeet}} @ \{{altFeet}} ft.\{{/if}}</td><td>\{{timestamp}}</td><td><a href=\"\{{mapUrl}}\" target=\"_blank\">\{{mapUrl}}</a></td><td><a data-role=\"viewOnMapBtn\">View</a></td><td><a data-role=\"deleteBtn\">Delete</a></td></tr>");
	this.addCheckIn = function(checkInData) {
		checkInData = _.clone(checkInData);
		checkInsByUuid[checkInData['uuid']] = checkInData;

		if (_.isString(checkInData['timestamp']) && checkInData['timestamp'].length > 0) {
			checkInData['timestamp'] = moment.utc(checkInData['timestamp'],"YYYY-MM-DD HH:mm:ss").tz(TIMEZONE).format("MMM DD, YYYY hh:mm:ss A");
		}
		this.element.find("table > tbody").append($(checkInTemplate(checkInData)));
	}.bind(this);

	this.deleteCheckInByUuid = function(uuid) {
		delete checkInsByUuid[uuid];
		this.element.find('table > tbody > tr[data-id="' + uuid + '"]').remove();
	}.bind(this);

	this.element.on('click','a[data-role="viewOnMapBtn"]',function(e) {
		let uuid = $(e.target).closest("tr[data-id]").attr("data-id");
		if (_.isFunction(opts.onViewOnMapClick)) {
			opts.onViewOnMapClick(checkInsByUuid[uuid]);
		}
	}.bind(this));

	this.element.on('click','a[data-role="deleteBtn"]',function(e) {
		let uuid = $(e.target).closest("tr[data-id]").attr("data-id");
		let confirmActionModal = new ConfirmActionModal({
			title: 'Delete Check In',
			message: 'Are you sure you would like to delete this check in?',
			saveCallback: function() {
				deleteLocationByUuid(uuid).then(function() {
					widget.deleteCheckInByUuid(uuid);
				}).catch(function(err) {
					console.log(err);
				});
			}
		});
		confirmActionModal.load().then(function() {
			confirmActionModal.show();
		});
	});
};
