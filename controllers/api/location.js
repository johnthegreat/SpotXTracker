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
const gpsLocationProvider = require('../lib/GpsLocationProvider');

const getDateFieldFromQuery = function(req, name) {
	if (_.has(req.query, name) &&
		_.isString(req.query[name]) &&
		/\d{4}-\d{2}-\d{2}/.test(req.query[name])) {
		return req.query[name];
	}
	return null;
}

exports.getLocations = async function(req,res) {
	try {
		let locations;
		const startDate = getDateFieldFromQuery(req, 'startDate');
		const endDate = getDateFieldFromQuery(req, 'endDate');
		if (startDate && endDate) {
			locations = await gpsLocationProvider.getGpsLocationsByDateRange(startDate,endDate);
		} else {
			locations = await gpsLocationProvider.getGpsLocations();
		}
		res.status(200).send(locations);
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Error');
	}
};

exports.deleteLocation = async function(req,res) {
	const uuid = req.params.uuid;
	if (_.isEmpty(uuid)) {
		res.status(400).send();
		return;
	}

	try {
		const gpsLocation = await gpsLocationProvider.getGpsLocationByUuid(uuid);
		if (gpsLocation === null) {
			res.status(404).send();
			return;
		}

		await gpsLocationProvider.deleteGpsLocationByUuid(uuid);
		res.status(204).send();
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Error');
	}
};

module.exports = exports;
