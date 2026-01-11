-- =====================================================
-- BASE DE DONNÉES: gabarits_shop
-- Description: E-commerce de gabarits de vêtements
-- =====================================================

-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS gabarits_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gabarits_shop;

-- =====================================================
-- TABLE: users
-- =====================================================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    address TEXT,
    phone VARCHAR(20),
    isActive TINYINT(1) DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: templates
-- =====================================================
DROP TABLE IF EXISTS templates;
CREATE TABLE templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    shortDescription VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    originalPrice DECIMAL(10, 2),
    category ENUM('robes', 'pantalons', 'chemises', 'vestes', 'accessoires') NOT NULL,
    difficulty ENUM('débutant', 'intermédiaire', 'expert') DEFAULT 'débutant',
    images TEXT,
    pdfFile VARCHAR(500),
    aiFile VARCHAR(500),
    instructionsFile VARCHAR(500),
    tags TEXT,
    sizes TEXT,
    included TEXT,
    salesCount INT DEFAULT 0,
    isPublished TINYINT(1) DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category_price (category, price),
    INDEX idx_sales_count (salesCount),
    INDEX idx_difficulty (difficulty),
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: orders
-- =====================================================
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderNumber VARCHAR(50) NOT NULL UNIQUE,
    userId INT NOT NULL,
    customerEmail VARCHAR(255) NOT NULL,
    totalAmount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'paid', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    paymentMethod VARCHAR(50),
    paymentId VARCHAR(100),
    downloadsLeft INT DEFAULT 3,
    downloadExpiry DATETIME,
    shippingAddress TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user (userId),
    INDEX idx_status (status),
    INDEX idx_order_number (orderNumber),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: order_items
