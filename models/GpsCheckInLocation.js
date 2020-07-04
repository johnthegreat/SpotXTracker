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

const GpsCheckInLocation = function() {
	this.uuid = null;
	this.source = null;
	this.message = null;
	this.lat = null;
	this.lng = null;
	this.altMeters = null;
	this.altFeet = null;
	this.mapUrl = null;
	this.timestamp = null;
};
GpsCheckInLocation.create = function(obj) {
	const gpsCheckInLocation = new GpsCheckInLocation();
	gpsCheckInLocation.uuid = obj.uuid ? obj.uuid : null;
	gpsCheckInLocation.source = obj.source ? obj.source : null;
	gpsCheckInLocation.message = obj.message ? obj.message : null;
	gpsCheckInLocation.lat = obj.lat ? obj.lat : null;
	gpsCheckInLocation.lng = obj.lng ? obj.lng : null;
	gpsCheckInLocation.altMeters = obj.altMeters ? obj.altMeters : null;
	gpsCheckInLocation.altFeet = obj.altFeet ? obj.altFeet : null;
	gpsCheckInLocation.mapUrl = obj.mapUrl ? obj.mapUrl : null;
	gpsCheckInLocation.timestamp = obj.timestamp ? obj.timestamp : null;
	return gpsCheckInLocation;
};
module.exports = GpsCheckInLocation;
