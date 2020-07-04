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

const Device = function() {
	/**
	 *
	 * @type {null|string}
	 */
	this.uuid = null;
	/**
	 *
	 * @type {null|string}
	 */
	this.name = null;
	/**
	 *
	 * @type {null|string}
	 */
	this.description = null;
	/**
	 *
	 * @type {null|string}
	 */
	this.phoneNumber = null;
};
/**
 *
 * @param obj
 * @returns {null|Device}
 */
Device.create = function(obj) {
	if (!obj) {
		return null;
	}

	const device = new Device();
	device.uuid = obj.uuid ? obj.uuid : null;
	device.name = obj.name ? obj.name : null;
	device.description = obj.description ? obj.description : null;
	device.phoneNumber = obj.phoneNumber ? obj.phoneNumber : null;
	return device;
};
module.exports = Device;
