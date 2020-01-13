create table if not exists categories
(
    "Id"   serial primary key,
    "Name" varchar(256)
);

create table if not exists inventory
(
    "Id"          serial primary key,
    "CategoryId"  int references categories ("Id") on delete cascade,
    "Name"        varchar(256),
    "Description" varchar(256),
    "UnitPrice"   real
);

create table if not exists features
(
    "Id"   serial primary key,
    "Name" varchar(256)
);

create table if not exists inventory_features
(
    "InventoryId" int references inventory ("Id") on delete cascade,
    "FeatureId"   int references features ("Id") on delete cascade,
    "Description" varchar(255),
    primary key ("InventoryId", "FeatureId")
);

create table if not exists stock
(
    "Id"          serial primary key,
    "InventoryId" int references inventory ("Id") on delete cascade,
    "TotalAm"     int,
    "AmInStock"   int
);

create table if not exists accounting
(
    "Id"            serial primary key,
    "InventoryId"   int references inventory ("Id") on delete cascade,
    "AmRented"      smallint,
    "RentTime"      smallint,
    "StartTime"     timestamp,
    "EndTime"       timestamp,
    "Price"         smallint,
    "RenterName"    varchar(200),
    "RenterSurname" varchar(200),
    "RenterPhone"   varchar(200),
    "RenterCardDet" varchar(200)
);

insert into categories ("Name")
values ('Bike'),
       ('Chair'),
       ('Table'),
       ('Tent');

insert into features ("Name")
values ('Color'),
       ('Size'),
       ('Shape');

insert into inventory("CategoryId", "Name", "Description", "UnitPrice")
values ((select "Id" from categories where "Name" = 'Bike'), 'Mountain Bike', 'Badass bike', 1500),
       ((select "Id" from categories where "Name" = 'Chair'), 'Chair', 'Lovely chair', 752),
       ((select "Id" from categories where "Name" = 'Table'), 'Table', 'Your best buddy', 363),
       ((select "Id" from categories where "Name" = 'Tent'), 'Tent', 'Zzzzzzzzzz', 942);

insert into inventory_features ("InventoryId", "FeatureId", "Description")
values ((select "Id" from inventory where "Name" = 'Mountain Bike'),
        (select "Id" from features where "Name" = 'Color'), 'Brown'),
       ((select "Id" from inventory where "Name" = 'Mountain Bike'),
        (select "Id" from features where "Name" = 'Size'), '22"'),
       ((select "Id" from inventory where "Name" = 'Chair'),
        (select "Id" from features where "Name" = 'Color'), 'Blue'),
       ((select "Id" from inventory where "Name" = 'Chair'),
        (select "Id" from features where "Name" = 'Size'), 'Small'),
       ((select "Id" from inventory where "Name" = 'Table'),
        (select "Id" from features where "Name" = 'Color'), 'Black'),
       ((select "Id" from inventory where "Name" = 'Table'),
        (select "Id" from features where "Name" = 'Size'), 'Big'),
       ((select "Id" from inventory where "Name" = 'Tent'),
        (select "Id" from features where "Name" = 'Color'), 'Green'),
       ((select "Id" from inventory where "Name" = 'Tent'),
        (select "Id" from features where "Name" = 'Size'), 'Magnificent'),
       ((select "Id" from inventory where "Name" = 'Tent'),
        (select "Id" from features where "Name" = 'Shape'), 'Round');


insert into stock("InventoryId", "TotalAm", "AmInStock")
values ((select s."Id" from inventory s where s."Name" = 'Mountain Bike'), 5, 4),
       ((select s."Id" from inventory s where s."Name" = 'Chair'), 15, 13),
       ((select s."Id" from inventory s where s."Name" = 'Table'), 10, 8),
       ((select s."Id" from inventory s where s."Name" = 'Tent'), 5, 3);

insert into accounting("InventoryId", "AmRented", "RentTime", "StartTime", "EndTime",
                       "Price", "RenterName", "RenterSurname", "RenterPhone", "RenterCardDet")
values ((select s."Id" from inventory s where s."Name" = 'Mountain Bike'), 1, 24, current_date, 'infinity', 100,
        'Alex', 'Alex', '+380985678765', '5168 1241 5353 1516');

select distinct i."Id", i."Name", i."Description", i."UnitPrice",
    s."AmInStock" from inventory i left join inventory_features if on i."Id" = if."InventoryId"
    join stock s on i."Id" = s."InventoryId";