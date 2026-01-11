IF DB_ID('gabarits_shop') IS NULL CREATE DATABASE [gabarits_shop];
GO
USE [gabarits_shop];
GO

IF OBJECT_ID('dbo.users','U') IS NULL
CREATE TABLE dbo.users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  email NVARCHAR(255) NOT NULL UNIQUE,
  password NVARCHAR(255) NOT NULL,
  firstName NVARCHAR(100) NOT NULL,
  lastName NVARCHAR(100) NOT NULL,
  role NVARCHAR(20) NOT NULL CHECK (role IN ('customer','admin')) DEFAULT 'customer',
  address NVARCHAR(MAX) NULL,
  phone NVARCHAR(20) NULL,
  isActive BIT NOT NULL DEFAULT 1,
  createdAt DATETIME2 DEFAULT SYSUTCDATETIME(),
  updatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);
GO

IF OBJECT_ID('dbo.templates','U') IS NULL
CREATE TABLE dbo.templates (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(255) NOT NULL,
  slug NVARCHAR(255) NOT NULL UNIQUE,
  description NVARCHAR(MAX) NOT NULL,
  shortDescription NVARCHAR(500) NULL,
  price DECIMAL(10,2) NOT NULL,
  originalPrice DECIMAL(10,2) NULL,
  category NVARCHAR(20) NOT NULL CHECK (category IN ('robes','pantalons','chemises','vestes','accessoires')),
  difficulty NVARCHAR(20) NULL CHECK (difficulty IN ('débutant','intermédiaire','expert')) DEFAULT 'débutant',
  images NVARCHAR(MAX) NULL,
  pdfFile NVARCHAR(500) NULL,
  aiFile NVARCHAR(500) NULL,
  instructionsFile NVARCHAR(500) NULL,
  tags NVARCHAR(MAX) NULL,
  sizes NVARCHAR(MAX) NULL,
  included NVARCHAR(MAX) NULL,
  salesCount INT NOT NULL DEFAULT 0,
  isPublished BIT NOT NULL DEFAULT 0,
  createdAt DATETIME2 DEFAULT SYSUTCDATETIME(),
  updatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);
GO

IF OBJECT_ID('dbo.orders','U') IS NULL
CREATE TABLE dbo.orders (
  id INT IDENTITY(1,1) PRIMARY KEY,
  orderNumber NVARCHAR(50) NOT NULL UNIQUE,
  userId INT NULL,
  customerEmail NVARCHAR(255) NOT NULL,
  totalAmount DECIMAL(10,2) NOT NULL,
  status NVARCHAR(20) NOT NULL CHECK (status IN ('pending','paid','processing','completed','cancelled')) DEFAULT 'pending',
  paymentMethod NVARCHAR(50) NULL,
  paymentId NVARCHAR(100) NULL,
  downloadsLeft INT NOT NULL DEFAULT 3,
  downloadExpiry DATETIME2 NULL,
  shippingAddress NVARCHAR(MAX) NULL,
  client_name NVARCHAR(255) NULL,
  client_phone NVARCHAR(50) NULL,
  createdAt DATETIME2 DEFAULT SYSUTCDATETIME(),
  updatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
  CONSTRAINT fk_orders_user FOREIGN KEY (userId) REFERENCES dbo.users(id)
);
GO

IF OBJECT_ID('dbo.order_items','U') IS NULL
CREATE TABLE dbo.order_items (
  id INT IDENTITY(1,1) PRIMARY KEY,
  orderId INT NOT NULL,
  templateId INT NULL,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  price DECIMAL(10,2) NOT NULL,
  templateName NVARCHAR(255) NULL,
  productName NVARCHAR(255) NULL,
  size NVARCHAR(50) NULL,
  createdAt DATETIME2 DEFAULT SYSUTCDATETIME(),
  updatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
  CONSTRAINT fk_items_order FOREIGN KEY (orderId) REFERENCES dbo.orders(id),
  CONSTRAINT fk_items_template FOREIGN KEY (templateId) REFERENCES dbo.templates(id)
);
GO

