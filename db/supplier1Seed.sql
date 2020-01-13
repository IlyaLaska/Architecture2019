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

insert into categories ("Name")
values ('Tent'),
       ('Stove');

insert into inventory("CategoryId", "Name", "Description", "UnitPrice")
values ((select "Id" from categories where "Name" = 'Tent'), 'Tent1', 'Large tent', 500),
       ((select "Id" from categories where "Name" = 'Tent'), 'Tent2', 'Magnificent tent', 700),
       ((select "Id" from categories where "Name" = 'Tent'), 'Tent3', 'Small tent', 300),
       ((select "Id" from categories where "Name" = 'Tent'), 'Tent4', 'White tent', 250),
       ((select "Id" from categories where "Name" = 'Stove'), 'Stove1', '1 burner', 74),
       ((select "Id" from categories where "Name" = 'Stove'), 'Stove2', '2 burner', 25),
       ((select "Id" from categories where "Name" = 'Stove'), 'Stove3', 'Square stove', 68),
       ((select "Id" from categories where "Name" = 'Stove'), 'Stove4', 'Rectangular stove', 54),
       ((select "Id" from categories where "Name" = 'Stove'), 'Stove5', '4 burner', 321),
       ((select "Id" from categories where "Name" = 'Stove'), 'Stove6', 'Yellow stove', 10000);


insert into features ("Name")
values ('Color'),
       ('Size'),
       ('Burners amount'),
       ('Shape');

insert into inventory_features ("InventoryId", "FeatureId", "Description")
values ((select "Id" from inventory where "Name" = 'Tent1'),
        (select "Id" from features where "Name" = 'Color'), 'Brown'),
       ((select "Id" from inventory where "Name" = 'Tent1'),
        (select "Id" from features where "Name" = 'Size'), 'Large'),
       ((select "Id" from inventory where "Name" = 'Tent2'),
        (select "Id" from features where "Name" = 'Color'), 'White'),
       ((select "Id" from inventory where "Name" = 'Tent2'),
        (select "Id" from features where "Name" = 'Size'), 'Magnificent'),
       ((select "Id" from inventory where "Name" = 'Tent3'),
        (select "Id" from features where "Name" = 'Color'), 'Black'),
       ((select "Id" from inventory where "Name" = 'Tent3'),
        (select "Id" from features where "Name" = 'Size'), 'Small'),
       ((select "Id" from inventory where "Name" = 'Tent4'),
        (select "Id" from features where "Name" = 'Color'), 'Green'),
       ((select "Id" from inventory where "Name" = 'Tent4'),
        (select "Id" from features where "Name" = 'Size'), 'Small'),
       ((select "Id" from inventory where "Name" = 'Stove1'),
        (select "Id" from features where "Name" = 'Color'), 'White'),
       ((select "Id" from inventory where "Name" = 'Stove1'),
        (select "Id" from features where "Name" = 'Burners amount'), '1'),
       ((select "Id" from inventory where "Name" = 'Stove2'),
        (select "Id" from features where "Name" = 'Shape'), 'Round'),
       ((select "Id" from inventory where "Name" = 'Stove2'),
        (select "Id" from features where "Name" = 'Burners amount'), '2'),
       ((select "Id" from inventory where "Name" = 'Stove3'),
        (select "Id" from features where "Name" = 'Shape'), 'Square'),
       ((select "Id" from inventory where "Name" = 'Stove3'),
        (select "Id" from features where "Name" = 'Burners amount'), '4'),
       ((select "Id" from inventory where "Name" = 'Stove4'),
        (select "Id" from features where "Name" = 'Shape'), 'Rectangular'),
       ((select "Id" from inventory where "Name" = 'Stove4'),
        (select "Id" from features where "Name" = 'Burners amount'), '4'),
       ((select "Id" from inventory where "Name" = 'Stove5'),
        (select "Id" from features where "Name" = 'Shape'), 'Square'),
       ((select "Id" from inventory where "Name" = 'Stove5'),
        (select "Id" from features where "Name" = 'Burners amount'), '4'),
       ((select "Id" from inventory where "Name" = 'Stove6'),
        (select "Id" from features where "Name" = 'Color'), 'Yellow'),
       ((select "Id" from inventory where "Name" = 'Stove6'),
        (select "Id" from features where "Name" = 'Burners amount'), '2');

insert into stock ("InventoryId", "TotalAm", "AmInStock")
values  ((select "Id" from inventory where "Name" = 'Tent1'), 10, 5),
       ((select "Id" from inventory where "Name" = 'Tent2'), 20, 7),
       ((select "Id" from inventory where "Name" = 'Tent3'), 12, 3),
       ((select "Id" from inventory where "Name" = 'Tent4'), 180, 25),
       ((select "Id" from inventory where "Name" = 'Stove1'), 150, 74),
       ((select "Id" from inventory where "Name" = 'Stove2'), 125, 25),
       ((select "Id" from inventory where "Name" = 'Stove3'), 129, 68),
       ((select "Id" from inventory where "Name" = 'Stove4'), 130, 54),
       ((select "Id" from inventory where "Name" = 'Stove5'), 140, 31),
       ((select "Id" from inventory where "Name" = 'Stove6'), 120, 10);
