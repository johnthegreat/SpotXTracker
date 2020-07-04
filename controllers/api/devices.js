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
const deviceProvider = require('../lib/DeviceProvider');
const Device = require('../../models/Device');
const createUuid = require('../../utils/createUuid');
const convertPhoneNumberToE164 = require('../../utils/convertPhoneNumberToE164');

/**
 *
 * @param {Device} device
 */
function validateDevice(device) {
	/**
	 *
	 * @type {null|string}
	 */
	let error = null;

	if (device.name.trim().length === 0) {
		error = 'Device name is required.';
	} else if (device.name.length > 45) {
		error = 'Device name is too many characters.';
	} else if (device.description.length > 500) {
		error = 'Device description is too many characters.';
	} else if (device.phoneNumber.trim().length === 0) {
		error = 'Device phone number is required.';
	} else if (device.phoneNumber.length > 12) {
		error = 'Device phone number is too many characters.';
	}

	return error;
}

exports.getDevices = async function(req,res) {
	res.status(200).send(await deviceProvider.getDevices());
};

exports.createDevice = async function(req,res) {
	if (!_.isString(req.body.name) || !_.isString(req.body.description) || !_.isString(req.body.phoneNumber)) {
		return res.status(400).send('');
	}

	let device = Device.create(_.pick(req.body,['name','description','phoneNumber']));
	const friendlyErrorMessage = validateDevice(device);
	if (friendlyErrorMessage !== null) {
		return res.status(400).send(friendlyErrorMessage);
	}

	try {
		device.uuid = createUuid();
		device.phoneNumber = convertPhoneNumberToE164(device.phoneNumber);
		device = await deviceProvider.createDevice(device);
		res.status(201).send(device);
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Error');
	}
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
exports.updateDevice = async function(req,res) {
	const uuid = req.params.uuid;
	if (_.isEmpty(uuid) || !_.isString(uuid)) {
		res.status(400).send();
		return;
	}

	let device = await deviceProvider.getDeviceByUuid(uuid);
	if (device === null) {
		return res.status(404).send();
	}

	if (!_.isString(req.body.name) && !_.isString(req.body.description) && !_.isString(req.body.phoneNumber)) {
		return res.status(400).send('');
	}

	const filteredReqBody = _.pick(req.body,['name','description','phoneNumber']);
	const error = validateDevice(filteredReqBody);
	if (error !== null) {
		return res.status(400).send(error);
	}

	device.name = filteredReqBody.name;
	device.description = filteredReqBody.description;
	device.phoneNumber = filteredReqBody.phoneNumber;

	try {
		device = await deviceProvider.updateDevice(device);
		res.status(200).send(device);
	} catch (err) {
		res.status(500).send(err);
	}
};

exports.deleteDevice = async function(req,res) {
	const uuid = req.params.uuid;
	if (_.isEmpty(uuid) || !_.isString(uuid)) {
		res.status(400).send();
		return;
	}

	try {
		const device = await deviceProvider.getDeviceByUuid(uuid);
		if (device === null) {
			return res.status(404).send();
		}
		await deviceProvider.deleteDeviceByUuid(uuid);

		res.status(204).send();
	} catch (err) {
		res.status(500).send(err);
	}
};

module.exports = exports;
