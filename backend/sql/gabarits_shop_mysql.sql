CREATE DATABASE IF NOT EXISTS gabarits_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gabarits_shop;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  role ENUM('customer','admin') NOT NULL DEFAULT 'customer',
  address JSON NULL,
  phone VARCHAR(20) NULL,
  isActive TINYINT(1) NOT NULL DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  shortDescription VARCHAR(500),
  price DECIMAL(10,2) NOT NULL,
  originalPrice DECIMAL(10,2),
  category ENUM('robes','pantalons','chemises','vestes','accessoires') NOT NULL,
  difficulty ENUM('débutant','intermédiaire','expert') DEFAULT 'débutant',
  images JSON,
  pdfFile VARCHAR(500),
  aiFile VARCHAR(500),
  instructionsFile VARCHAR(500),
  tags JSON,
  sizes JSON,
  included JSON,
  salesCount INT NOT NULL DEFAULT 0,
  isPublished TINYINT(1) NOT NULL DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_templates_category_price (category, price),
  INDEX idx_templates_sales_count (salesCount),
  INDEX idx_templates_difficulty (difficulty)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderNumber VARCHAR(50) NOT NULL UNIQUE,
  userId INT NULL,
  customerEmail VARCHAR(255) NOT NULL,
  totalAmount DECIMAL(10,2) NOT NULL,
  status ENUM('pending','paid','processing','completed','cancelled') NOT NULL DEFAULT 'pending',
  paymentMethod VARCHAR(50),
  paymentId VARCHAR(100),
  downloadsLeft INT NOT NULL DEFAULT 3,
  downloadExpiry DATETIME,
  shippingAddress JSON,
  client_name VARCHAR(255),
  client_phone VARCHAR(50),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (userId) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL,
  templateId INT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  templateName VARCHAR(255),
  productName VARCHAR(255),
  size VARCHAR(50),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_items_order FOREIGN KEY (orderId) REFERENCES orders(id),
  CONSTRAINT fk_items_template FOREIGN KEY (templateId) REFERENCES templates(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS promo_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  type ENUM('percent','fixed') NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  minSubtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  expiresAt DATETIME NULL,
  maxUses INT NOT NULL DEFAULT 0,
  uses INT NOT NULL DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS stock (
  id VARCHAR(10) PRIMARY KEY,
  current INT NOT NULL DEFAULT 0,
  target INT NOT NULL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS stock_history (
  hid INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(10) NOT NULL,
  before_current INT,
  before_target INT,
  after_current INT,
  after_target INT,
  ts DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_stock_history_id_ts (id, ts)
) ENGINE=InnoDB;

DROP TRIGGER IF EXISTS trg_stock_insert;
DROP TRIGGER IF EXISTS trg_stock_update;

CREATE TRIGGER trg_stock_insert AFTER INSERT ON stock
FOR EACH ROW
INSERT INTO stock_history (id, before_current, before_target, after_current, after_target, ts)
VALUES (NEW.id, NULL, NULL, NEW.current, NEW.target, CURRENT_TIMESTAMP);

CREATE TRIGGER trg_stock_update AFTER UPDATE ON stock
FOR EACH ROW
INSERT INTO stock_history (id, before_current, before_target, after_current, after_target, ts)
VALUES (NEW.id, OLD.current, OLD.target, NEW.current, NEW.target, CURRENT_TIMESTAMP);

CREATE OR REPLACE VIEW vw_stock_status AS
SELECT s.id, s.current, s.target, (s.target - s.current) AS deficit, s.updated_at,
       CASE WHEN s.current >= s.target THEN 'OK'
            WHEN s.current >= (s.target * 0.7) THEN 'Warning'
            ELSE 'Low' END AS status
FROM stock s;

CREATE OR REPLACE VIEW vw_stock_low AS
SELECT * FROM vw_stock_status WHERE current < target;

CREATE OR REPLACE VIEW vw_orders_status_counts AS
SELECT status, COUNT(*) AS nb FROM orders GROUP BY status;

CREATE OR REPLACE VIEW vw_sales_by_day AS
SELECT DATE(createdAt) AS jour, COUNT(*) AS nb_commandes, SUM(totalAmount) AS total_eur
FROM orders
GROUP BY DATE(createdAt)
ORDER BY jour DESC;

CREATE OR REPLACE VIEW vw_top_templates AS
SELECT oi.templateId,
       COALESCE(t.name, oi.templateName, oi.productName) AS template_name,
       SUM(oi.quantity) AS qty_sold,
       SUM(oi.quantity * oi.price) AS revenue_eur
FROM order_items oi
LEFT JOIN templates t ON t.id = oi.templateId
GROUP BY oi.templateId, COALESCE(t.name, oi.templateName, oi.productName)
ORDER BY qty_sold DESC;

DELIMITER $$
DROP PROCEDURE IF EXISTS usp_Stock_Upsert $$
CREATE PROCEDURE usp_Stock_Upsert(IN p_id VARCHAR(10), IN p_current INT, IN p_target INT)
BEGIN
  INSERT INTO stock (id, current, target) VALUES (p_id, p_current, p_target)
  ON DUPLICATE KEY UPDATE current = VALUES(current), target = VALUES(target), updated_at = CURRENT_TIMESTAMP;
END $$

DROP PROCEDURE IF EXISTS usp_Stock_ImportJson $$
CREATE PROCEDURE usp_Stock_ImportJson(IN json_doc JSON)
BEGIN
  INSERT INTO stock (id, current, target)
  SELECT jt.id, jt.current, jt.target
  FROM JSON_TABLE(json_doc, '$[*]' COLUMNS (
    id VARCHAR(10) PATH '$.id',
    current INT PATH '$.current',
    target INT PATH '$.target'
  )) AS jt
  ON DUPLICATE KEY UPDATE current = VALUES(current), target = VALUES(target), updated_at = CURRENT_TIMESTAMP;
END $$

DROP PROCEDURE IF EXISTS usp_Orders_Summary $$
CREATE PROCEDURE usp_Orders_Summary()
BEGIN
  SELECT
    (SELECT COUNT(*) FROM orders) AS total_orders,
    (SELECT IFNULL(SUM(totalAmount),0) FROM orders) AS total_revenue,
    (SELECT COUNT(*) FROM orders WHERE status='pending') AS pending,
    (SELECT COUNT(*) FROM orders WHERE status='paid') AS paid,
    (SELECT COUNT(*) FROM orders WHERE status='completed') AS completed;
END $$
DELIMITER ;

INSERT INTO stock (id, current, target) VALUES
('A-001',12,20),
('A-002',10,20),
('B-011',11,20),
('B-012',8,20),
('C-007',15,20)
ON DUPLICATE KEY UPDATE current=VALUES(current), target=VALUES(target), updated_at=CURRENT_TIMESTAMP;
