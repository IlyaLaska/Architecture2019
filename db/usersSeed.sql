create table users(
    "Id"   serial primary key,
    "Login" varchar(256),
    "Password" varchar(256),
    "Privileges" smallint
);

insert into users
("Login", "Password", "Privileges") VALUES
('admin', 'l�t��ߜ�{A��j��i�}�`]���F��', 2);
