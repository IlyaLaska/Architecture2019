create table price_list
(
    "Id"    serial primary key,
    "Name"  varchar(100),
    "Price" real
);

create table details
(
    "PriceListId" int primary key references price_list ("Id"),
    "Description" varchar(200)
);

create table stock
(
    "PriceListId"   int primary key references price_list ("Id"),
    "TotalAmount"   smallint not null,
    "AmountInStock" smallint not null
);

insert into price_list("Name", "Price")
values ('Bike1', 100),
       ('Bike2', 120),
       ('Bike3', 130),
       ('Bike4', 150),
       ('Bike5', 200),
       ('Skies1', 100),
       ('Skies2', 120),
       ('Skies3', 130),
       ('Skies4', 150),
       ('Skies5', 200);

insert into details ("PriceListId", "Description")
values (1, 'Cheap bike'),
       (2, 'Decent bike'),
       (3, 'Good bike'),
       (4, 'Great bike'),
       (5, 'Premium bike'),
       (6, 'Cheap skies'),
       (7, 'Decent skies'),
       (8, 'Good skies'),
       (9, 'Great skies'),
       (10, 'Premium skies');

insert into stock ("PriceListId", "TotalAmount", "AmountInStock")
values (1, 20, 10),
       (2, 15, 10),
       (3, 12, 8),
       (4, 10, 6),
       (5, 5, 4),
       (6, 20, 10),
       (7, 15, 10),
       (8, 12, 7),
       (9, 10, 6),
       (10, 5, 3);
