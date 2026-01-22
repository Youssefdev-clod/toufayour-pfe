USE toufayour_db;
GO

CREATE TABLE products (
  id INT IDENTITY(1,1) PRIMARY KEY,
  title_fr NVARCHAR(255) NOT NULL,
  title_ar NVARCHAR(255) NOT NULL,
  description_fr NVARCHAR(MAX),
  description_ar NVARCHAR(MAX),
  price DECIMAL(10,2) NOT NULL,
  image_url NVARCHAR(500),
  is_active BIT DEFAULT 1,
  created_at DATETIME DEFAULT GETDATE()
);
SELECT DB_NAME() AS current_db;
GO

USE toufayour_db;
GO

IF OBJECT_ID('dbo.products', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title_fr NVARCHAR(255) NOT NULL,
    title_ar NVARCHAR(255) NOT NULL,
    description_fr NVARCHAR(MAX) NULL,
    description_ar NVARCHAR(MAX) NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url NVARCHAR(500) NULL,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT GETDATE()
  );
END
GO
SELECT TABLE_SCHEMA, TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'products';
SELECT DB_NAME() AS current_db;
SELECT title_ar, description_ar FROM products;


ALTER TABLE dbo.products
ALTER COLUMN title_ar NVARCHAR(255) COLLATE Arabic_100_CI_AI_SC NOT NULL;

ALTER TABLE dbo.products
ALTER COLUMN description_ar NVARCHAR(MAX) COLLATE Arabic_100_CI_AI_SC NULL;

UPDATE dbo.products
SET title_ar = N'علبة زليج (12 قطعة)',
    description_ar = N'تشكيلة شوكولاتة مغربية حرفية.'
WHERE id = 1;
SELECT id, title_ar, description_ar
FROM dbo.products;
UPDATE dbo.products
SET image_url = 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=1200'
WHERE id = 1;
