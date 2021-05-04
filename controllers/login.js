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

// Module dependencies
const path = require('path');
const _ = require('lodash');
const winston = require('winston');

// Utilities
const isProduction = require('../utils/isProduction');

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(winston.format.timestamp(),winston.format.json()),
	transports: []
});

if (isProduction()) {
	logger.add(new winston.transports.File({ filename: process.env.logsDir + '/logins.log' }));
} else {
	logger.add(new winston.transports.Console());
}


/**
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.getLogin = function(req,res) {
	res.render('login',{
		title: 'Login',
		page: 'Login'
	});
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.postLogin = function(req,res) {
	if (!_.has(req.body,'accessToken') || !_.isString(req.body.accessToken)) {
		res.redirect('/login');
		return;
	}

	const accessToken = req.body.accessToken;
	if (accessToken === process.env.authToken) {
		logger.log('info','Login Successful',{ ip: req.ip });
		req.session.authToken = req.body.accessToken;
		res.redirect('/');
	} else {
		logger.log('info','Login Failed',{ ip: req.ip, accessToken: accessToken });
		res.status(401).render('login',{
			loginErrorMessage: 'Invalid access token, please try again.'
		});
	}
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.getLogout = function(req,res) {
	if (req.session) {
		req.session.destroy((err) => {
			if (err) {
				console.log('Error : Failed to destroy the session during logout.',err);
			}
			res.redirect('/login');
		});
	} else {
		res.redirect('/login');
	}
};

module.exports = exports;
