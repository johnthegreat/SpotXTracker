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

const isAuthenticated = function(req,res,next) {
	if (_.has(req.session,'authToken')) {
		next();
	} else if (req.path.indexOf('/api') >= 0) {
		res.status(401).send('Unauthorized');
	} else {
		res.redirect('/login');
	}
};

const setupRoutes = function(app) {
	const homeController = require('./controllers/home');
	app.get('/',isAuthenticated,homeController.getHome);

	const loginController = require('./controllers/login');
	app.get('/login',loginController.getLogin);
	app.post('/login',loginController.postLogin);
	app.get('/logout',isAuthenticated,loginController.getLogout);

	const twilioController = require('./controllers/twilio');
	app.post('/twilio',twilioController.post);

	const devicesController = require('./controllers/devices');
	app.get('/devices',isAuthenticated,devicesController.getDevices);

	const settingsController = require('./controllers/settings');
	app.get('/settings',isAuthenticated,settingsController.getSettings);
	app.post('/settings',isAuthenticated,settingsController.postSettings);

	// Note: API endpoints are not truly RESTful since they require state (being logged in)
	// We could add API Key functionality later

	const apiLocationController = require('./controllers/api/location');
	app.get('/api/location',isAuthenticated,apiLocationController.getLocations);
	app.delete('/api/location/:uuid',isAuthenticated,apiLocationController.deleteLocation);

	const apiDeviceController = require('./controllers/api/devices');
	app.get('/api/device',isAuthenticated,apiDeviceController.getDevices);
	app.post('/api/device',isAuthenticated,apiDeviceController.createDevice);
	app.put('/api/device/:uuid',isAuthenticated,apiDeviceController.updateDevice);
	app.delete('/api/device/:uuid',isAuthenticated,apiDeviceController.deleteDevice);

	app.use('/api/*',function (req,res) {
		res.status(404).send();
	});
};
module.exports = setupRoutes;
