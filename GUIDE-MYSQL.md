# 🚀 Guide de Configuration MySQL

## Prérequis
Avant de commencer, assurez-vous d'avoir **MySQL installé** sur votre machine.

## 📋 Étapes de Configuration

### 1️⃣ Installer MySQL (si ce n'est pas déjà fait)

**Pour Windows:**
- Téléchargez MySQL depuis: https://dev.mysql.com/downloads/installer/
- Installez MySQL Server
- Notez le mot de passe root que vous définissez lors de l'installation

**Vérifier que MySQL fonctionne:**
```powershell
mysql --version
```

---

### 2️⃣ Créer la Base de Données

**Option A: Via MySQL Workbench (Interface Graphique)**
1. Ouvrez MySQL Workbench
2. Connectez-vous avec votre utilisateur root
3. Cliquez sur "File" → "Open SQL Script"
4. Ouvrez le fichier: `backend/scripts/create-database.sql`
5. Cliquez sur l'icône ⚡ (Execute)

**Option B: Via la ligne de commande**
```powershell
# Se connecter à MySQL
mysql -u root -p

# Exécuter le script SQL
source backend/scripts/create-database.sql

# Ou directement:
CREATE DATABASE gabarits_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### 3️⃣ Configurer le fichier .env

Ouvrez `backend/.env` et mettez à jour avec vos identifiants MySQL:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gabarits_shop
DB_USER=root
DB_PASSWORD=VOTRE_MOT_DE_PASSE_MYSQL_ICI
```

⚠️ **Important:** Remplacez `VOTRE_MOT_DE_PASSE_MYSQL_ICI` par votre vrai mot de passe MySQL!

---

### 4️⃣ Installer les dépendances MySQL

```powershell
cd backend
npm install mysql2
```

---

### 5️⃣ Initialiser les Tables et les Données

```powershell
# Depuis le dossier backend
node scripts/init-database.js
```

Ce script va:
- ✅ Se connecter à MySQL
- ✅ Créer toutes les tables (orders, order_items, users, templates)
- ✅ Insérer des données de test

---

### 6️⃣ Redémarrer le Serveur

Arrêtez le serveur actuel (Ctrl+C) et relancez-le:

```powershell
# Redémarrer depuis le dossier racine
npm run server
```

Vous devriez voir:
```
🔗 Connexion à MySQL...
✅ MySQL connecté avec succès!
📁 Base de données: gabarits_shop
🖥️  Serveur: localhost:3306
```

---

### 7️⃣ Tester l'API

Ouvrez votre navigateur et allez sur:
- http://localhost:5000/api/orders

Vous devriez maintenant voir les données qui viennent de MySQL! 🎉

---

## 🔍 Dépannage

### Erreur: "Access denied for user 'root'@'localhost'"
➡️ Vérifiez votre mot de passe dans le fichier `.env`

### Erreur: "Unknown database 'gabarits_shop'"
➡️ Créez la base de données avec le script SQL (étape 2)

### Erreur: "Can't connect to MySQL server"
➡️ Vérifiez que MySQL est démarré:
```powershell
# Windows
net start MySQL80
```

---

## 📊 Commandes MySQL Utiles

```sql
-- Se connecter à MySQL
mysql -u root -p

-- Voir toutes les bases de données
SHOW DATABASES;

-- Utiliser la base de données
USE gabarits_shop;

-- Voir toutes les tables
SHOW TABLES;

-- Voir les commandes
SELECT * FROM orders;

-- Voir la structure d'une table
DESCRIBE orders;
```

---

## 🎯 Prochaines Étapes

Une fois MySQL configuré, vous pouvez:
1. ✅ Créer de vraies commandes depuis le frontend
2. ✅ Les voir stockées dans MySQL
3. ✅ Les consulter via l'interface "Mes Commandes"
4. ✅ Gérer votre catalogue de gabarits

---

**Besoin d'aide?** N'hésitez pas à demander! 😊
