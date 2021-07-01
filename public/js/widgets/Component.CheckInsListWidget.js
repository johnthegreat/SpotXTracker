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

	const widget = this;
	let checkInsByUuid = {};
	opts = _.extend({
		onViewOnMapClick: _.noop
	},opts);

	this.element = element;
	const $bulkDeleteBtn = this.element.find('#bulkDeleteBtn');
	const checkInTemplate = Handlebars.compile("<tr data-id=\"{{uuid}}\"><td class=\"hidden-print\"><input type=\"checkbox\" name=\"checkboxes[]\"></td><td class=\"nowrap\">\{{source}}</td><td>\{{message}}</td><td>(<a href=\"https://www.google.com/maps/search/?api=1&query=\{{lat}},%20\{{lng}}\" target=\"_blank\" rel=\"noopener noreferrer\">\{{lat}}, \{{lng}}</a>)\{{#if altFeet}} @ \{{altFeet}} ft.\{{/if}}</td><td>\{{timestamp}}</td></td><td class=\"hidden-print\"><button class=\"btn btn-sm btn-default\" data-role=\"viewOnMapBtn\">View</button> <button class=\"btn btn-sm btn-danger\" data-role=\"deleteBtn\">Delete</button></td></tr>");
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

	this.element.on('click','button[data-role="viewOnMapBtn"]',function(e) {
		const uuid = $(e.target).closest("tr[data-id]").attr("data-id");
		if (_.isFunction(opts.onViewOnMapClick)) {
			opts.onViewOnMapClick(checkInsByUuid[uuid]);
		}
	}.bind(this));

	this.element.on('click','button[data-role="deleteBtn"]',function(e) {
		const uuid = $(e.target).closest("tr[data-id]").attr("data-id");
		const confirmActionModal = new ConfirmActionModal({
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

	this.getSelectedIds = function() {
		return this.element.find('tr[data-id] input[type="checkbox"]:checked').map(function(idx, el) {
			return $(el).closest('tr[data-id]').attr('data-id');
		});
	};

	this.selectAll = function() {
		this.element.find('tr[data-id] input[type="checkbox"]').each(function(idx, el) {
			$(el).prop('checked', true);
		});
	};

	this.deselectAll = function() {
		this.element.find('tr[data-id] input[type="checkbox"]').each(function(idx, el) {
			$(el).prop('checked', false);
		});
	};

	this.clear = function() {
		checkInsByUuid = {};
		this.element.find('tbody > tr[data-id]').remove();
	}.bind(this);

	function toggleDeleteBtn() {
		if (widget.getSelectedIds().length > 0) {
			$bulkDeleteBtn.removeAttr('disabled');
		} else {
			$bulkDeleteBtn.attr('disabled', 'disabled');
		}
	}

	this.element.on('change','tr[data-id] input[type="checkbox"]',function(e) {
		toggleDeleteBtn();
	});

	$bulkDeleteBtn.on('click', function() {
		const uuids = widget.getSelectedIds();

		const confirmActionModal = new ConfirmActionModal({
			title: 'Confirm Delete Check Ins',
			message: 'Are you sure you would like to delete these check ins?',
			saveCallback: function() {
				async.series(_.map(uuids, function(uuid) {
					return function(next) {
						deleteLocationByUuid(uuid).then(function() {
							widget.deleteCheckInByUuid(uuid);
							next();
						}).catch(function(err) {
							console.log(err);
							next(err);
						});
					}
				}));
			}
		});
		confirmActionModal.load().then(function() {
			confirmActionModal.show();
		});
	});

	$('#selectAllBtn').on('click', function() {
		this.selectAll();
		toggleDeleteBtn();
	}.bind(this));

	$('#deselectAllBtn').on('click', function() {
		this.deselectAll();
		toggleDeleteBtn();
	}.bind(this));
};
