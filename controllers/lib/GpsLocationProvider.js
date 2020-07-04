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
const db = require('./DatabaseProvider');
const GpsCheckInLocation = require('../../models/GpsCheckInLocation');

const GpsLocationProvider = function() {};
const gpsLocationProvider = new GpsLocationProvider();

/**
 *
 * @param {GpsCheckInLocation} gpsLocation
 * @returns {Promise<GpsCheckInLocation>}
 */
GpsLocationProvider.prototype.createGpsLocation = function(gpsLocation) {
	return new Promise(function(resolve,reject) {
		const values = [gpsLocation.uuid,gpsLocation.source,gpsLocation.message,gpsLocation.lat,gpsLocation.lng,gpsLocation.altMeters,gpsLocation.altFeet,gpsLocation.mapUrl,gpsLocation.timestamp];
		db.run('INSERT INTO `gpsCheckIn` (uuid, source, message, lat, lng, altMeters, altFeet, mapUrl, timestamp) VALUES (?,?,?,?,?,?,?,?,?)',values,function(err) {
			if (err) {
				return reject(err);
			}

			gpsLocationProvider.getGpsLocationByUuid(gpsLocation.uuid).then(function(_gpsLocation) {
				resolve(_gpsLocation);
			}).catch(function(err) {
				reject(err);
			});
		});
	});
};

/**
 *
 * @returns {Promise<GpsCheckInLocation[]>}
 */
GpsLocationProvider.prototype.getGpsLocations = function() {
	return new Promise(function(resolve,reject) {
		db.all('SELECT * FROM `gpsCheckIn` ORDER BY `timestamp` ASC',function(err,records) {
			if (err) {
				return reject(err);
			}

			resolve(_.map(records,GpsCheckInLocation.create));
		});
	});
};

/**
 *
 * @param uuid
 * @returns {Promise<GpsCheckInLocation>}
 */
GpsLocationProvider.prototype.getGpsLocationByUuid = function(uuid) {
	return new Promise(function(resolve,reject) {
		db.all('SELECT * FROM `gpsCheckIn` WHERE `uuid` = ?',[uuid],function(err,records) {
			if (err) {
				return reject(err);
			}

			if (records.length >= 0) {
				resolve(GpsCheckInLocation.create(_.first(records)));
				return;
			}

			resolve(null);
		});
	});
};

GpsLocationProvider.prototype.deleteGpsLocationByUuid = function(uuid) {
	return new Promise(function(resolve,reject) {
		db.run('DELETE FROM `gpsCheckIn` WHERE `uuid` = ?',[uuid],function(err) {
			if (err) {
				return reject(err);
			}
			resolve();
		});
	});
};

module.exports = gpsLocationProvider;
