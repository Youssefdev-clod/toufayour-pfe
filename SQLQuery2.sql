CREATE DATABASE toufayour_db;
GO
CREATE LOGIN toufayour_app WITH PASSWORD = 'App@12345678';
GO
USE toufayour_db;
GO
CREATE USER toufayour_app FOR LOGIN toufayour_app;
GO
ALTER ROLE db_owner ADD MEMBER toufayour_app;
GO
