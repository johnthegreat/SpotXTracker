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

const db = require('./controllers/lib/DatabaseProvider');

const doesTableExist = function (tableName) {
	return new Promise(function (resolve,reject) {
		const stmt = db.prepare('SELECT * FROM sqlite_master WHERE type=\'table\' AND name=?;');
		stmt.get(tableName,function (err,row) {
			if (err) {
				reject(err);
			}

			resolve(row !== undefined);
		});
	});
};

const runSetupScriptsIfNecessary = async function () {
	const gpsCheckInTableExists = await doesTableExist('gpsCheckIn');
	const deviceTableExists = await doesTableExist('device');

	// See Install.sql
	db.serialize(function () {
		if (!gpsCheckInTableExists) {
			db.run('CREATE TABLE IF NOT EXISTS "gpsCheckIn"\n(\n    uuid TEXT(36) not null\n        constraint gpsCheckIn_pk\n            primary key,\n    source VARCHAR(45) not null,\n    message VARCHAR(140),\n    lat DOUBLE(8,5) not null,\n    lng DOUBLE(8,5) not null,\n    altMeters DOUBLE(5,1),\n    altFeet INT(5),\n    mapUrl TEXT,\n    timestamp DATETIME\n)');
		}

		if (!deviceTableExists) {
			db.run('CREATE TABLE "device"\n(\n    uuid TEXT(36)\n        constraint device_pk\n            primary key,\n    name VARCHAR(45),\n    description TEXT,\n    phoneNumber VARCHAR(12) null\n)');

			db.run('CREATE UNIQUE INDEX device_name_uindex\n    on device (name);');

			db.run('CREATE UNIQUE INDEX device_phoneNumber_uindex\n    on device (phoneNumber);');
		}
	});
};

module.exports = runSetupScriptsIfNecessary;
