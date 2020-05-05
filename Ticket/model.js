const Sequelize = require("sequelize");
const db = require("../db");
const Event = require("../Event/model");
const User = require("../User/model");

const Ticket = db.define(
  "ticket",
  {
    picture: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
    tableName: "tickets",
  }
);

Ticket.belongsTo(Event);
Event.hasMany(Ticket, {
  allowNull: true,
});

Ticket.belongsTo(User);
User.hasMany(Ticket, {
  allowNull: true,
});

module.exports = Ticket;
