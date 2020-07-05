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
const Device = require('../../models/Device');
const db = require('./DatabaseProvider');

const DeviceProvider = function() {};
const deviceProvider = new DeviceProvider();

DeviceProvider.prototype.getDevices = function() {
	return new Promise(function(resolve,reject) {
		db.all('SELECT * FROM `device`',function(err,results) {
			if (err) {
				return reject(err);
			}

			resolve(_.map(results,Device.create));
		});
	});
};

/**
 *
 * @param {Device} device
 * @returns {Promise<Device>}
 */
DeviceProvider.prototype.createDevice = function(device) {
	return new Promise(function(resolve,reject) {
		const values = [device.uuid,device.name,device.description,device.phoneNumber];
		db.run('INSERT INTO `device` (uuid, name, description, phoneNumber) VALUES (?,?,?,?)',values,function(err) {
			if (err) {
				return reject(err);
			}

			deviceProvider.getDeviceByUuid(device.uuid).then(function(_device) {
				resolve(_device);
			}).catch(function(_err) {
				reject(_err);
			});
		});
	});
};

/**
 *
 * @param {string} uuid
 * @returns {Promise<null|Device>}
 */
DeviceProvider.prototype.getDeviceByUuid = function(uuid) {
	return new Promise(function(resolve,reject) {
		db.all('SELECT * FROM `device` WHERE `uuid` = ?',[uuid],function(err,records) {
			if (err) {
				return reject(err);
			}

			if (records.length >= 1) {
				return resolve(Device.create(_.first(records)));
			}
			resolve(null);
		});
	});
};

/**
 *
 * @param {string} name
 * @returns {Promise<null|Device>}
 */
DeviceProvider.prototype.getDeviceByName = function(name) {
	return new Promise(function(resolve,reject) {
		db.all('SELECT * FROM `device` WHERE `name` = ?',[name],function(err,records) {
			if (err) {
				return reject(err);
			}

			if (records.length >= 1) {
				return resolve(Device.create(_.first(records)));
			}
			resolve(null);
		});
	});
};

/**
 *
 * @param {string} phoneNumber
 * @returns {Promise<Device>}
 */
DeviceProvider.prototype.getDeviceByPhoneNumber = function(phoneNumber) {
	return new Promise(function(resolve,reject) {
		db.all('SELECT * FROM `device` WHERE `phoneNumber` = ?',[phoneNumber],function(err,records) {
			if (err) {
				return reject(err);
			}

			if (records.length >= 1) {
				return resolve(Device.create(_.first(records)));
			}
			resolve(null);
		});
	});
};

/**
 *
 * @param {Device} device
 * @returns {Promise<Device>}
 */
DeviceProvider.prototype.updateDevice = function(device) {
	return new Promise(function(resolve,reject) {
		db.run('UPDATE `device` SET `name` = ?, `description` = ?, `phoneNumber` = ? WHERE `uuid` = ?',[device.name,device.description,device.phoneNumber,device.uuid],function(err) {
			if (err) {
				return reject(err);
			}

			deviceProvider.getDeviceByUuid(device.uuid).then(function(_device) {
				resolve(_device);
			}).catch(function(_err) {
				reject(_err);
			});
		});
	});
};

DeviceProvider.prototype.deleteDeviceByUuid = function(uuid) {
	return new Promise(function(resolve,reject) {
		db.run('DELETE FROM `device` WHERE `uuid` = ?',[uuid],function(err) {
			if (err) {
				return reject(err);
			}
			resolve();
		});
	});
};
module.exports = deviceProvider;
