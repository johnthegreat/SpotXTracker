CREATE TABLE "gpsCheckIn"
(
    uuid TEXT(36) not null
        constraint gpsCheckIn_pk
            primary key,
    source VARCHAR(45) not null,
    message VARCHAR(140),
    lat DOUBLE(8,5) not null,
    lng DOUBLE(8,5) not null,
    altMeters DOUBLE(5,1),
    altFeet INT(5),
    mapUrl TEXT,
    timestamp DATETIME
);

CREATE TABLE "device"
(
    uuid TEXT(36)
        constraint device_pk
            primary key,
    name VARCHAR(45),
    description TEXT,
    phoneNumber VARCHAR(12) not null
);

CREATE UNIQUE INDEX device_name_uindex
    on device (name);

CREATE UNIQUE INDEX device_phoneNumber_uindex
    on device (phoneNumber);
