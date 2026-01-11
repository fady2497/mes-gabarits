const { sequelize } = require('../config/db');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const db = {};

// Charger tous les modèles
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
  });

// === IMPORTANT : Appeler les associations après avoir chargé tous les modèles ===
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db); // Ceci appelle User.associate(db), Order.associate(db), etc.
  }
});

db.sequelize = sequelize;
db.Sequelize = require('sequelize').Sequelize;

module.exports = db;
