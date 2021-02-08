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

const _ = require('lodash');
const moment = require('moment');
const createUuid = require('../utils/createUuid');
const deviceProvider = require('./lib/DeviceProvider');

// ^(.*)Lat: (.*)\s+Long: (.*)\s+Alt: (.*)m\s+\|\s+(\d+) ft\s+(.*)$
const regExp = new RegExp('^(.*)Lat: (-?[\\d|.]*)\\s+Long: (-?[\\d|.]*)\\s+(Alt: (-?[\\d|.]*) m\\s+\\|\\s+(-?\\d+) ft\\s+)?(https?:\\/\\/.*)$','s');
const gpsLocationProvider = require('./lib/GpsLocationProvider');
const GpsCheckInLocation = require('../models/GpsCheckInLocation');

exports.post = async function (req,res) {
	if (!_.hasIn(req.body,'From') || !_.isString(req.body.From)) {
		res.status(400).send();
		return;
	}

	try {
		/**
		 * @type {Device}
		 */
		const device = await deviceProvider.getDeviceByPhoneNumber(req.body.From);
		if (device === null) {
			res.status(204).send();
			return;
		}

		const text = req.body.Body.trim();
		const matches = regExp.exec(text);
		if (matches.length > 0) {
			const gpsCheckInLocation = new GpsCheckInLocation();
			gpsCheckInLocation.uuid = createUuid();
			gpsCheckInLocation.source = device.name;
			gpsCheckInLocation.message = matches[1].trim();
			gpsCheckInLocation.lat = matches[2].trim();
			gpsCheckInLocation.lng = matches[3].trim();
			if (matches[4] !== undefined && matches[5] !== undefined && matches[6] !== undefined) {
				gpsCheckInLocation.altMeters = matches[5].trim();
				gpsCheckInLocation.altFeet = matches[6].trim();
			}
			gpsCheckInLocation.mapUrl = matches[7].trim();
			gpsCheckInLocation.timestamp = moment.utc().format('YYYY-MM-DD HH:mm:ss');

			await gpsLocationProvider.createGpsLocation(gpsCheckInLocation);
		}
		res.status(204).send();
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Error');
	}
};

module.exports = exports;