IF OBJECT_ID('dbo.promo_codes','U') IS NULL
CREATE TABLE dbo.promo_codes (
  id INT IDENTITY(1,1) PRIMARY KEY,
  code NVARCHAR(50) NOT NULL UNIQUE,
  type NVARCHAR(10) NOT NULL CHECK (type IN ('percent','fixed')),
  value DECIMAL(10,2) NOT NULL,
  active BIT NOT NULL DEFAULT 1,
  minSubtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  expiresAt DATETIME2 NULL,
  maxUses INT NOT NULL DEFAULT 0,
  uses INT NOT NULL DEFAULT 0,
  createdAt DATETIME2 DEFAULT SYSUTCDATETIME(),
  updatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);
GO

IF OBJECT_ID('dbo.stock','U') IS NULL
CREATE TABLE dbo.stock (
  id NVARCHAR(10) PRIMARY KEY,
  current INT NOT NULL DEFAULT 0 CHECK (current >= 0),
  target INT NOT NULL DEFAULT 0 CHECK (target >= 0),
  updated_at DATETIME2 DEFAULT SYSUTCDATETIME()
);
GO

IF OBJECT_ID('dbo.stock_history','U') IS NULL
CREATE TABLE dbo.stock_history (
  hid INT IDENTITY(1,1) PRIMARY KEY,
  id NVARCHAR(10) NOT NULL,
  before_current INT NULL,
  before_target INT NULL,
  after_current INT NULL,
  after_target INT NULL,
  ts DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='idx_templates_category_price' AND object_id=OBJECT_ID('dbo.templates'))
CREATE INDEX idx_templates_category_price ON dbo.templates (category, price);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='idx_templates_sales_count' AND object_id=OBJECT_ID('dbo.templates'))
CREATE INDEX idx_templates_sales_count ON dbo.templates (salesCount);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='idx_templates_difficulty' AND object_id=OBJECT_ID('dbo.templates'))
CREATE INDEX idx_templates_difficulty ON dbo.templates (difficulty);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'idx_stock_history_id_ts' AND object_id = OBJECT_ID('dbo.stock_history'))
CREATE INDEX idx_stock_history_id_ts ON dbo.stock_history (id, ts DESC);
GO

IF OBJECT_ID('dbo.trg_stock_history','TR') IS NOT NULL
DROP TRIGGER dbo.trg_stock_history;
GO
CREATE TRIGGER dbo.trg_stock_history ON dbo.stock
AFTER INSERT, UPDATE
AS
INSERT INTO dbo.stock_history (id, before_current, before_target, after_current, after_target, ts)
SELECT i.id, d.current, d.target, i.current, i.target, SYSUTCDATETIME()
FROM inserted i
LEFT JOIN deleted d ON d.id = i.id;
GO

IF OBJECT_ID('dbo.vw_stock_status','V') IS NOT NULL DROP VIEW dbo.vw_stock_status;
GO
CREATE VIEW dbo.vw_stock_status AS
SELECT s.id, s.current, s.target, (s.target - s.current) AS deficit, s.updated_at,
       CASE WHEN s.current >= s.target THEN 'OK'
            WHEN s.current >= (s.target * 0.7) THEN 'Warning'
            ELSE 'Low' END AS status
FROM dbo.stock AS s;
GO

IF OBJECT_ID('dbo.vw_stock_low','V') IS NOT NULL DROP VIEW dbo.vw_stock_low;
GO
CREATE VIEW dbo.vw_stock_low AS
SELECT * FROM dbo.vw_stock_status WHERE current < target;
GO

IF OBJECT_ID('dbo.vw_orders_status_counts','V') IS NOT NULL DROP VIEW dbo.vw_orders_status_counts;
GO
CREATE VIEW dbo.vw_orders_status_counts AS
SELECT status, COUNT(*) AS nb FROM dbo.orders GROUP BY status;
GO

IF OBJECT_ID('dbo.vw_sales_by_day','V') IS NOT NULL DROP VIEW dbo.vw_sales_by_day;
GO
CREATE VIEW dbo.vw_sales_by_day AS
SELECT CAST(createdAt AS DATE) AS jour, COUNT(*) AS nb_commandes, SUM(totalAmount) AS total_eur
FROM dbo.orders
GROUP BY CAST(createdAt AS DATE)
ORDER BY jour DESC;
GO