-- =====================================================
DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    templateId INT NOT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    templateName VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order (orderId),
    INDEX idx_template (templateId),
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (templateId) REFERENCES templates(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- DONNÉES DE TEST: users
-- =====================================================
-- Mot de passe pour tous: "password123" (hashé avec bcrypt)
INSERT INTO users (email, password, firstName, lastName, role, address, phone, isActive) VALUES
('admin@gabarits.com', '$2a$10$Xk5WZQe9P2YJ5YZUQw5t3.5HzJxKqYLw5vN9W8X5Z4Q3W5Y5Z5Z5Z', 'Marie', 'Dupont', 'admin', '{"street":"15 Rue de la Mode","city":"Paris","postalCode":"75001","country":"France"}', '+33123456789', 1),
('sophie.martin@example.com', '$2a$10$Xk5WZQe9P2YJ5YZUQw5t3.5HzJxKqYLw5vN9W8X5Z4Q3W5Y5Z5Z5Z', 'Sophie', 'Martin', 'customer', '{"street":"28 Avenue des Champs","city":"Lyon","postalCode":"69001","country":"France"}', '+33623456789', 1),
('lucas.bernard@example.com', '$2a$10$Xk5WZQe9P2YJ5YZUQw5t3.5HzJxKqYLw5vN9W8X5Z4Q3W5Y5Z5Z5Z', 'Lucas', 'Bernard', 'customer', '{"street":"42 Rue du Commerce","city":"Marseille","postalCode":"13001","country":"France"}', '+33723456789', 1),
('julie.petit@example.com', '$2a$10$Xk5WZQe9P2YJ5YZUQw5t3.5HzJxKqYLw5vN9W8X5Z4Q3W5Y5Z5Z5Z', 'Julie', 'Petit', 'customer', '{"street":"7 Boulevard Saint-Michel","city":"Toulouse","postalCode":"31000","country":"France"}', '+33823456789', 1),
('thomas.robert@example.com', '$2a$10$Xk5WZQe9P2YJ5YZUQw5t3.5HzJxKqYLw5vN9W8X5Z4Q3W5Y5Z5Z5Z', 'Thomas', 'Robert', 'customer', '{"street":"19 Place de la République","city":"Nice","postalCode":"06000","country":"France"}', '+33923456789', 1);

-- =====================================================
-- DONNÉES DE TEST: templates
-- =====================================================
INSERT INTO templates (name, slug, description, shortDescription, price, originalPrice, category, difficulty, images, pdfFile, aiFile, instructionsFile, tags, sizes, included, salesCount, isPublished) VALUES

-- ROBES
('Robe d\'Été Bohème', 'robe-ete-boheme', 
'Une magnifique robe d\'été au style bohème chic, parfaite pour les journées ensoleillées. Ce patron inclut toutes les étapes détaillées pour créer une robe fluide et confortable avec des finitions impeccables. Le design comprend des manches évasées, une encolure élégante et une jupe ample qui tombe parfaitement.',
'Robe bohème légère et élégante, parfaite pour l\'été',
29.99, 39.99, 'robes', 'intermédiaire',
'["https://images.unsplash.com/photo-1595777457583-95e059d581b8","https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f"]',
'/files/robes/robe-ete-boheme.pdf', '/files/robes/robe-ete-boheme.ai', '/files/robes/robe-ete-boheme-instructions.pdf',
'["été","bohème","casual","femme","robe longue"]',
'["XS","S","M","L","XL","XXL"]',
'["Patron PDF multi-tailles","Instructions détaillées illustrées","Guide d\'assemblage","Conseils tissus et fournitures","Tutoriel vidéo"]',
156, 1),

('Robe de Soirée Élégante', 'robe-soiree-elegante',
'Créez votre propre robe de soirée avec ce patron sophistiqué. Idéale pour les événements formels, cette robe présente une coupe ajustée au niveau du buste et une jupe évasée qui flattera toutes les silhouettes. Comprend des variantes pour différentes longueurs de manches et styles d\'encolure.',
'Robe de soirée sophistiquée pour événements spéciaux',
49.99, 69.99, 'robes', 'expert',
'["https://images.unsplash.com/photo-1566174053879-31528523f8ae","https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03"]',
'/files/robes/robe-soiree-elegante.pdf', '/files/robes/robe-soiree-elegante.ai', '/files/robes/robe-soiree-elegante-instructions.pdf',
'["soirée","élégant","formel","femme","luxe"]',
'["XS","S","M","L","XL"]',
'["Patron PDF multi-tailles","Instructions détaillées","Guide d\'ajustement personnalisé","Liste de tissus recommandés","Support technique"]',
89, 1),

('Robe Vintage Années 50', 'robe-vintage-annees-50',
'Redécouvrez le glamour des années 50 avec cette robe rétro iconique. Ce patron comprend la jupe circulaire caractéristique, un corsage ajusté et une ceinture flatteuse. Parfait pour les passionnées de vintage et les événements à thème.',
'Style rétro authentique des années 50',
34.99, NULL, 'robes', 'intermédiaire',
'["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1","https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84"]',
'/files/robes/robe-vintage-50.pdf', '/files/robes/robe-vintage-50.ai', '/files/robes/robe-vintage-50-instructions.pdf',
'["vintage","rétro","années 50","pin-up","rockabilly"]',
'["S","M","L","XL"]',
'["Patron PDF","Instructions illustrées","Guide stylistique vintage","Tableau des mesures","Astuces de couture"]',
67, 1),

-- PANTALONS
('Pantalon Palazzo Fluide', 'pantalon-palazzo-fluide',
'Un pantalon palazzo élégant et confortable, parfait pour toutes les occasions. Ce patron vous guide dans la création d\'un pantalon à jambes larges avec une taille haute flatteuse. Idéal pour les tissus fluides et légers.',
'Pantalon large confortable et élégant',
24.99, 34.99, 'pantalons', 'débutant',
'["https://images.unsplash.com/photo-1594633313593-bab3825d0caf","https://images.unsplash.com/photo-1624206112918-b5f8e32e7b90"]',
'/files/pantalons/pantalon-palazzo.pdf', '/files/pantalons/pantalon-palazzo.ai', '/files/pantalons/pantalon-palazzo-instructions.pdf',
'["palazzo","fluide","confort","femme","casual"]',
'["XXS","XS","S","M","L","XL","XXL"]',
'["Patron PDF multi-tailles","Instructions pas à pas","Guide de montage de la taille","Conseils d\'ajustement","FAQ débutants"]',
203, 1),

('Jean Slim Classique', 'jean-slim-classique',
'Créez votre jean parfait avec ce patron détaillé. Apprenez les techniques professionnelles pour poser des rivets, installer des fermetures et obtenir une coupe parfaite. Ce patron convient aux couturiers intermédiaires souhaitant maîtriser la confection de jeans.',
'Jean ajusté avec techniques professionnelles',
39.99, NULL, 'pantalons', 'expert',
'["https://images.unsplash.com/photo-1542272604-787c3835535d","https://images.unsplash.com/photo-1604176354204-9268737828e4"]',
'/files/pantalons/jean-slim.pdf', '/files/pantalons/jean-slim.ai', '/files/pantalons/jean-slim-instructions.pdf',
'["jean","denim","slim","casual","unisexe"]',
'["26","28","30","32","34","36","38","40"]',
'["Patron PDF multi-tailles","Guide détaillé de pose de rivets","Techniques de surpiqûre","Liste de fournitures spécialisées","Vidéo installation fermeture"]',
134, 1),

-- CHEMISES
('Chemise Classique Homme', 'chemise-classique-homme',
'Une chemise intemporelle pour homme avec col et poignets traditionnels. Ce patron comprend plusieurs options de cols et de poches. Parfait pour créer des chemises de qualité sur mesure.',
'Chemise habillée classique pour homme',
27.99, 37.99, 'chemises', 'intermédiaire',
'["https://images.unsplash.com/photo-1603252109303-2751441dd157","https://images.unsplash.com/photo-1596755094514-f87e34085b2c"]',
'/files/chemises/chemise-homme.pdf', '/files/chemises/chemise-homme.ai', '/files/chemises/chemise-homme-instructions.pdf',
'["chemise","homme","classique","formel","business"]',
'["S","M","L","XL","XXL","3XL"]',
'["Patron PDF multi-tailles","Instructions de montage de col","Guide de pose de boutons","Tableau de mesures détaillé","Options de personnalisation"]',
178, 1),

('Blouse Romantique Femme', 'blouse-romantique-femme',
'Une blouse féminine avec détails romantiques : volants, dentelle et broderie. Ce patron offre de multiples possibilités de personnalisation pour créer une pièce unique et élégante.',
'Blouse féminine avec détails délicats',
32.99, NULL, 'chemises', 'intermédiaire',
'["https://images.unsplash.com/photo-1564859227740-8dfe38a2c88e","https://images.unsplash.com/photo-1578932750294-f5075e85f44a"]',
'/files/chemises/blouse-romantique.pdf', '/files/chemises/blouse-romantique.ai', '/files/chemises/blouse-romantique-instructions.pdf',
'["blouse","romantique","femme","dentelle","élégant"]',
'["XS","S","M","L","XL"]',
'["Patron PDF","Instructions détaillées","Guide de pose de dentelle","Techniques de fronces","Inspiration styling"]',
145, 1),

-- VESTES
('Blazer Structuré Femme', 'blazer-structure-femme',
'Un blazer élégant et structuré pour un look professionnel. Ce patron avancé vous enseigne les techniques de tailleur : thermocollage, doublure complète et finitions impeccables.',
'Blazer professionnel avec techniques de tailleur',
54.99, 74.99, 'vestes', 'expert',
'["https://images.unsplash.com/photo-1591047139829-d91aecb6caea","https://images.unsplash.com/photo-1557804506-669a67965ba0"]',
'/files/vestes/blazer-femme.pdf', '/files/vestes/blazer-femme.ai', '/files/vestes/blazer-femme-instructions.pdf',
'["blazer","veste","formel","femme","tailleur"]',
'["34","36","38","40","42","44","46"]',
'["Patron PDF couture pro","Guide complet thermocollage","Instructions doublure","Techniques de repassage","Vidéos techniques avancées"]',
92, 1),

('Veste en Jean Oversize', 'veste-jean-oversize',
'Une veste en jean tendance avec coupe oversize. Parfaite pour un look décontracté, ce patron inclut des options de personnalisation avec patches et broderies.',
'Veste jean décontractée coupe moderne',
44.99, NULL, 'vestes', 'intermédiaire',
'["https://images.unsplash.com/photo-1551028719-00167b16eac5","https://images.unsplash.com/photo-1523205771533-2b132852c5e6"]',
'/files/vestes/veste-jean-oversize.pdf', '/files/vestes/veste-jean-oversize.ai', '/files/vestes/veste-jean-oversize-instructions.pdf',
'["veste","jean","oversize","casual","streetwear"]',
'["XS","S","M","L","XL","XXL"]',
'["Patron PDF","Instructions illustrées","Guide de personnalisation","Idées de customisation","Conseils denim"]',
118, 1),

-- ACCESSOIRES
('Sac Cabas en Toile', 'sac-cabas-toile',
'Un grand sac cabas pratique et élégant. Ce patron débutant vous permet de créer un sac robuste avec poches intérieures et fermeture à pression.',
'Sac cabas pratique pour tous les jours',
14.99, 19.99, 'accessoires', 'débutant',
'["https://images.unsplash.com/photo-1590874103328-eac38a683ce7","https://images.unsplash.com/photo-1548036328-c9fa89d128fa"]',
'/files/accessoires/sac-cabas.pdf', '/files/accessoires/sac-cabas.ai', '/files/accessoires/sac-cabas-instructions.pdf',
'["sac","cabas","accessoire","pratique","débutant"]',
'["Unique"]',
'["Patron PDF","Instructions simples","Guide de pose de fermeture","Liste de tissus","Astuces renforts"]',
289, 1),

('Écharpe Infinity Moderne', 'echarpe-infinity-moderne',
'Une écharpe infinity stylée qui se porte de multiples façons. Projet rapide et gratifiant, parfait pour les débutants ou pour offrir.',
'Écharpe circulaire tendance et polyvalente',
9.99, NULL, 'accessoires', 'débutant',
'["https://images.unsplash.com/photo-1520903920243-00d872a2d1c9","https://images.unsplash.com/photo-1606760227091-3dd870d97f1d"]',
'/files/accessoires/echarpe-infinity.pdf', '/files/accessoires/echarpe-infinity.ai', '/files/accessoires/echarpe-infinity-instructions.pdf',
'["écharpe","accessoire","hiver","facile","cadeau"]',
'["Unique"]',
'["Patron PDF","Instructions rapides","Guide de tissus","Variations de style","Conseils d\'entretien"]',
412, 1),

('Ceinture Obi Japonaise', 'ceinture-obi-japonaise',
'Une ceinture Obi inspirée du style japonais, parfaite pour marquer la taille sur robes et tuniques. Apprenez les techniques de pliage et de nouage traditionnelles.',
'Ceinture large style japonais',
12.99, 16.99, 'accessoires', 'débutant',
'["https://images.unsplash.com/photo-1553062407-98eeb64c6a62","https://images.unsplash.com/photo-1624206112918-b5f8e32e7b90"]',
'/files/accessoires/ceinture-obi.pdf', '/files/accessoires/ceinture-obi.ai', '/files/accessoires/ceinture-obi-instructions.pdf',
'["ceinture","obi","japonais","accessoire","ethnique"]',
'["Unique - Ajustable"]',
'["Patron PDF","Guide de nouage","Techniques de pliage","Inspiration styling","Vidéo démonstration"]',
167, 1);

-- =====================================================
-- DONNÉES DE TEST: orders
-- =====================================================
INSERT INTO orders (orderNumber, userId, customerEmail, totalAmount, status, paymentMethod, paymentId, downloadsLeft, downloadExpiry, shippingAddress) VALUES
('ORD-2024-001', 2, 'sophie.martin@example.com', 64.98, 'completed', 'carte', 'pay_abc123xyz', 3, DATE_ADD(NOW(), INTERVAL 30 DAY), '{"street":"28 Avenue des Champs","city":"Lyon","postalCode":"69001","country":"France"}'),
('ORD-2024-002', 3, 'lucas.bernard@example.com', 39.99, 'completed', 'paypal', 'pay_def456uvw', 2, DATE_ADD(NOW(), INTERVAL 25 DAY), '{"street":"42 Rue du Commerce","city":"Marseille","postalCode":"13001","country":"France"}'),
('ORD-2024-003', 4, 'julie.petit@example.com', 87.97, 'paid', 'carte', 'pay_ghi789rst', 3, DATE_ADD(NOW(), INTERVAL 30 DAY), '{"street":"7 Boulevard Saint-Michel","city":"Toulouse","postalCode":"31000","country":"France"}'),
('ORD-2024-004', 5, 'thomas.robert@example.com', 24.99, 'processing', 'carte', 'pay_jkl012mno', 3, DATE_ADD(NOW(), INTERVAL 30 DAY), '{"street":"19 Place de la République","city":"Nice","postalCode":"06000","country":"France"}'),
('ORD-2024-005', 2, 'sophie.martin@example.com', 102.97, 'completed', 'carte', 'pay_pqr345stu', 1, DATE_ADD(NOW(), INTERVAL 20 DAY), '{"street":"28 Avenue des Champs","city":"Lyon","postalCode":"69001","country":"France"}');

-- =====================================================
-- DONNÉES DE TEST: order_items
-- =====================================================
INSERT INTO order_items (orderId, templateId, quantity, price, templateName) VALUES
-- Commande 1
(1, 1, 1, 29.99, 'Robe d\'Été Bohème'),
(1, 3, 1, 34.99, 'Robe Vintage Années 50'),

-- Commande 2
(2, 5, 1, 39.99, 'Jean Slim Classique'),

-- Commande 3
(3, 2, 1, 49.99, 'Robe de Soirée Élégante'),
(3, 6, 1, 27.99, 'Chemise Classique Homme'),
(3, 10, 1, 9.99, 'Écharpe Infinity Moderne'),

-- Commande 4
(4, 4, 1, 24.99, 'Pantalon Palazzo Fluide'),

-- Commande 5
(5, 8, 1, 54.99, 'Blazer Structuré Femme'),
(5, 9, 1, 44.99, 'Veste en Jean Oversize'),
(5, 11, 1, 12.99, 'Ceinture Obi Japonaise');

-- =====================================================
-- VÉRIFICATION DES DONNÉES
-- =====================================================
SELECT 'Base de données créée avec succès!' as Message;
SELECT COUNT(*) as NombreUtilisateurs FROM users;
SELECT COUNT(*) as NombreTemplates FROM templates;
SELECT COUNT(*) as NombreCommandes FROM orders;
SELECT COUNT(*) as NombreArticlesCommandes FROM order_items;

-- Afficher quelques exemples
SELECT '--- EXEMPLE DE DONNÉES ---' as Info;
SELECT name, category, price, difficulty FROM templates LIMIT 5;
SELECT orderNumber, totalAmount, status FROM orders LIMIT 5;
