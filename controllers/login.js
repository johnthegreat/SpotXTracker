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

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
require('dotenv').config({ path: '.env' });
const _ = require('lodash');
const chalk = require('chalk');

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
		console.log(chalk.green(req.ip + ' - Login Successful.'));
		req.session.authToken = req.body.accessToken;
		res.redirect('/');
	} else {
		console.log(chalk.red(req.ip + ' - Login Attempted: "' + req.body.accessToken + '"'));
		res.redirect('/login');
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
