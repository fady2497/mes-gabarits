-- scripts/create-database.sql
-- Script pour créer la base de données MySQL

-- Créer la base de données
CREATE DATABASE IF NOT EXISTS gabarits_shop
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données
USE gabarits_shop;

-- Afficher un message de confirmation
SELECT 'Base de données gabarits_shop créée avec succès!' AS Message;

-- Optionnel: Créer un utilisateur dédié (recommandé pour la production)
-- CREATE USER IF NOT EXISTS 'gabarits_user'@'localhost' IDENTIFIED BY 'VotreMotDePasseSecurise';
-- GRANT ALL PRIVILEGES ON gabarits_shop.* TO 'gabarits_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Afficher les bases de données
SHOW DATABASES;