IF OBJECT_ID('dbo.vw_top_templates','V') IS NOT NULL DROP VIEW dbo.vw_top_templates;
GO
CREATE VIEW dbo.vw_top_templates AS
SELECT oi.templateId,
       COALESCE(t.name, oi.templateName, oi.productName) AS template_name,
       SUM(oi.quantity) AS qty_sold,
       SUM(oi.quantity * oi.price) AS revenue_eur
FROM dbo.order_items AS oi
LEFT JOIN dbo.templates AS t ON t.id = oi.templateId
GROUP BY oi.templateId, COALESCE(t.name, oi.templateName, oi.productName)
ORDER BY qty_sold DESC;
GO

IF OBJECT_ID('dbo.usp_Stock_Upsert','P') IS NOT NULL
DROP PROCEDURE dbo.usp_Stock_Upsert;
GO
CREATE PROCEDURE dbo.usp_Stock_Upsert @id NVARCHAR(10), @current INT, @target INT AS
BEGIN
  SET NOCOUNT ON;
  MERGE dbo.stock AS s
  USING (SELECT @id AS id, @current AS current, @target AS target) AS v
  ON s.id = v.id
  WHEN MATCHED THEN UPDATE SET s.current = v.current, s.target = v.target, s.updated_at = SYSUTCDATETIME()
  WHEN NOT MATCHED THEN INSERT (id, current, target, updated_at) VALUES (v.id, v.current, v.target, SYSUTCDATETIME());
END;
GO

IF OBJECT_ID('dbo.usp_Stock_ImportJson','P') IS NOT NULL
DROP PROCEDURE dbo.usp_Stock_ImportJson;
GO
CREATE PROCEDURE dbo.usp_Stock_ImportJson @json NVARCHAR(MAX) AS
BEGIN
  SET NOCOUNT ON;
  DECLARE @payload TABLE (id NVARCHAR(10), current INT, target INT);
  INSERT INTO @payload(id, current, target)
  SELECT id, current, target
  FROM OPENJSON(@json)
  WITH (
    id NVARCHAR(10) '$.id',
    current INT '$.current',
    target INT '$.target'
  );
  MERGE dbo.stock AS s
  USING @payload AS v
  ON s.id = v.id
  WHEN MATCHED THEN UPDATE SET s.current = v.current, s.target = v.target, s.updated_at = SYSUTCDATETIME()
  WHEN NOT MATCHED THEN INSERT (id, current, target, updated_at) VALUES (v.id, v.current, v.target, SYSUTCDATETIME());
END;
GO

IF OBJECT_ID('dbo.usp_Orders_Summary','P') IS NOT NULL
DROP PROCEDURE dbo.usp_Orders_Summary;
GO
CREATE PROCEDURE dbo.usp_Orders_Summary AS
BEGIN
  SET NOCOUNT ON;
  SELECT
    (SELECT COUNT(*) FROM dbo.orders) AS total_orders,
    (SELECT SUM(totalAmount) FROM dbo.orders) AS total_revenue,
    (SELECT COUNT(*) FROM dbo.orders WHERE status='pending') AS pending,
    (SELECT COUNT(*) FROM dbo.orders WHERE status='paid') AS paid,
    (SELECT COUNT(*) FROM dbo.orders WHERE status='completed') AS completed;
END;
GO

MERGE dbo.stock AS s USING (VALUES
  ('A-001',12,20),
  ('A-002',10,20),
  ('B-011',11,20),
  ('B-012',8,20),
  ('C-007',15,20)
) AS v(id,current,target)
ON s.id = v.id
WHEN MATCHED THEN UPDATE SET s.current = v.current, s.target = v.target, s.updated_at = SYSUTCDATETIME()
WHEN NOT MATCHED THEN INSERT (id,current,target,updated_at) VALUES (v.id,v.current,v.target,SYSUTCDATETIME());
GO
