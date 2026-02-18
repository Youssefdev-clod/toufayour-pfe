BEGIN TRY
    BEGIN TRANSACTION;

IF OBJECT_ID('dbo.migrations_history', 'U') IS NULL
BEGIN
  CREATE TABLE migrations_history (
      id INT IDENTITY(1,1) PRIMARY KEY,
      filename NVARCHAR(255) NOT NULL,
      checksum CHAR(64) NOT NULL,       -- SHA-256 hash of the SQL file
      applied_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
      applied_by NVARCHAR(255) NOT NULL, -- e.g., current user or process
      CONSTRAINT UQ_migration_file UNIQUE(filename)
  );
END

IF OBJECT_ID('dbo.agents', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.agents (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    name NVARCHAR(255) NOT NULL,
    role NVARCHAR(255) NOT NULL,
    is_active BIT NOT NULL DEFAULT 1,
    CONSTRAINT UQ_agents_email UNIQUE (email),
    CONSTRAINT CK_admin_roles CHECK (role IN ('SUPERADMIN', 'ADMIN', 'ORDER MANAGER', 'PRODUCT MANAGER', 'SUPPORT', 'MARKETING'))
  );
END

IF OBJECT_ID('dbo.product_units', 'U') IS NULL
BEGIN
CREATE TABLE product_units (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(50) UNIQUE NOT NULL
);
END;

IF OBJECT_ID('dbo.products', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    image_url NVARCHAR(500) NULL,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    created_by INT NULL,
    updated_by INT NULL,

    CONSTRAINT FK_products_created_by_agent_FK
        FOREIGN KEY (created_by)
        REFERENCES dbo.agents(id),

    CONSTRAINT FK_products_updated_by_agent_FK
        FOREIGN KEY (updated_by)
        REFERENCES dbo.agents(id)
  );
END

IF OBJECT_ID('dbo.product_units_prices', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.product_units_prices (
    id INT IDENTITY(1,1) PRIMARY KEY,
    price_per_unit DECIMAL(10,2) NOT NULL,
    unit_id INT NOT NULL,
    product_id INT NOT NULL,

    CONSTRAINT FK_product_units_unit_FK
        FOREIGN KEY (unit_id)
        REFERENCES dbo.product_units(id),

    CONSTRAINT FK_product_units_product_FK
        FOREIGN KEY (product_id)
        REFERENCES dbo.products(id)
  );
END

IF OBJECT_ID('dbo.packages', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.packages (
    id INT IDENTITY(1,1) PRIMARY KEY,
    price DECIMAL(10,2) NOT NULL,
    image_url NVARCHAR(500) NULL,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    created_by INT NULL,
    updated_by INT NULL,

    CONSTRAINT FK_packages_created_by_agent_FK
        FOREIGN KEY (created_by)
        REFERENCES dbo.agents(id),

    CONSTRAINT FK_packages_updated_by_agent_FK
        FOREIGN KEY (updated_by)
        REFERENCES dbo.agents(id)
  );
END

IF OBJECT_ID('dbo.package_products', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.package_products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    quantity DECIMAL(10,2) NOT NULL,
    unit_id INT NOT NULL,
    product_id INT NOT NULL,
    package_id INT NOT NULL,

    CONSTRAINT FK_package_products_unit_FK
        FOREIGN KEY (unit_id)
        REFERENCES dbo.product_units(id),

    CONSTRAINT FK_package_products_product_FK
        FOREIGN KEY (product_id)
        REFERENCES dbo.products(id),

    CONSTRAINT FK_package_products_package_FK
        FOREIGN KEY (package_id)
        REFERENCES dbo.packages(id)
  );
END

IF OBJECT_ID('dbo.languages', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.languages (
    id INT IDENTITY(1,1) PRIMARY KEY,
    language_code NVARCHAR(10) NOT NULL,
    name NVARCHAR(255) NOT NULL
  );
END

IF OBJECT_ID('dbo.product_translations', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.product_translations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    product_id INT NOT NULL,
    language_id INT NOT NULL,
    title NVARCHAR(255) COLLATE Arabic_100_CI_AI_SC NOT NULL,
    description NVARCHAR(2000) COLLATE Arabic_100_CI_AI_SC NULL,

    CONSTRAINT UQ_product_language UNIQUE (product_id, language_id),

    CONSTRAINT FK_product_translations_product_FK
        FOREIGN KEY (product_id)
        REFERENCES dbo.products(id),

    CONSTRAINT FK_product_translations_language_FK
        FOREIGN KEY (language_id)
        REFERENCES dbo.languages(id)
  );
END


IF OBJECT_ID('dbo.package_translations', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.package_translations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    package_id INT NOT NULL,
    language_id INT NOT NULL,
    title NVARCHAR(255) COLLATE Arabic_100_CI_AI_SC NOT NULL,
    description NVARCHAR(2000) COLLATE Arabic_100_CI_AI_SC NULL,

    CONSTRAINT UQ_package_language UNIQUE (package_id, language_id),

    CONSTRAINT FK_package_translations_package_FK
        FOREIGN KEY (package_id)
        REFERENCES dbo.packages(id),

    CONSTRAINT FK_package_translations_language_FK
        FOREIGN KEY (language_id)
        REFERENCES dbo.languages(id)
  );
END


IF OBJECT_ID('dbo.orders', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NULL,
    phone NVARCHAR(255) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status NVARCHAR(255) NOT NULL DEFAULT 'waiting',
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    created_by INT NULL,
    updated_by INT NULL,

    CONSTRAINT FK_orders_created_by_agent_FK
        FOREIGN KEY (created_by)
        REFERENCES dbo.agents(id),

    CONSTRAINT FK_orders_updated_by_agent_FK
        FOREIGN KEY (updated_by)
        REFERENCES dbo.agents(id),

    CONSTRAINT CK_orders_status CHECK (status IN ('WAITING','CONFIRMED','IN PROGRESS','DELIVERED','CANCELED'))
  );
END

IF OBJECT_ID('dbo.orders_products', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.orders_products (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL, -- product price might change so we have to store it in order 
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    PRIMARY KEY (order_id, product_id),
    CONSTRAINT FK_orders_products_order_id_FK
        FOREIGN KEY (order_id)
        REFERENCES dbo.orders(id),
    CONSTRAINT FK_orders_products_product_id_FK
        FOREIGN KEY (product_id)
        REFERENCES dbo.products(id),
    CONSTRAINT CK_product_quantity 
      CHECK (quantity > 0.0)
  );
END

IF OBJECT_ID('dbo.orders_packages', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.orders_packages (
    order_id INT NOT NULL,
    package_id INT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL, -- package price might change so we have to store it in order 
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    PRIMARY KEY (order_id, package_id),
    CONSTRAINT FK_orders_packages_order_id_FK
        FOREIGN KEY (order_id)
        REFERENCES dbo.orders(id),
    CONSTRAINT FK_orders_packages_package_id_FK
        FOREIGN KEY (package_id)
        REFERENCES dbo.packages(id),
    CONSTRAINT CK_package_quantity 
      CHECK (quantity > 0.0)
  );
END




CREATE INDEX IX_products_is_active ON dbo.products(is_active);
CREATE INDEX IX_packages_is_active ON dbo.packages(is_active);
CREATE INDEX IX_agents_is_active ON dbo.agents(is_active);

CREATE INDEX IX_products_created_by_agent
ON dbo.products(created_by);
CREATE INDEX IX_products_updated_by_agent
ON dbo.products(updated_by);

CREATE INDEX IX_packages_created_by_agent
ON dbo.packages(created_by);
CREATE INDEX IX_packages_updated_by_agent
ON dbo.packages(updated_by);

CREATE INDEX IX_orders_created_by_agent
ON dbo.orders(created_by);
CREATE INDEX IX_orders_updated_by_agent
ON dbo.orders(updated_by);

CREATE INDEX IX_orders_products_product_id
ON dbo.orders_products(product_id);

CREATE INDEX IX_orders_packages_package_id
ON dbo.orders_packages(package_id);

CREATE INDEX IX_product_translations_product_id
ON dbo.product_translations(product_id);
CREATE INDEX IX_package_translations_package_id
ON dbo.package_translations(package_id);

CREATE INDEX IX_orders_products_order_id
ON dbo.orders_products(order_id);
CREATE INDEX IX_orders_packages_order_id
ON dbo.orders_packages(order_id);

COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    -- Rollback if anything fails
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    -- Raise error to see what happened
    DECLARE @ErrorMessage NVARCHAR(4000), @ErrorSeverity INT, @ErrorState INT;
    SELECT 
        @ErrorMessage = ERROR_MESSAGE(),
        @ErrorSeverity = ERROR_SEVERITY(),
        @ErrorState = ERROR_STATE();

    RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
END CATCH;