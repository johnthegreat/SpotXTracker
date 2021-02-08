# SpotX Tracker

Upload, track, and share your Spot X's coordinates.

### Motivation

- Because... integrations are cool!
- Spot's online mapping / tracking software is too bloated and complicated.
- Fun little side project.

### Prerequisites

- Google Maps API Key
- Twilio Phone Number
- Spot X or other compatible device

### Installation

1. Clone or download the repo.
2. Run `npm install`.
3. Configure environment variables in `.env`. See `.env.example` for configuration options.
4. Run `npm start` or `node bin/www`. For additional debugging information, try `DEBUG=* node bin/www`. The application will automatically set up the database for you.

### Configuration

Like many other Node projects, this web app listens on port `3000` by default.
Change this in `.env` or pass in a `PORT` as the environment variable on startup.

1. Add your Twilio phone number to your Spot X's predefined contacts and sync it with your Spot account.
2. Configure your Twilio phone number to point to the endpoint provided by this project (`/twilio`).
    - For example, if your server is running on `http://example.com`, the endpoint for Twilio would be `http://example.com/twilio`.
    - Use POST, not GET, when setting up the webhook in Twilio.
3. Start the program.
4. Login to the app using the `authToken` you specified in the `.env` configuration file.
5. From the Devices menu, create a new device. Enter a device name, device description, and your Spot X's phone number.

### Usage Instructions

1. Create a new message to your Twilio contact on your Spot X device.
    - Go to Messages, Predefined Messages and use any Predefined Message that you would like.
    - Include Altitude (optional) and Geolocation.
    - Send the predefined message.
    - You can also set up the Twilio phone number to receive check-in messages in your Spot account.
2. This program should receive the Spot X's coordinates via the Twilio endpoint if everything is working properly.

### API Documentation

See `API Endpoints.md`.

### TODO

- Proper user authentication and roles-based management
    - Proper username / password login
    - Currently anyone with the `authToken` can make changes to the registered devices

### License

Copyright &copy; 2020-2021 John Nahlen.

Released under [AGPL 3.0](https://www.gnu.org/licenses/agpl-3.0.en.html).
See `LICENSE.md`.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
