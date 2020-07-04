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

exports.getLocations = async function(req,res) {
	try {
		res.status(200).send(await gpsLocationProvider.getGpsLocations());
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Error');
	}
};

exports.deleteLocation = async function(req,res) {
	const uuid = req.params.uuid;
	if (_.isEmpty(uuid)) {
		res.status(400).send();
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
