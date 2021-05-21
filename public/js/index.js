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

/* eslint-disable */
let map;
let markersByUuid = {};

$(window).on('load',function() {
	map = new google.maps.Map(document.getElementById('map-canvas'), {
		zoom: 11,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: new google.maps.LatLng(43.611719617742835,-116.46400451660156) // Boise metro area
	});

	let checkInsListWidget = new CheckInsListWidget($("#checkInsListWidget"),{
		onViewOnMapClick: function(checkInData) {
			let uuid = checkInData['uuid'];
			let marker = markersByUuid[uuid];
			if (marker) {
				//clearMarkersFromMap(_.values(markersByUuid));
				centerMap(marker);

				openInfoWindowForMarker(marker);
			}
		}
	});

	$.ajax({
		method: 'get',
		url: '/api/location',
		success: function(data) {
			if (_.isArray(data) && data.length > 0) {
				_.each(data,function(checkInData) {
					checkInsListWidget.addCheckIn(checkInData);

					let gpsLat = checkInData['lat'];
					let gpsLng = checkInData['lng'];
					let timestamp = moment.utc(checkInData['timestamp'],"YYYY-MM-DD HH:mm:ss").tz(TIMEZONE).format("MMM DD, YYYY hh:mm:ss A");
					markersByUuid[checkInData['uuid']] = addPoint(gpsLat, gpsLng, "<p><b>" + timestamp + "</b></p><p>" + (checkInData['message'] ? checkInData['message'].replace('\n','<br>') : "") + "</p><p>(" + gpsLat + "," + gpsLng + ")</p>");
				});

				let lastRow = _.last(data);
				let marker = markersByUuid[lastRow['uuid']];
				//clearMarkersFromMap(_.values(markersByUuid));
				centerMap(marker);
				openInfoWindowForMarker(marker);
			}
		},
		error: function() {
			alert('Unable to fetch locations');
		}
	});
});

let deleteLocationByUuid = function(uuid) {
	return new Promise(function(resolve, reject) {
		$.ajax({
			method: 'delete',
			url: '/api/location/'+uuid,
			success: resolve,
			error: reject
		});
	});
};

function clearMarkersFromMap(markers) {
	// _.each(markers,function(marker) {
	// 	marker.setMap(null);
	// });
}

function openInfoWindowForMarker(marker) {
	if (marker.infoWindow) {
		closeAllInfoWindows(_.values(markersByUuid));
		marker.infoWindow.open(map,marker);
	}
}

function closeAllInfoWindows(markers) {
	_.each(markers,function(marker) {
		if (marker.infoWindow) {
			marker.infoWindow.close();
		}
	});
}

function centerMap(marker) {
	if (marker !== null && marker !== undefined) {
		if (marker.getMap() === null) {
			marker.setMap(map);
		}
		map.panTo(marker.getPosition());
		map.setZoom(14);
	}
}

function addPoint(lat,lng,infoWindowData) {
	let position = new google.maps.LatLng(lat,lng);
	// https://developers.google.com/maps/documentation/javascript/reference#MarkerOptions
	let marker = new google.maps.Marker({
		map: map,
		position: position,
		title: lat + ", " + lng
	});
	let infoWindow = new google.maps.InfoWindow({
		content: infoWindowData
	});
	google.maps.event.addListener(marker, 'click', function() {
		infoWindow.open(map,marker);
	});
	marker.infoWindow = infoWindow;
	return marker;
}
