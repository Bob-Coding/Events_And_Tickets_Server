const Sequelize = require("sequelize");
const url =
  process.env.DATABASE_URL ||
  
const db = new Sequelize(url);

db.sync({ force: false })
  .then(() => console.log("Database connected"))
  .catch(console.error);

module.exports = db;
