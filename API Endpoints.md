### API Endpoints

| Model | Method | Endpoint | Description |
| --- | --- | --- | --- |
| GpsCheckInLocation | GET | /api/location | Gets locations. Returns 200 (OK) status code on success. |
| GpsCheckInLocation | DELETE | /api/location/:uuid | Deletes a location given a :uuid. Returns 204 (No Content) status code on success.
| Device | GET | /api/device | Gets devices. Returns 200 (OK) status code on success. |
| Device | POST | /api/device | Creates a device. Returns 201 (Created) status code on success. |
| Device | PUT | /api/device/:uuid | Updates a device given a :uuid. Returns 200 (OK) status code on success. |
| Device | DELETE | /api/device/:uuid | Deletes a device given a :uuid. Returns 204 (No Content) status code on success. |
| | POST | /twilio | Endpoint for Twilio. |
| | POST | /upload | Endpoint for custom integrations. |

#### GpsCheckInLocation fields
###### (See models/GpsCheckInLocation.js for more information)

- uuid (read-only) - Unique identifier for this record.
- source - A string indicating the source of this check-in (likely device name). Required.
- message - Any message sent along with the check-in. May be multiple lines. Optional.
- lat - Latitude of check-in. Required.
- lng - Longitude of check-in. Required.
- altMeters - Altitude (meters) of check-in. Optional.
- altFeet - Altitude (feet) of check-in. Optional.
- mapUrl - Map URL of check-in. Optional.
- timestamp - Check-in received timestamp in UTC time.

#### Device fields
###### (See models/Device.js for more information)

- uuid (read-only) - Unique identifier for this record.
- name - Name of the device, 45 character maximum. Required.
- description - Description of the device / friendly name / additional notes. Optional.
- phoneNumber - Phone number associated with this device. Stored in E.164 format in the database. Not required for custom integrations.
