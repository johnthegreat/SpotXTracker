/*
 * SpotXTracker - Upload and track your Spot X coordinates
 * Copyright (c) 2021 John Nahlen
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

const _ = require('lodash');
const moment = require('moment');
const createUuid = require('../utils/createUuid');
const deviceProvider = require('./lib/DeviceProvider');

const gpsLocationProvider = require('./lib/GpsLocationProvider');
const GpsCheckInLocation = require('../models/GpsCheckInLocation');

/*
 * PARAMETERS:
 *
 * - deviceName (Required)
 * - message (Optional)
 * - latitude (Required)
 * - longitude (Required)
 * - altitude (Optional)
 */
exports.upload = async function (req,res) {
	if (!_.hasIn(req.body,'deviceName') || !_.isString(req.body['deviceName'])) {
		res.status(400).send();
		return;
	}

	try {
		/**
		 *
		 * @type {null|Device}
		 */
		const device = await deviceProvider.getDeviceByName(req.body['deviceName']);
		if (device === null) {
			res.status(400).send();
			return;
		}

		const gpsCheckInLocation = new GpsCheckInLocation();
		gpsCheckInLocation.uuid = createUuid();
		gpsCheckInLocation.source = device.name;
		gpsCheckInLocation.message = _.isString(req.body.message) && !_.isEmpty(req.body.message) ? req.body.message : null;
		gpsCheckInLocation.lat = _.isNumber(req.body.latitude) && _.isFinite(req.body.latitude) ? req.body.latitude : null;
		gpsCheckInLocation.lng = _.isNumber(req.body.longitude) && _.isFinite(req.body.longitude) ? req.body.longitude : null;
		if ((_.isString(req.body.altitude) || _.isNumber(req.body.altitude))) {
			gpsCheckInLocation.altMeters = parseInt(req.body.altitude);
			// 1 Meter = ~3.281 Feet
			gpsCheckInLocation.altFeet = Math.round(gpsCheckInLocation.altMeters * 3.281);
		}
		gpsCheckInLocation.mapUrl = null;
		gpsCheckInLocation.timestamp = moment.utc().format('YYYY-MM-DD HH:mm:ss');

		await gpsLocationProvider.createGpsLocation(gpsCheckInLocation);

		res.status(204).send();
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Error');
	}
};

module.exports = exports;
