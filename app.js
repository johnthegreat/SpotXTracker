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

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const lusca = require('lusca');
const bodyParser = require('body-parser');
const _ = require('lodash');
const RateLimiterMemory = require('rate-limiter-flexible').RateLimiterMemory;
const hbs = require('hbs');
// https://github.com/pillarjs/hbs
require('handlebars-helpers')({
	handlebars: hbs.handlebars
});

(async function() {
	await require('./runSetupScriptsIfNecessary')();
}());

const createUuid = require('./utils/createUuid');

const memoryStore = new MemoryStore({
	checkPeriod: 86400000 // prune expired entries every 24h
});

const app = express();
// view engine setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');

// x-powered-by is disabled by helmet.
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 86400000 },
	store: memoryStore,
	secret: createUuid()
}));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.hsts({ maxAge: 31536000 }));
app.use(lusca.xssProtection(true));
app.use(lusca.nosniff());
app.use(lusca.referrerPolicy('same-origin'));

app.use(function (req,res,next) {
	res.locals.googleMapsApiKey = process.env.googleMapsApiKey;
	next();
});
app.use(function (req,res,next) {
	res.locals.TIMEZONE = process.env.timeZone;
	next();
});
app.use(function (req,res,next) {
	res.locals.env = process.env.ENV;
	next();
});

app.use(function (req,res,next) {
	if (req.path === '/twilio') {
		next();
		return;
	}

	if (_.has(req.session,'authToken')) {
		res.locals.signedIn = true;
	}
	next();
});

app.use(compression({
	level: 9
}));
app.use(logger('short'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));

const cacheControlMiddleware = function (req,res,next) {
	res.setHeader('Cache-Control','public, max-age=2592000');
	res.setHeader('Expires',new Date(Date.now() + 2592000000).toUTCString());
	next();
};
app.get('/js/*',cacheControlMiddleware);
app.get('/css/*',cacheControlMiddleware);
app.get('/modals/*',cacheControlMiddleware);

const rateLimiter = new RateLimiterMemory({
	storeClient: memoryStore,
	keyPrefix: 'middleware',
	points: 30, // 30 requests
	duration: 60, // per 60 seconds by IP
	blockDuration: 60 // block for one minute
});

const rateLimitMiddleware = function (pts) {
	return function (req,res,next) {
		rateLimiter.consume(req.ip,pts || 1).then(function () {
			next();
		}).catch(function () {
			res.status(429).send('Too Many Requests');
		});
	};
};

app.get('/',rateLimitMiddleware(1));
app.get('/login',rateLimitMiddleware(1));
app.post('/login',rateLimitMiddleware(6));

require('./setupRoutes')(app);

// catch 404
app.use(function (req,res) {
	res.status(404).send('Not Found');
});

// error handler
app.use(function (err,req,res,next) {
	console.error(err);
	res.status(err.status || 500).send('Internal Error');
});

module.exports = app;
